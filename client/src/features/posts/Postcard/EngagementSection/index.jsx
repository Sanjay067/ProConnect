import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleCommentSection } from "@/config/redux/reducer/postReducer";
import Like from "./Like";
import CommentSection from "./CommentSection";
import LikesModal from "./LikesModal";
import styles from "./styles.module.css";

export default function EngagementSection({ post }) {
  const dispatch = useDispatch();
  const [showLikes, setShowLikes] = useState(false);
  const activeCommentPostId = useSelector(
    (state) => state.post.activeCommentPostId,
  );
  const showComments = activeCommentPostId === post._id;

  return (
    <>
      <div className={styles.engagementBar}>
        <Like
          postId={post._id}
          likeCount={post.likeCount}
          isLiked={post.isLiked}
          onOpenLikes={() => setShowLikes(true)}
        />
        <button
          type="button"
          onClick={() => dispatch(toggleCommentSection(post._id))}
          className={styles.actionButton}
        >
          <i className={`fa-regular fa-comment ${styles.commentIcon}`}></i>
          &nbsp;
          {post.commentCount || 0}
        </button>
      </div>

      {showComments && <CommentSection post={post} />}
      {showLikes && (
        <LikesModal postId={post._id} onClose={() => setShowLikes(false)} />
      )}
    </>
  );
}
