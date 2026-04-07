import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleCommentSection } from "@/config/redux/reducer/postReducer";
import CommentSection from "@/features/posts/PostCard/EngagementSection/CommentSection";
import styles from "./styles.module.css";

export default function CommentSidebar() {
  const dispatch = useDispatch();
  const activeCommentPostId = useSelector(
    (state) => state.post.activeCommentPostId,
  );
  const feedPosts = useSelector((state) => state.post.feedPosts);
  const profilePosts = useSelector((state) => state.post.posts);

  // Find the active post from either feed or profile posts
  const activePost =
    feedPosts.find((p) => String(p._id) === String(activeCommentPostId)) ||
    profilePosts.find((p) => String(p._id) === String(activeCommentPostId));

  const isOpen = !!activeCommentPostId && !!activePost;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className={styles.backdrop}
          onClick={() => dispatch(toggleCommentSection(activeCommentPostId))}
        />
      )}

      {/* Sidebar panel */}
      <div className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h3 className={styles.title}>
              <i className="fa-regular fa-comments"></i>
              Comments
            </h3>
            {activePost && (
              <span className={styles.postAuthor}>
                on {activePost.author?.name}'s post
              </span>
            )}
          </div>
          <button
            className={styles.closeBtn}
            onClick={() =>
              dispatch(toggleCommentSection(activeCommentPostId))
            }
            type="button"
            aria-label="Close comments"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Post preview snippet */}
        {activePost && (
          <div className={styles.postPreview}>
            <p className={styles.postPreviewText}>
              {activePost.body?.length > 120
                ? `${activePost.body.slice(0, 120)}...`
                : activePost.body}
            </p>
          </div>
        )}

        {/* Comment section body */}
        <div className={styles.body}>
          {activePost ? (
            <CommentSection post={activePost} />
          ) : (
            <div className={styles.emptyState}>
              <i className="fa-regular fa-comment-dots"></i>
              <p>Select a post to view comments.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
