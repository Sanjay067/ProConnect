import React, { useEffect, useState } from "react";
import Link from "next/link";
import clientApi from "@/services/clientApi";
import styles from "./LikesModal.module.css";

export default function LikesModal({ postId, onClose }) {
  const [likes, setLikes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    clientApi
      .get(`/posts/${postId}/likes`)
      .then(({ data }) => {
        if (!cancelled) setLikes(data.likes || []);
      })
      .catch(() => {
        if (!cancelled) setLikes([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [postId]);

  return (
    <div
      className={styles.overlay}
      role="presentation"
      onClick={onClose}
    >
      <div
        className={styles.modal}
        role="dialog"
        aria-labelledby="likes-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <h3 id="likes-title">People who liked this</h3>
          <button type="button" className={styles.close} onClick={onClose}>
            <i className="fa-solid fa-times" />
          </button>
        </div>
        <div className={styles.list}>
          {loading && <p className={styles.muted}>Loading…</p>}
          {!loading && likes.length === 0 && (
            <p className={styles.muted}>No likes yet.</p>
          )}
          {!loading &&
            likes.map((like) => {
              const u = like.userId;
              if (!u?._id) return null;
              return (
                <Link
                  key={like._id}
                  href={`/profile/${u._id}`}
                  className={styles.row}
                  onClick={onClose}
                >
                  <img
                    src={
                      u.profilePicture ||
                      "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                    }
                    alt=""
                    className={styles.avatar}
                  />
                  <div>
                    <p className={styles.name}>{u.name}</p>
                    <p className={styles.username}>@{u.username}</p>
                  </div>
                </Link>
              );
            })}
        </div>
      </div>
    </div>
  );
}
