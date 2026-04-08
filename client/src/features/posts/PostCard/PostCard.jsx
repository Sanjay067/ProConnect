import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { deletePost } from "@/config/redux/action/postAction";
import ConfirmDialog from "@/components/ConfirmDialog";

import UserSection from "./UserSection";  
import PostBody from "./PostBody";
import EngagementSection from "./EngagementSection";

export default function PostCard({ post, isOwnProfile = false }) {
  const dispatch = useDispatch();

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
    <div
      className="mb-2 rounded-3xl border p-6 shadow-sm"
      style={{ borderColor: "var(--border)", background: "var(--surface)" }}
    >
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

      <UserSection 
        post={post} 
        isOwnProfile={isOwnProfile} 
        isEditingPost={isEditingPost} 
        onStartEdit={() => setIsEditingPost(true)} 
        onDeleteRequest={handleDeletePost} 
      />

      <PostBody 
         post={post}
         isEditingPost={isEditingPost}
         onCancelEdit={() => setIsEditingPost(false)}
      />

      <EngagementSection post={post} />
    </div>
  );
}
