import React, { useState } from "react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { updateCommentCount } from "@/config/redux/reducer/postReducer";
import clientApi from "@/services/clientApi";
import styles from "./styles.module.css";
import CommentInput from "./CommentInput";

export default function CommentItem({ initialComment, post, myId, onRemoved }) {
  const [comment, setComment] = useState(initialComment);
  const [isEditing, setIsEditing] = useState(false);
  const [editedBody, setEditedBody] = useState(comment.body || "");
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [isReplying, setIsReplying] = useState(false);
  const [replyBody, setReplyBody] = useState("");

  const [replies, setReplies] = useState([]);
  const [showReplies, setShowReplies] = useState(false);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const dispatch = useDispatch();

  // Sync author when the parent hydrates a freshly-posted comment
  React.useEffect(() => {
    if (initialComment?.author?.name) {
      setComment((prev) => ({ ...prev, author: initialComment.author }));
    }
  }, [initialComment?.author?.name]);

  const toggleLike = async () => {
    try {
      const { data } = await clientApi.post(`/posts/${post._id}/comments/${comment._id}/like`);
      setComment((prev) => ({
        ...prev,
        isLiked: data.liked,
        likeCount: data.likeCount
      }));
    } catch (error) {
      console.error("Failed to toggle comment like", error);
    }
  };

  const saveEditComment = async () => {
    const body = editedBody.trim();
    if (!body) return;
    try {
      const { data } = await clientApi.patch(
        `/posts/${post._id}/comments/${comment._id}`,
        { body }
      );
      setComment((prev) => ({ ...prev, ...data.comment }));
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to edit comment", error);
    }
  };

  const deleteCommentRequest = async () => {
    const postId = String(post._id);
    const commentId = String(comment._id);
    try {
      await clientApi.delete(`/posts/${postId}/comments/${commentId}`);
      setConfirmDelete(false);
      dispatch(updateCommentCount({ postId: post._id, count: -1 }));
      onRemoved?.(comment._id);
    } catch (error) {
      console.error("Failed to delete comment", error.response?.data || error.message);
      setConfirmDelete(false);
    }
  };

  const toggleReplies = async () => {
    if (showReplies) {
      setShowReplies(false);
      return;
    }
    setShowReplies(true);
    if (replies.length > 0) return; // Already fetched
    setLoadingReplies(true);
    try {
      const { data } = await clientApi.get(
        `/posts/${post._id}/comments/${comment._id}/replies`
      );
      setReplies(data.replies || []);
    } catch (error) {
      console.error("Failed to fetch replies", error);
    } finally {
      setLoadingReplies(false);
    }
  };

  const submitReply = async (e) => {
    e.preventDefault();
    const body = replyBody.trim();
    if (!body) return;
    try {
      const { data } = await clientApi.post(
        `/posts/${post._id}/comments/${comment._id}/reply`,
        { body }
      );
      setReplies((prev) => [...prev, data.comment]);
      setIsReplying(false);
      setReplyBody("");
      setShowReplies(true);
      setComment((prev) => ({ ...prev, replyCount: (prev.replyCount || 0) + 1 }));
    } catch (error) {
      console.error("Failed to reply", error);
    }
  };

  const authorId = comment.author?._id;

  return (
    <div className={styles.commentItem}>
      {authorId ? (
        <Link href={`/profile/${authorId}`}>
          <img
            src={
              comment.author?.profilePicture ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            alt=""
            className={styles.commentAvatar}
          />
        </Link>
      ) : (
        <img
          src={
            comment.author?.profilePicture ||
            "https://cdn-icons-png.flaticon.com/512/149/149071.png"
          }
          alt=""
          className={styles.commentAvatar}
        />
      )}
      <div className={styles.commentBodyContainer}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}>
          {authorId ? (
            <Link href={`/profile/${authorId}`} className={styles.commentAuthorLink}>
              <p className={styles.commentAuthorName}>{comment.author?.name || "Unknown"}</p>
            </Link>
          ) : (
            <p className={styles.commentAuthorName}>{comment.author?.name || "Unknown"}</p>
          )}

          {myId && comment.author?._id && String(comment.author._id) === String(myId) && (
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <button
                className={styles.actionButton}
                type="button"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </button>
              {confirmDelete ? (
                <>
                  <button
                    className={styles.actionButton}
                    type="button"
                    onClick={() => setConfirmDelete(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className={styles.commentSubmit}
                    type="button"
                    onClick={deleteCommentRequest}
                  >
                    Confirm
                  </button>
                </>
              ) : (
                <button
                  className={styles.actionButton}
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                >
                  Delete
                </button>
              )}
            </div>
          )}
        </div>

        {isEditing ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <input
              value={editedBody}
              onChange={(e) => setEditedBody(e.target.value)}
              className={styles.commentInput}
            />
            <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
              <button
                className={styles.actionButton}
                type="button"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
              <button
                className={styles.commentSubmit}
                type="button"
                onClick={saveEditComment}
                disabled={!editedBody.trim()}
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
            onClick={toggleLike}
          >
            <i
              className={`fa-solid fa-thumbs-up ${comment.isLiked ? styles.blue : ""}`}
              style={{ marginRight: "4px" }}
            ></i>
            {comment.likeCount || 0}
          </button>
          <button
            className={styles.actionButton}
            type="button"
            onClick={() => setIsReplying(!isReplying)}
          >
            Reply
          </button>
          <button
            className={styles.actionButton}
            type="button"
            onClick={toggleReplies}
          >
            {loadingReplies
              ? "Loading..."
              : showReplies
                ? "Hide replies"
                : `View replies (${comment.replyCount || 0})`}
          </button>
        </div>

        {isReplying && (
          <CommentInput
            value={replyBody}
            onChange={(val) => setReplyBody(val.target ? val.target.value : val)}
            onSubmit={submitReply}
            onCancel={() => setIsReplying(false)}
            placeholder="Write a reply..."
            submitLabel="Reply"
            isReply={true}
          />
        )}

        {showReplies && replies.length > 0 && (
          <div style={{ marginTop: "10px", paddingLeft: "10px", borderLeft: "2px solid #ddd" }}>
            {replies.map((reply) => {
              const rid = reply.author?._id;
              return (
                <div key={reply._id} style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                  {rid ? (
                    <Link href={`/profile/${rid}`}>
                      <img
                        src={
                          reply.author?.profilePicture ||
                          "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                        }
                        alt=""
                        className={styles.commentAvatar}
                      />
                    </Link>
                  ) : (
                    <img
                      src={
                        reply.author?.profilePicture ||
                        "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                      }
                      alt=""
                      className={styles.commentAvatar}
                    />
                  )}
                  <div className={styles.commentBodyContainer}>
                    {rid ? (
                      <Link href={`/profile/${rid}`} className={styles.commentAuthorLink}>
                        <p className={styles.commentAuthorName}>{reply.author?.name || "Unknown"}</p>
                      </Link>
                    ) : (
                      <p className={styles.commentAuthorName}>{reply.author?.name || "Unknown"}</p>
                    )}
                    <p className={styles.commentBodyText}>{reply.body}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
