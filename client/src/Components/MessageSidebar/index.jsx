import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { closeMessageSidebar } from "@/config/redux/reducer/postReducer";
import styles from "./styles.module.css";

export default function MessageSidebar() {
  const dispatch = useDispatch();
  const { messageSidebarOpen, messageRecipient } = useSelector(
    (state) => state.post,
  );

  return (
    <>
      {/* Backdrop */}
      {messageSidebarOpen && (
        <div
          className={styles.backdrop}
          onClick={() => dispatch(closeMessageSidebar())}
        />
      )}

      {/* Sidebar panel */}
      <div
        className={`${styles.sidebar} ${messageSidebarOpen ? styles.open : ""}`}
      >
        {/* Header */}
        <div className={styles.header}>
          <h3 className={styles.title}>
            <i className="fa-regular fa-comment-dots"></i>
            Messaging
          </h3>
          <button
            className={styles.closeBtn}
            onClick={() => dispatch(closeMessageSidebar())}
            type="button"
            aria-label="Close messages"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Body */}
        <div className={styles.body}>
          {messageRecipient ? (
            <div className={styles.recipientCard}>
              <img
                src={
                  messageRecipient.profilePicture ||
                  "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }
                alt="Recipient"
                className={styles.recipientAvatar}
              />
              <div>
                <p className={styles.recipientName}>
                  {messageRecipient.name}
                </p>
                <p className={styles.recipientUsername}>
                  @{messageRecipient.username}
                </p>
              </div>
            </div>
          ) : (
            <div className={styles.emptyState}>
              <i className="fa-regular fa-paper-plane"></i>
              <p>Select a conversation or message someone from their post.</p>
            </div>
          )}

          <div className={styles.chatPlaceholder}>
            <p>No messages yet.</p>
          </div>
        </div>
      </div>
    </>
  );
}
