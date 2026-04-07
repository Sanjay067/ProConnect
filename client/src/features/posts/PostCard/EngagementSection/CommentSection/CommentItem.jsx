import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { updateCommentCount } from "@/config/redux/reducer/postReducer";
import ConfirmDialog from "@/components/ConfirmDialog";
import clientApi from "@/services/clientApi";
import styles from "./styles.module.css";
import Like from "../Like";

export default function CommentItem({ initialComment, post, myId, onRemoved }) {
  const [comment, setComment] = useState(initialComment);
  const [isEditing, setIsEditing] = useState(false);
  const [editedBody, setEditedBody] = useState(comment.body || "");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const [isReplying, setIsReplying] = useState(false);
  const [replyBody, setReplyBody] = useState("");

  const [replies, setReplies] = useState([]);
  const [showReplies, setShowReplies] = useState(false);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const dispatch = useDispatch();

  // Close menu on outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  React.useEffect(() => {
    if (initialComment?.author?.name) {
      setComment((prev) => ({ ...prev, author: initialComment.author }));
    }
  }, [initialComment?.author?.name]);

  const toggleLike = async () => {
    try {
      const { data } = await clientApi.post(
        `/posts/${post._id}/comments/${comment._id}/like`,
      );
      setComment((prev) => ({
        ...prev,
        isLiked: data.liked,
        likeCount: data.likeCount,
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
        { body },
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
      console.error(
        "Failed to delete comment",
        error.response?.data || error.message,
      );
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
        `/posts/${post._id}/comments/${comment._id}/replies`,
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
        { body },
      );
      setReplies((prev) => [...prev, data.comment]);
      setIsReplying(false);
      setReplyBody("");
      setShowReplies(true);
      setComment((prev) => ({
        ...prev,
        replyCount: (prev.replyCount || 0) + 1,
      }));
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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "10px",
          }}
        >
          {authorId ? (
            <Link
              href={`/profile/${authorId}`}
              className={styles.commentAuthorLink}
            >
              <p className={styles.commentAuthorName}>
                {comment.author?.name || "Unknown"}
              </p>
            </Link>
          ) : (
            <p className={styles.commentAuthorName}>
              {comment.author?.name || "Unknown"}
            </p>
          )}

          {myId &&
            comment.author?._id &&
            String(comment.author._id) === String(myId) && (
              <div className={styles.commentMenuWrapper} ref={menuRef}>
                <button
                  className={styles.commentDotsBtn}
                  type="button"
                  onClick={() => setMenuOpen(!menuOpen)}
                  aria-label="Comment options"
                >
                  <i className="fa-solid fa-ellipsis-vertical"></i>
                </button>

                {menuOpen && (
                  <div className={styles.commentDropdown}>
                    <button
                      className={styles.commentDropdownItem}
                      type="button"
                      onClick={() => { setMenuOpen(false); setIsEditing(true); }}
                    >
                      <i className="fa-regular fa-pen-to-square"></i>
                      Edit
                    </button>
                    <button
                      className={`${styles.commentDropdownItem} ${styles.commentDropdownDanger}`}
                      type="button"
                      onClick={() => { setMenuOpen(false); setConfirmDelete(true); }}
                    >
                      <i className="fa-regular fa-trash-can"></i>
                      Delete
                    </button>
                  </div>
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
            <div
              style={{
                display: "flex",
                gap: "8px",
                justifyContent: "flex-end",
              }}
            >
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
        <Like
          isLiked={comment.isLiked}
          likeCount={comment.likeCount}
          onToggleLike={toggleLike}
        />
      </div>

      {/* Delete confirmation dialog */}
      {confirmDelete && (
        <ConfirmDialog
          title="Delete Comment"
          message="Are you sure you want to delete this comment?"
          confirmLabel="Delete"
          cancelLabel="Cancel"
          confirmVariant="danger"
          onConfirm={deleteCommentRequest}
          onCancel={() => setConfirmDelete(false)}
        />
      )}
    </div>
  );
}

