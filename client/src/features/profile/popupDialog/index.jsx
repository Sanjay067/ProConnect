import React, { useEffect } from "react";
import styles from "./styles.module.css";

const PopupDialog = ({ children, onClose }) => {
  // ESC key close
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // Click outside close
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.container} onClick={handleOverlayClick}>
      <div className={styles.popup}>
        <div className={styles.head}>
          <h1>Edit Profile</h1>

          <div className={styles.crossBtn} onClick={onClose}>
            <i className="fa-solid fa-x"></i>
          </div>
        </div>

        <div className={styles.body}>{children}</div>
      </div>
    </div>
  );
};

export default PopupDialog;
