import Connection from "../models/connections.model.js";
import Post from "../models/posts.model.js";
import Like from "../models/likes.model.js";

function computeScore(post) {
  const likeScore = Math.log1p(post.likeCount || 0) * 2;
  const commentScore = Math.log1p(post.commentCount || 0) * 3;

  const createdAt = post.createdAt ? new Date(post.createdAt).getTime() : Date.now();
  const ageHours = Math.max(0, (Date.now() - createdAt) / (1000 * 60 * 60));
  const recencyScore = 1 / (1 + ageHours / 6); // ~1 for new, decays over time

  return likeScore + commentScore + recencyScore;
}

export const getFeed = async (req, res) => {
  try {
    const userId = req.user._id;
    const page = Math.max(1, Number(req.query.page || 1));
    const limit = Math.min(50, Math.max(1, Number(req.query.limit || 20)));

    const connections = await Connection.find({
      status: "accepted",
      $or: [{ senderId: userId }, { receiverId: userId }],
    }).select("senderId receiverId");

    const connectedUserIds = new Set();
    for (const c of connections) {
      const sender = String(c.senderId);
      const receiver = String(c.receiverId);
      if (sender !== String(userId)) connectedUserIds.add(sender);
      if (receiver !== String(userId)) connectedUserIds.add(receiver);
    }

    const authorIds = [userId, ...Array.from(connectedUserIds)];

    const match = { author: { $in: authorIds }, isActive: true };
    const totalInDb = await Post.countDocuments(match);

    const maxFetch = Math.min(
      1200,
      Math.max(100, Number(process.env.FEED_MAX_CANDIDATES || 400)),
    );
    const dynamicWindow = Math.max(100, page * limit * 6);
    const fetchLimit = Math.min(maxFetch, totalInDb, dynamicWindow);

    const recentPosts = await Post.find(match)
      .populate("author", "name username profilePicture")
      .sort({ createdAt: -1 })
      .limit(fetchLimit);

    const postIds = recentPosts.map((p) => p._id);
    const userLikes = await Like.find({
      userId,
      targetId: { $in: postIds },
      targetType: "Post",
    }).select("targetId");
    const likedSet = new Set(userLikes.map((l) => String(l.targetId)));

    const scored = recentPosts
      .map((p) => ({ post: p, score: computeScore(p) }))
      .sort(
        (a, b) =>
          b.score - a.score ||
          new Date(b.post.createdAt) - new Date(a.post.createdAt),
      );

    const start = (page - 1) * limit;
    const paged = scored.slice(start, start + limit).map((x) => ({
      ...x.post.toObject(),
      score: x.score,
      isLiked: likedSet.has(String(x.post._id)),
    }));

    const hasMore = start + paged.length < scored.length;
    const truncated = totalInDb > fetchLimit;

    return res.status(200).json({
      message: "Feed fetched successfully",
      page,
      limit,
      total: scored.length,
      totalInNetwork: totalInDb,
      hasMore,
      truncated,
      posts: paged,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

