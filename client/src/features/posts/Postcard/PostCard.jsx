import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deletePost, editPost, toggleLikePost } from "@/config/redux/action/postAction";
import clientApi from "@/services/clientApi";
import { sendConnections } from "@/config/redux/action/connectionAction.js";
import styles from "./styles.module.css";

export default function PostCard({ post, isOwnProfile = false }) {
  const dispatch = useDispatch();
  const myId = useSelector((state) => state.profile.profile?.userId?._id);
  const isPostAuthor =
    myId && post?.author?._id ? String(myId) === String(post.author._id) : false;

  // Local state just for this specific post's comments
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [isEditingPost, setIsEditingPost] = useState(false);
  const [editedPostBody, setEditedPostBody] = useState(post?.body || "");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedCommentBody, setEditedCommentBody] = useState("");
  const [replyingToCommentId, setReplyingToCommentId] = useState(null);
  const [replyBody, setReplyBody] = useState("");
  const [repliesByCommentId, setRepliesByCommentId] = useState({});
  const [loadingRepliesFor, setLoadingRepliesFor] = useState(null);

  // Fetch comments from the backend when the user clicks "Comment"
  const handleToggleComments = async () => {
    setShowComments(!showComments);

    // Only fetch if we are opening it and haven't fetched yet
    if (!showComments && comments.length === 0) {
      setIsLoadingComments(true);
      try {
        const { data } = await clientApi.get(`/posts/${post._id}/comments`);
        setComments(data.comments);
      } catch (error) {
        console.error("Failed to fetch comments", error);
      } finally {
        setIsLoadingComments(false);
      }
    }
  };

  const handleConnect = () => {
    const receiverId = post?.author?._id;
    if (!receiverId) return;
    if (myId && String(receiverId) === String(myId)) return; // Prevent self-connect
    dispatch(sendConnections(receiverId));
  };

  // Submit a new comment
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const { data } = await clientApi.post(`/posts/${post._id}/comments`, {
        body: newComment,
      });

      // Add the new comment to the top of our local list!
      setComments([data.comment, ...comments]);
      setNewComment("");
    } catch (error) {
      console.error("Failed to add comment", error);
    }
  };

  const startEditComment = (comment) => {
    if (!comment?._id) return;
    setEditingCommentId(comment._id);
    setEditedCommentBody(comment.body || "");
  };

  const cancelEditComment = () => {
    setEditingCommentId(null);
    setEditedCommentBody("");
  };

  const saveEditComment = async (commentId) => {
    const body = editedCommentBody.trim();
    if (!body) return;
    try {
      const { data } = await clientApi.patch(
        `/posts/${post._id}/comments/${commentId}`,
        { body },
      );
      setComments((prev) =>
        prev.map((c) => (c._id === commentId ? { ...c, ...data.comment } : c)),
      );
      cancelEditComment();
    } catch (error) {
      console.error("Failed to edit comment", error);
    }
  };

  const deleteComment = async (commentId) => {
    const ok = window.confirm("Delete this comment?");
    if (!ok) return;
    try {
      await clientApi.delete(`/posts/${post._id}/comments/${commentId}`);
      setComments((prev) =>
        prev.map((c) =>
          c._id === commentId ? { ...c, isDeleted: true, body: "" } : c,
        ),
      );
    } catch (error) {
      console.error("Failed to delete comment", error);
    }
  };

  const toggleReplies = async (commentId) => {
    const existing = repliesByCommentId[commentId];
    if (existing) {
      setRepliesByCommentId((prev) => {
        const next = { ...prev };
        delete next[commentId];
        return next;
      });
      return;
    }

    setLoadingRepliesFor(commentId);
    try {
      const { data } = await clientApi.get(
        `/posts/${post._id}/comments/${commentId}/replies`,
      );
      setRepliesByCommentId((prev) => ({ ...prev, [commentId]: data.replies }));
    } catch (error) {
      console.error("Failed to fetch replies", error);
    } finally {
      setLoadingRepliesFor(null);
    }
  };

  const startReply = (commentId) => {
    setReplyingToCommentId(commentId);
    setReplyBody("");
  };

  const cancelReply = () => {
    setReplyingToCommentId(null);
    setReplyBody("");
  };

  const submitReply = async (e) => {
    e.preventDefault();
    if (!replyingToCommentId) return;
    const body = replyBody.trim();
    if (!body) return;

    try {
      const { data } = await clientApi.post(
        `/posts/${post._id}/comments/${replyingToCommentId}/reply`,
        { body },
      );

      setRepliesByCommentId((prev) => ({
        ...prev,
        [replyingToCommentId]: [
          ...(prev[replyingToCommentId] || []),
          data.comment,
        ],
      }));

      cancelReply();
    } catch (error) {
      console.error("Failed to reply", error);
    }
  };

  const handleStartEditPost = () => {
    setEditedPostBody(post?.body || "");
    setIsEditingPost(true);
  };

  const handleCancelEditPost = () => {
    setEditedPostBody(post?.body || "");
    setIsEditingPost(false);
  };

  const handleSaveEditPost = async () => {
    const nextBody = editedPostBody.trim();
    if (!nextBody) return;
    await dispatch(editPost({ postId: post._id, body: nextBody }));
    setIsEditingPost(false);
  };

  const handleDeletePost = async () => {
    const ok = window.confirm("Delete this post?");
    if (!ok) return;
    await dispatch(deletePost(post._id));
  };

  return (
    <div className={styles.postCard}>
      {/* Author Info */}
      <div className={styles.authorContainer}>
        <img
          src={
            post.author?.profilePicture ||
            "https://cdn-icons-png.flaticon.com/512/149/149071.png"
          }
          alt="Avatar"
          className={styles.avatar}
        />
        <div className={styles.authorDetails}>
          <p className={styles.authorName}>{post.author?.name}</p>
          <p className={styles.authorUsername}>@{post.author?.username}</p>
        </div>
        {!(myId && post?.author?._id && String(post.author._id) === String(myId)) && (
          <button
            className={styles.followButton}
            onClick={handleConnect}
            disabled={!post?.author?._id}
          >
            Connect
          </button>
        )}

        {isPostAuthor && isOwnProfile && (
          <div style={{ marginLeft: "auto", display: "flex", gap: "8px" }}>
            {!isEditingPost && (
              <>
                <button
                  className={styles.actionButton}
                  onClick={handleStartEditPost}
                  type="button"
                >
                  Edit
                </button>
                <button
                  className={styles.actionButton}
                  onClick={handleDeletePost}
                  type="button"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Post Body */}
      {isEditingPost ? (
        <div style={{ display: "flex", gap: "8px", flexDirection: "column" }}>
          <textarea
            value={editedPostBody}
            onChange={(e) => setEditedPostBody(e.target.value)}
            rows={3}
            style={{
              width: "100%",
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "10px",
              resize: "vertical",
            }}
          />
          <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
            <button
              className={styles.actionButton}
              onClick={handleCancelEditPost}
              type="button"
            >
              Cancel
            </button>
            <button
              className={styles.commentSubmit}
              onClick={handleSaveEditPost}
              type="button"
              disabled={!editedPostBody.trim()}
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <p className={styles.postBody}>{post.body}</p>
      )}

      {/* Engagement Bar */}
      <div className={styles.engagementBar}>
        <button
          onClick={() => dispatch(toggleLikePost(post._id))}
          className={styles.actionButton}
        >
          👍 Like ({post.likeCount || 0})
        </button>
        <button onClick={handleToggleComments} className={styles.actionButton}>
          💬 Comment ({post.commentCount || 0})
        </button>
      </div>

      {/* Comment Section (Dropdown) */}
      {showComments && (
        <div className={styles.commentSection}>
          {/* Add Comment Form */}
          <form onSubmit={handleAddComment} className={styles.commentForm}>
            <input
              type="text"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className={styles.commentInput}
            />
            <button type="submit" className={styles.commentSubmit}>
              Post
            </button>
          </form>

          {/* Comment List */}
          {isLoadingComments ? (
            <p className={styles.loadingText}>Loading comments...</p>
          ) : comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment._id} className={styles.commentItem}>
                <img
                  src={
                    comment.author?.profilePicture ||
                    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  }
                  alt="Avatar"
                  className={styles.commentAvatar}
                />
                <div className={styles.commentBodyContainer}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "10px",
                    }}
                  >
                    <p className={styles.commentAuthorName}>
                      {comment.author?.name || "Unknown"}
                    </p>

                    {myId &&
                      comment.author?._id &&
                      String(comment.author._id) === String(myId) && (
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button
                            className={styles.actionButton}
                            type="button"
                            onClick={() => startEditComment(comment)}
                            disabled={comment.isDeleted}
                          >
                            Edit
                          </button>
                          <button
                            className={styles.actionButton}
                            type="button"
                            onClick={() => deleteComment(comment._id)}
                            disabled={comment.isDeleted}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                  </div>

                  {comment.isDeleted ? (
                    <p className={styles.commentBodyText} style={{ color: "#999" }}>
                      (deleted)
                    </p>
                  ) : editingCommentId === comment._id ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <input
                        value={editedCommentBody}
                        onChange={(e) => setEditedCommentBody(e.target.value)}
                        className={styles.commentInput}
                      />
                      <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                        <button
                          className={styles.actionButton}
                          type="button"
                          onClick={cancelEditComment}
                        >
                          Cancel
                        </button>
                        <button
                          className={styles.commentSubmit}
                          type="button"
                          onClick={() => saveEditComment(comment._id)}
                          disabled={!editedCommentBody.trim()}
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className={styles.commentBodyText}>{comment.body}</p>
                  )}

                  <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                    <button
                      className={styles.actionButton}
                      type="button"
                      onClick={() => startReply(comment._id)}
                      disabled={comment.isDeleted}
                    >
                      Reply
                    </button>
                    <button
                      className={styles.actionButton}
                      type="button"
                      onClick={() => toggleReplies(comment._id)}
                      disabled={comment.isDeleted}
                    >
                      {loadingRepliesFor === comment._id
                        ? "Loading..."
                        : repliesByCommentId[comment._id]
                          ? "Hide replies"
                          : `View replies (${comment.replyCount || 0})`}
                    </button>
                  </div>

                  {replyingToCommentId === comment._id && (
                    <form onSubmit={submitReply} className={styles.commentForm} style={{ marginTop: "10px" }}>
                      <input
                        type="text"
                        placeholder="Write a reply..."
                        value={replyBody}
                        onChange={(e) => setReplyBody(e.target.value)}
                        className={styles.commentInput}
                      />
                      <button
                        type="button"
                        className={styles.actionButton}
                        onClick={cancelReply}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className={styles.commentSubmit}
                        disabled={!replyBody.trim()}
                      >
                        Reply
                      </button>
                    </form>
                  )}

                  {repliesByCommentId[comment._id]?.length > 0 && (
                    <div style={{ marginTop: "10px", paddingLeft: "10px", borderLeft: "2px solid #ddd" }}>
                      {repliesByCommentId[comment._id].map((reply) => (
                        <div key={reply._id} style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                          <img
                            src={
                              reply.author?.profilePicture ||
                              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                            }
                            alt="Avatar"
                            className={styles.commentAvatar}
                          />
                          <div className={styles.commentBodyContainer}>
                            <p className={styles.commentAuthorName}>
                              {reply.author?.name || "Unknown"}
                            </p>
                            <p className={styles.commentBodyText}>{reply.body}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className={styles.emptyCommentText}>No comments yet.</p>
          )}
        </div>
      )}
    </div>
  );
}
