import React from "react";
import { useDispatch } from "react-redux";
import { toggleLikePost } from "@/config/redux/action/postAction";
import styles from "./styles.module.css";

export default function Like({ postId, likeCount, isLiked, onOpenLikes }) {
  const dispatch = useDispatch();
  return (
    <div className={styles.likeRow}>
      <button
        type="button"
        onClick={() => dispatch(toggleLikePost(postId))}
        className={styles.actionButton}
        aria-label={isLiked ? "Unlike" : "Like"}
      >
        <i
          className={`fa-solid fa-thumbs-up ${styles.likeIcon} ${isLiked ? styles.blue : ""}`}
        />
      </button>
      <button
        type="button"
        className={styles.likeCountBtn}
        onClick={() => onOpenLikes?.()}
        aria-label="View likes"
      >
        {likeCount ?? 0}
      </button>
    </div>
  );
}
