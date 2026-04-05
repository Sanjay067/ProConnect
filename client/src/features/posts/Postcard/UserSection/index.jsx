import React from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import ConnectionButton from "@/components/ConnectionButton";
import styles from "./styles.module.css";

export default function UserSection({
  post,
  isOwnProfile,
  isEditingPost,
  onStartEdit,
  onDeleteRequest,
}) {
  const myId = useSelector((state) => state.profile.profile?.userId?._id);
  const isPostAuthor =
    myId && post?.author?._id ? String(myId) === String(post.author._id) : false;
  const authorId = post?.author?._id;

  return (
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

      {authorId && (
        <ConnectionButton targetUserId={authorId} className={styles.followButton} />
      )}

      {isPostAuthor && isOwnProfile && (
        <div style={{ marginLeft: "auto", display: "flex", gap: "8px" }}>
          {!isEditingPost && (
            <>
              <button
                className={styles.actionButton}
                onClick={onStartEdit}
                type="button"
              >
                Edit
              </button>
              <button
                className={styles.actionButton}
                onClick={onDeleteRequest}
                type="button"
              >
                Delete
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
