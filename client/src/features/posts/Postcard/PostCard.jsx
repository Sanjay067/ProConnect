import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { deletePost } from "@/config/redux/action/postAction";
import ConfirmDialog from "@/components/ConfirmDialog";

import UserSection from "./UserSection";  
import PostBody from "./PostBody";
import EngagementSection from "./EngagementSection";
import styles from "./styles.module.css";

export default function PostCard({ post, isOwnProfile = false }) {
  const dispatch = useDispatch();

  // High-level orchestration states
  const [isEditingPost, setIsEditingPost] = useState(false);
  const [confirmDeletePost, setConfirmDeletePost] = useState(false);

  const handleDeletePost = async () => {
    setConfirmDeletePost(true);
  };

  const confirmAndExecuteDelete = async () => {
    dispatch(deletePost(post._id));
    setConfirmDeletePost(false);
  };

  return (
    <div className={styles.postCard}>
      {confirmDeletePost && (
        <ConfirmDialog
          title="Delete post"
          message="Are you sure you want to permanently delete this post? This action cannot be undone."
          confirmLabel="Delete"
          cancelLabel="Cancel"
          confirmVariant="danger"
          onCancel={() => setConfirmDeletePost(false)}
          onConfirm={confirmAndExecuteDelete}
        />
      )}

      {/* 1. Author Info */}
      <UserSection 
        post={post} 
        isOwnProfile={isOwnProfile} 
        isEditingPost={isEditingPost} 
        onStartEdit={() => setIsEditingPost(true)} 
        onDeleteRequest={handleDeletePost} 
      />

      {/* 2. Post Body & Edit Engine */}
      <PostBody 
         post={post}
         isEditingPost={isEditingPost}
         onCancelEdit={() => setIsEditingPost(false)}
      />

      {/* 3. Engagement + comments (comments visibility via Redux activeCommentPostId) */}
      <EngagementSection post={post} />
    </div>
  );
}
