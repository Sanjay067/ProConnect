import React from "react";
import styles from "./styles.module.css";

export default function CommentInput({
  value,
  onChange,
  onSubmit,
  onCancel,
  placeholder = "Add a comment...",
  submitLabel = "Post",
  isReply = false,
}) {
  return (
    <form
      onSubmit={onSubmit}
      className={styles.commentForm}
      style={isReply ? { marginTop: "10px" } : {}}
    >
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={styles.commentInput}
      />
      {onCancel && (
        <button
          type="button"
          className={styles.actionButton}
          onClick={onCancel}
        >
          Cancel
        </button>
      )}
      <button
        type="submit"
        className={styles.commentSubmit}
        disabled={!value?.trim()}
      >
        {submitLabel}
      </button>
    </form>
  );
}
