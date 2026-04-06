import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { openMessageSidebar } from "@/config/redux/reducer/postReducer";
import { removeAcceptedConnection } from "@/config/redux/action/connectionAction";
import ConfirmDialog from "@/components/ConfirmDialog";
import Link from "next/link";
import styles from "./styles.module.css";

export default function UserSection({
  post,
  isOwnProfile,
  isEditingPost,
  onStartEdit,
  onDeleteRequest,
}) {
  const dispatch = useDispatch();
  const myId = useSelector((state) => state.profile.profile?.userId?._id);
  const connections = useSelector((state) => state.connection.connections);
  const isPostAuthor =
    myId && post?.author?._id
      ? String(myId) === String(post.author._id)
      : false;
  const authorId = post?.author?._id;

  const [optionsOpen, setOptionsOpen] = useState(false);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const optionsRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (optionsRef.current && !optionsRef.current.contains(e.target)) {
        setOptionsOpen(false);
      }
    };
    if (optionsOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [optionsOpen]);

  // find connection between me and post author
  const findConnectionId = () => {
    if (!myId || !authorId || !connections?.length) return null;
    const match = connections.find((c) => {
      const sId = String(c.senderId?._id || c.senderId);
      const rId = String(c.receiverId?._id || c.receiverId);
      return (
        (sId === String(myId) && rId === String(authorId)) ||
        (rId === String(myId) && sId === String(authorId))
      );
    });
    return match?._id || null;
  };

  const handleMessage = () => {
    setOptionsOpen(false);
    dispatch(
      openMessageSidebar({
        _id: post.author._id,
        name: post.author.name,
        username: post.author.username,
        profilePicture: post.author.profilePicture,
      }),
    );
  };

  const handleRemoveClick = () => {
    setOptionsOpen(false);
    setShowRemoveConfirm(true);
  };

  const confirmRemoveConnection = async () => {
    const connectionId = findConnectionId();
    if (connectionId) {
      await dispatch(removeAcceptedConnection(connectionId));
    }
    setShowRemoveConfirm(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.authorContainer}>
        <Link href={authorId ? `/profile/${authorId}` : "#"}>
          <img
            src={
              post.author?.profilePicture ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            alt="Avatar"
            className={styles.avatar}
          />
        </Link>
        <div className={styles.authorDetails}>
          <Link
            href={authorId ? `/profile/${authorId}` : "#"}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <p className={styles.authorName}>{post.author?.name}</p>
          </Link>
          <p className={styles.authorUsername}>@{post.author?.username}</p>
        </div>
      </div>

      {/* Three-dot menu — only for OTHER users' posts */}
      {authorId && !isPostAuthor && (
        <div className={styles.optionsWrapper} ref={optionsRef}>
          <button
            className={styles.dotsButton}
            onClick={() => setOptionsOpen(!optionsOpen)}
            aria-label="Post options"
            type="button"
          >
            <i className="fa-solid fa-ellipsis"></i>
          </button>

          {optionsOpen && (
            <div className={styles.optionsDropdown}>
              <button
                className={styles.optionItem}
                onClick={handleMessage}
                type="button"
              >
                <i className="fa-regular fa-envelope"></i>
                Message
              </button>
              <button
                className={styles.optionItem}
                onClick={handleRemoveClick}
                type="button"
              >
                <i className="fa-solid fa-user-minus"></i>
                Remove Connection
              </button>
            </div>
          )}
        </div>
      )}

      {/* Three-dot menu — for OWN posts on profile page */}
      {isPostAuthor && isOwnProfile && !isEditingPost && (
        <div className={styles.optionsWrapper} ref={!isPostAuthor ? undefined : optionsRef}>
          <button
            className={styles.dotsButton}
            onClick={() => setOptionsOpen(!optionsOpen)}
            aria-label="Post options"
            type="button"
          >
            <i className="fa-solid fa-ellipsis"></i>
          </button>

          {optionsOpen && (
            <div className={styles.optionsDropdown}>
              <button
                className={styles.optionItem}
                onClick={() => { setOptionsOpen(false); onStartEdit(); }}
                type="button"
              >
                <i className="fa-regular fa-pen-to-square"></i>
                Edit Post
              </button>
              <button
                className={`${styles.optionItem} ${styles.optionDanger}`}
                onClick={() => { setOptionsOpen(false); onDeleteRequest(); }}
                type="button"
              >
                <i className="fa-regular fa-trash-can"></i>
                Delete Post
              </button>
            </div>
          )}
        </div>
      )}

      {/* Remove Connection Confirmation Dialog */}
      {showRemoveConfirm && (
        <ConfirmDialog
          title="Remove Connection"
          message={`Are you sure you want to remove your connection with ${post.author?.name || "this user"}?`}
          confirmLabel="Remove"
          cancelLabel="Cancel"
          confirmVariant="danger"
          onConfirm={confirmRemoveConnection}
          onCancel={() => setShowRemoveConfirm(false)}
        />
      )}
    </div>
  );
}
