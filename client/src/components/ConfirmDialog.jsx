import React from "react";
import styles from "./ConfirmDialog.module.css";

export default function ConfirmDialog({
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  confirmVariant = "danger",
  onConfirm,
  onCancel,
}) {
  return (
    <div
      className={styles.overlay}
      role="presentation"
      onClick={onCancel}
    >
      <div
        className={styles.panel}
        role="dialog"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-desc"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 id="confirm-title" className={styles.title}>
          {title}
        </h3>
        <p id="confirm-desc" className={styles.message}>
          {message}
        </p>
        <div className={styles.actions}>
          <button type="button" className={styles.cancel} onClick={onCancel}>
            {cancelLabel}
          </button>
          <button
            type="button"
            className={
              confirmVariant === "danger" ? styles.confirmDanger : styles.confirm
            }
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
