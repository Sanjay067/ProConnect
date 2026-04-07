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
    <div className="mb-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
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
