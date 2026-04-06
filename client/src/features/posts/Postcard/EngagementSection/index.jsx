import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleCommentSection } from "@/config/redux/reducer/postReducer";
import { toggleLikePost } from "@/config/redux/action/postAction";
import Like from "./Like";
import LikesModal from "./LikesModal";
import styles from "./styles.module.css";

export default function EngagementSection({ post }) {
  const dispatch = useDispatch();
  const [showLikes, setShowLikes] = useState(false);
  const activeCommentPostId = useSelector(
    (state) => state.post.activeCommentPostId,
  );
  const isActive = activeCommentPostId === post._id;

  return (
    <>
      <div className={styles.engagementBar}>
        <Like
          likeCount={post.likeCount}
          isLiked={post.isLiked}
          onToggleLike={() => dispatch(toggleLikePost(post._id))}
          onOpenLikes={() => setShowLikes(true)}
        />
        <button
          type="button"
          onClick={() => dispatch(toggleCommentSection(post._id))}
          className={`${styles.actionButton} ${isActive ? styles.activeComment : ""}`}
        >
          <i className={`fa-regular fa-comment ${styles.commentIcon}`}></i>
          &nbsp;
          {post.commentCount || 0}
        </button>
      </div>

      {showLikes && (
        <LikesModal postId={post._id} onClose={() => setShowLikes(false)} />
      )}
    </>
  );
}
