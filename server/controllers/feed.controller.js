import mongoose from "mongoose";
import Connection from "../models/connections.model.js";
import Post from "../models/posts.model.js";
import Like from "../models/likes.model.js";
import { cacheGet, cacheSet } from "../config/redis.js";

function buildAuthorObjectIds(userId, connectedUserIds) {
  const ids = [userId, ...connectedUserIds].map((id) =>
    id instanceof mongoose.Types.ObjectId
      ? id
      : new mongoose.Types.ObjectId(String(id)),
  );
  return ids;
}

export const getFeed = async (req, res) => {
  try {
    const userId = req.user._id;
    const page = Math.max(1, Number(req.query.page || 1));
    const limit = Math.min(50, Math.max(1, Number(req.query.limit || 20)));
    const skip = (page - 1) * limit;

    const cacheKey = `feed:${userId}:${page}:${limit}`;
    const cached = await cacheGet(cacheKey);
    if (cached) return res.status(200).json(cached);

    const connections = await Connection.find({
      status: "accepted",
      $or: [{ senderId: userId }, { receiverId: userId }],
    }).select("senderId receiverId");

    const connectedUserIds = new Set();
    for (const c of connections) {
      const sender = String(c.senderId);
      const receiver = String(c.receiverId);
      const me = String(userId);
      if (sender !== me) connectedUserIds.add(sender);
      if (receiver !== me) connectedUserIds.add(receiver);
    }

    const authorIds = buildAuthorObjectIds(userId, Array.from(connectedUserIds));

    const match = { author: { $in: authorIds }, isActive: true };

    const pipeline = [
      { $match: match },
      {
        $addFields: {
          lc: { $ifNull: ["$likeCount", 0] },
          cc: { $ifNull: ["$commentCount", 0] },
        },
      },
      {
        $addFields: {
          likeScore: { $multiply: [2, { $ln: { $add: [1, "$lc"] } }] },
          commentScore: { $multiply: [3, { $ln: { $add: [1, "$cc"] } }] },
          ageMs: { $subtract: ["$$NOW", "$createdAt"] },
        },
      },
      {
        $addFields: {
          ageHours: {
            $max: [0, { $divide: ["$ageMs", 3600000] }],
          },
        },
      },
      {
        $addFields: {
          recencyScore: {
            $divide: [
              1,
              { $add: [1, { $divide: ["$ageHours", 6] }] },
            ],
          },
        },
      },
      {
        $addFields: {
          score: {
            $add: ["$likeScore", "$commentScore", "$recencyScore"],
          },
        },
      },
      {
        $facet: {
          meta: [{ $count: "total" }],
          data: [
            { $sort: { score: -1, createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },
            {
              $lookup: {
                from: "users",
                localField: "author",
                foreignField: "_id",
                as: "authorArr",
                pipeline: [
                  {
                    $project: {
                      name: 1,
                      username: 1,
                      profilePicture: 1,
                    },
                  },
                ],
              },
            },
            {
              $addFields: {
                author: { $arrayElemAt: ["$authorArr", 0] },
              },
            },
            {
              $project: {
                authorArr: 0,
                lc: 0,
                cc: 0,
                ageMs: 0,
                ageHours: 0,
                likeScore: 0,
                commentScore: 0,
                recencyScore: 0,
              },
            },
          ],
        },
      },
    ];

    const agg = await Post.aggregate(pipeline).allowDiskUse(true);
    const bucket = agg[0] || { meta: [], data: [] };
    const total = bucket.meta[0]?.total ?? 0;
    const rows = bucket.data || [];

    const postIds = rows.map((p) => p._id);
    const userLikes = await Like.find({
      userId,
      targetId: { $in: postIds },
      targetType: "Post",
    }).select("targetId");
    const likedSet = new Set(userLikes.map((l) => String(l.targetId)));

    const posts = rows.map((p) => ({
      ...p,
      isLiked: likedSet.has(String(p._id)),
    }));

    const totalInDb = await Post.countDocuments(match);
    const hasMore = skip + posts.length < total;
    const body = {
      message: "Feed fetched successfully",
      page,
      limit,
      total,
      totalInNetwork: totalInDb,
      hasMore,
      truncated: false,
      posts,
    };

    await cacheSet(cacheKey, body, Number(process.env.FEED_CACHE_TTL_SEC || 30));

    return res.status(200).json(body);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
