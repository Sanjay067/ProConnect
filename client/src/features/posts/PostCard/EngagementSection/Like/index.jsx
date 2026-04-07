import React from "react";
import styles from "./styles.module.css";

export default function Like({
  likeCount,
  isLiked,
  onToggleLike,
  onOpenLikes,
  ariaLabel,
  disabled = false,
}) {
  const canOpenLikes = typeof onOpenLikes === "function";

  return (
    <div className={styles.likeRow}>
      <button
        type="button"
        onClick={onToggleLike}
        className={styles.actionButton}
        aria-label={ariaLabel || (isLiked ? "Unlike" : "Like")}
        disabled={disabled}
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
        disabled={!canOpenLikes}
      >
        {likeCount ?? 0}
      </button>
    </div>
  );
}
