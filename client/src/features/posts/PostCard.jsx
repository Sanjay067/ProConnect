import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { toggleLikePost } from "@/config/redux/action/postAction";
import clientApi from "@/services/clientApi";
import styles from "./styles.module.css";

export default function PostCard({ post }) {
  const dispatch = useDispatch();
  
  // Local state just for this specific post's comments
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isLoadingComments, setIsLoadingComments] = useState(false);

  // Fetch comments from the backend when the user clicks "Comment"
  const handleToggleComments = async () => {
    setShowComments(!showComments);
    
    // Only fetch if we are opening it and haven't fetched yet
    if (!showComments && comments.length === 0) {
      setIsLoadingComments(true);
      try {
        const { data } = await clientApi.get(`/posts/${post._id}/comments`);
        setComments(data.comments);
      } catch (error) {
        console.error("Failed to fetch comments", error);
      } finally {
        setIsLoadingComments(false);
      }
    }
  };

  // Submit a new comment
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const { data } = await clientApi.post(`/posts/${post._id}/comments`, {
        body: newComment,
      });
      
      // Add the new comment to the top of our local list!
      setComments([data.comment, ...comments]);
      setNewComment("");
    } catch (error) {
      console.error("Failed to add comment", error);
    }
  };

  return (
    <div className={styles.postCard}>
      
      {/* Author Info */}
      <div className={styles.authorContainer}>
        <img 
          src={post.author?.profilePicture || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
          alt="Avatar" 
          className={styles.avatar}
        />
        <div className={styles.authorDetails}>
          <p className={styles.authorName}>{post.author?.name}</p>
          <p className={styles.authorUsername}>@{post.author?.username}</p>
        </div>
      </div>

      {/* Post Body */}
      <p className={styles.postBody}>{post.body}</p>

      {/* Engagement Bar */}
      <div className={styles.engagementBar}>
        <button
          onClick={() => dispatch(toggleLikePost(post._id))}
          className={styles.actionButton}
        >
          👍 Like ({post.likeCount || 0})
        </button>
        <button
          onClick={handleToggleComments}
          className={styles.actionButton}
        >
          💬 Comment ({post.commentCount || 0})
        </button>
      </div>

      {/* Comment Section (Dropdown) */}
      {showComments && (
        <div className={styles.commentSection}>
          
          {/* Add Comment Form */}
          <form onSubmit={handleAddComment} className={styles.commentForm}>
            <input
              type="text"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className={styles.commentInput}
            />
            <button type="submit" className={styles.commentSubmit}>
              Post
            </button>
          </form>

          {/* Comment List */}
          {isLoadingComments ? (
            <p className={styles.loadingText}>Loading comments...</p>
          ) : comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment._id} className={styles.commentItem}>
                <img 
                  src={comment.author?.profilePicture || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
                  alt="Avatar" 
                  className={styles.commentAvatar}
                />
                <div className={styles.commentBodyContainer}>
                  <p className={styles.commentAuthorName}>
                    {comment.author?.name || "Unknown"}
                  </p>
                  <p className={styles.commentBodyText}>{comment.body}</p>
                </div>
              </div>
            ))
          ) : (
             <p className={styles.emptyCommentText}>No comments yet.</p>
          )}

        </div>
      )}

    </div>
  );
}
