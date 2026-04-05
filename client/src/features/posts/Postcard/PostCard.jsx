import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { deletePost } from "@/config/redux/action/postAction";

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
    await dispatch(deletePost(post._id));
    setConfirmDeletePost(false);
  };

  return (
    <div className={styles.postCard}>
      {confirmDeletePost && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "rgba(0,0,0,0.6)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 9999 }}>
           <div style={{ backgroundColor: "white", padding: "24px", borderRadius: "10px", width: "400px", maxWidth: "90%", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}>
              <h3 style={{ marginTop: 0, fontSize: "1.3rem", color: "#333" }}>Delete Post</h3>
              <p style={{ color: "#666", marginBottom: "25px", lineHeight: "1.5" }}>Are you sure you want to permanently delete this post? This action cannot be undone.</p>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                 <button onClick={() => setConfirmDeletePost(false)} style={{ padding: "8px 16px", background: "none", border: "1px solid #ccc", borderRadius: "20px", cursor: "pointer", fontWeight: "bold", color: "#666", transition: "all 0.2s" }}>Cancel</button>
                 <button onClick={confirmAndExecuteDelete} style={{ padding: "8px 20px", backgroundColor: "#e23", color: "white", border: "none", borderRadius: "20px", cursor: "pointer", fontWeight: "bold", transition: "all 0.2s" }}>Delete</button>
              </div>
           </div>
        </div>
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
