import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { updateCommentCount } from "@/config/redux/reducer/postReducer";
import ConfirmDialog from "@/components/ConfirmDialog";
import clientApi from "@/services/clientApi";
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
    <div className="mb-4 flex gap-2.5">
      {authorId ? (
        <Link href={`/profile/${authorId}`}>
          <img
            src={
              comment.author?.profilePicture ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            alt=""
          className="h-8 w-8 rounded-full object-cover"
          />
        </Link>
      ) : (
        <img
          src={
            comment.author?.profilePicture ||
            "https://cdn-icons-png.flaticon.com/512/149/149071.png"
          }
          alt=""
          className="h-8 w-8 rounded-full object-cover"
        />
      )}
      <div className="flex-1 rounded-lg bg-neutral-200 px-3 py-2">
        <div className="flex justify-between gap-2.5">
          {authorId ? (
            <Link
              href={`/profile/${authorId}`}
              className="text-inherit no-underline hover:text-[#0a66c2] hover:underline"
            >
              <p className="m-0 text-sm font-bold">
                {comment.author?.name || "Unknown"}
              </p>
            </Link>
          ) : (
            <p className="m-0 text-sm font-bold">
              {comment.author?.name || "Unknown"}
            </p>
          )}

          {myId &&
            comment.author?._id &&
            String(comment.author._id) === String(myId) && (
              <div className="relative" ref={menuRef}>
                <button
                  className="cursor-pointer rounded-full border-none bg-transparent px-1.5 py-0.5 text-[0.95rem] text-gray-400 transition hover:bg-neutral-300 hover:text-gray-700"
                  type="button"
                  onClick={() => setMenuOpen(!menuOpen)}
                  aria-label="Comment options"
                >
                  <i className="fa-solid fa-ellipsis-vertical"></i>
                </button>

                {menuOpen && (
                  <div className="absolute top-[calc(100%+2px)] right-0 z-[200] min-w-[130px] overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
                    <button
                      className="flex w-full cursor-pointer items-center gap-2 border-none bg-transparent px-3.5 py-2 text-left text-sm text-gray-800 transition hover:bg-stone-100"
                      type="button"
                      onClick={() => { setMenuOpen(false); setIsEditing(true); }}
                    >
                      <i className="fa-regular fa-pen-to-square"></i>
                      Edit
                    </button>
                    <button
                      className="flex w-full cursor-pointer items-center gap-2 border-none bg-transparent px-3.5 py-2 text-left text-sm text-[#cc3333] transition hover:bg-[#fdf0f0]"
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
          <div className="flex flex-col gap-2">
            <input
              value={editedBody}
              onChange={(e) => setEditedBody(e.target.value)}
              className="m-0 rounded-full border border-gray-300 px-3 py-2"
            />
            <div className="flex justify-end gap-2">
              <button
                className="cursor-pointer border-none bg-transparent font-bold text-gray-600"
                type="button"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
              <button
                className="cursor-pointer rounded-full border-none bg-[#0a66c2] px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-60"
                type="button"
                onClick={saveEditComment}
                disabled={!editedBody.trim()}
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <p className="m-0 text-[0.95rem]">{comment.body}</p>
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

