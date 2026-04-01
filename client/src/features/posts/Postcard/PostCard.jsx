import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deletePost, editPost, toggleLikePost } from "@/config/redux/action/postAction";
import clientApi from "@/services/clientApi";
import { sendConnections } from "@/config/redux/action/connectionAction.js";
import styles from "./styles.module.css";

export default function PostCard({ post, isOwnProfile = false }) {
  const dispatch = useDispatch();
  const myId = useSelector((state) => state.profile.profile?.userId?._id);
  const isPostAuthor =
    myId && post?.author?._id ? String(myId) === String(post.author._id) : false;

  // Local state just for this specific post
  const [isBodyExpanded, setIsBodyExpanded] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [isEditingPost, setIsEditingPost] = useState(false);
  const [editedPostBody, setEditedPostBody] = useState(post?.body || "");
  const [editedMedia, setEditedMedia] = useState(post?.media || []);
  const [newMediaFiles, setNewMediaFiles] = useState([]);
  const [newMediaPreviews, setNewMediaPreviews] = useState([]);
  const [confirmDeletePost, setConfirmDeletePost] = useState(false);
  const editFileRef = React.useRef(null);
  
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedCommentBody, setEditedCommentBody] = useState("");
  const [replyingToCommentId, setReplyingToCommentId] = useState(null);
  const [replyBody, setReplyBody] = useState("");
  const [repliesByCommentId, setRepliesByCommentId] = useState({});
  const [loadingRepliesFor, setLoadingRepliesFor] = useState(null);

  const MAX_POST_LENGTH = 150;

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

  const handleConnect = () => {
    const receiverId = post?.author?._id;
    if (!receiverId) return;
    if (myId && String(receiverId) === String(myId)) return; // Prevent self-connect
    dispatch(sendConnections(receiverId));
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

  const startEditComment = (comment) => {
    if (!comment?._id) return;
    setEditingCommentId(comment._id);
    setEditedCommentBody(comment.body || "");
  };

  const cancelEditComment = () => {
    setEditingCommentId(null);
    setEditedCommentBody("");
  };

  const saveEditComment = async (commentId) => {
    const body = editedCommentBody.trim();
    if (!body) return;
    try {
      const { data } = await clientApi.patch(
        `/posts/${post._id}/comments/${commentId}`,
        { body },
      );
      setComments((prev) =>
        prev.map((c) => (c._id === commentId ? { ...c, ...data.comment } : c)),
      );
      cancelEditComment();
    } catch (error) {
      console.error("Failed to edit comment", error);
    }
  };

  const deleteComment = async (commentId) => {
    const ok = window.confirm("Delete this comment?");
    if (!ok) return;
    try {
      await clientApi.delete(`/posts/${post._id}/comments/${commentId}`);
      setComments((prev) =>
        prev.map((c) =>
          c._id === commentId ? { ...c, isDeleted: true, body: "" } : c,
        ),
      );
    } catch (error) {
      console.error("Failed to delete comment", error);
    }
  };

  const toggleReplies = async (commentId) => {
    const existing = repliesByCommentId[commentId];
    if (existing) {
      setRepliesByCommentId((prev) => {
        const next = { ...prev };
        delete next[commentId];
        return next;
      });
      return;
    }

    setLoadingRepliesFor(commentId);
    try {
      const { data } = await clientApi.get(
        `/posts/${post._id}/comments/${commentId}/replies`,
      );
      setRepliesByCommentId((prev) => ({ ...prev, [commentId]: data.replies }));
    } catch (error) {
      console.error("Failed to fetch replies", error);
    } finally {
      setLoadingRepliesFor(null);
    }
  };

  const startReply = (commentId) => {
    setReplyingToCommentId(commentId);
    setReplyBody("");
  };

  const cancelReply = () => {
    setReplyingToCommentId(null);
    setReplyBody("");
  };

  const submitReply = async (e) => {
    e.preventDefault();
    if (!replyingToCommentId) return;
    const body = replyBody.trim();
    if (!body) return;

    try {
      const { data } = await clientApi.post(
        `/posts/${post._id}/comments/${replyingToCommentId}/reply`,
        { body },
      );

      setRepliesByCommentId((prev) => ({
        ...prev,
        [replyingToCommentId]: [
          ...(prev[replyingToCommentId] || []),
          data.comment,
        ],
      }));

      cancelReply();
    } catch (error) {
      console.error("Failed to reply", error);
    }
  };

  const handleStartEditPost = () => {
    setEditedPostBody(post?.body || "");
    setEditedMedia(post?.media || []);
    setNewMediaFiles([]);
    setNewMediaPreviews([]);
    setIsEditingPost(true);
  };

  const handleCancelEditPost = () => {
    setEditedPostBody(post?.body || "");
    setEditedMedia(post?.media || []);
    setNewMediaFiles([]);
    setNewMediaPreviews([]);
    setIsEditingPost(false);
  };

  const handleSaveEditPost = async () => {
    const nextBody = editedPostBody.trim();
    if (!nextBody && editedMedia.length === 0 && newMediaFiles.length === 0) return;
    
    const formData = new FormData();
    formData.append("body", nextBody);
    formData.append("existingMedia", JSON.stringify(editedMedia));
    
    newMediaFiles.forEach((file) => formData.append("media", file));

    await dispatch(editPost({ postId: post._id, postData: formData }));
    setIsEditingPost(false);
  };

  const handleDeletePost = async () => {
    setConfirmDeletePost(true);
  };

  const confirmAndExecuteDelete = async () => {
    await dispatch(deletePost(post._id));
    setConfirmDeletePost(false);
  };

  const removeExistingMedia = (publicId) => {
    setEditedMedia((prev) => prev.filter((m) => m.publicId !== publicId));
  };

  const removeNewMedia = (index) => {
    setNewMediaFiles((prev) => prev.filter((_, i) => i !== index));
    setNewMediaPreviews((prev) => prev.filter((_, i) => i !== index));
    if (editFileRef.current) editFileRef.current.value = "";
  };

  const handleNewMediaChoice = (e) => {
    const files = Array.from(e.target.files);
    setNewMediaFiles((prev) => [...prev, ...files]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewMediaPreviews((prev) => [
          ...prev,
          { url: reader.result, type: file.type.startsWith("video/") ? "video" : "image" }
        ]);
      };
      reader.readAsDataURL(file);
    });
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

      {/* Author Info */}
      <div className={styles.authorContainer}>
        <img
          src={
            post.author?.profilePicture ||
            "https://cdn-icons-png.flaticon.com/512/149/149071.png"
          }
          alt="Avatar"
          className={styles.avatar}
        />
        <div className={styles.authorDetails}>
          <p className={styles.authorName}>{post.author?.name}</p>
          <p className={styles.authorUsername}>@{post.author?.username}</p>
        </div>
        {!(myId && post?.author?._id && String(post.author._id) === String(myId)) && (
          <button
            className={styles.followButton}
            onClick={handleConnect}
            disabled={!post?.author?._id}
          >
            Connect
          </button>
        )}

        {isPostAuthor && isOwnProfile && (
          <div style={{ marginLeft: "auto", display: "flex", gap: "8px" }}>
            {!isEditingPost && (
              <>
                <button
                  className={styles.actionButton}
                  onClick={handleStartEditPost}
                  type="button"
                >
                  Edit
                </button>
                <button
                  className={styles.actionButton}
                  onClick={handleDeletePost}
                  type="button"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Post Body */}
      {isEditingPost ? (
        <div style={{ display: "flex", gap: "8px", flexDirection: "column" }}>
          <textarea
            value={editedPostBody}
            onChange={(e) => setEditedPostBody(e.target.value)}
            rows={3}
            style={{
              width: "100%",
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "10px",
              resize: "vertical",
            }}
          />
          
          {/* Internal Post Editor Media Area */}
          {(editedMedia.length > 0 || newMediaPreviews.length > 0) && (
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", margin: "10px 0" }}>
              {editedMedia.map((m) => (
                <div key={m.publicId} style={{ position: "relative", width: "100px", height: "100px" }}>
                  {m.type === "video" ? (
                    <video src={m.url} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "5px", backgroundColor: "#000" }} />
                  ) : (
                    <img src={m.url} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "5px" }} />
                  )}
                  <button type="button" onClick={() => removeExistingMedia(m.publicId)} style={{ position: "absolute", top: "5px", right: "5px", background: "rgba(0,0,0,0.6)", color: "white", border: "none", borderRadius: "50%", width: "24px", height: "24px", cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <i className="fa-solid fa-times" style={{ fontSize: "0.8rem" }}></i>
                  </button>
                </div>
              ))}
              {newMediaPreviews.map((m, i) => (
                <div key={i} style={{ position: "relative", width: "100px", height: "100px" }}>
                  {m.type === "video" ? (
                    <video src={m.url} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "5px", backgroundColor: "#000" }} />
                  ) : (
                    <img src={m.url} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "5px" }} />
                  )}
                  <button type="button" onClick={() => removeNewMedia(i)} style={{ position: "absolute", top: "5px", right: "5px", background: "rgba(0,0,0,0.6)", color: "white", border: "none", borderRadius: "50%", width: "24px", height: "24px", cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <i className="fa-solid fa-times" style={{ fontSize: "0.8rem" }}></i>
                  </button>
                </div>
              ))}
            </div>
          )}

          <div style={{ display: "flex", gap: "15px", alignItems: "center", justifyContent: "space-between", marginTop: "5px" }}>
            <div style={{ display: "flex", gap: "15px" }}>
               <input type="file" ref={editFileRef} style={{ display: "none" }} multiple accept="image/*,video/*" onChange={handleNewMediaChoice} />
               <button type="button" onClick={() => { if(editFileRef.current) { editFileRef.current.accept="image/*"; editFileRef.current.click(); } }} style={{ background: "none", border: "none", cursor: "pointer", color: "#378fe9", fontSize: "1.2rem", padding: "0 5px" }}><i className="fa-solid fa-image"></i></button>
               <button type="button" onClick={() => { if(editFileRef.current) { editFileRef.current.accept="video/*"; editFileRef.current.click(); } }} style={{ background: "none", border: "none", cursor: "pointer", color: "#5f9b41", fontSize: "1.2rem", padding: "0 5px" }}><i className="fa-solid fa-video"></i></button>
            </div>
            
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                className={styles.actionButton}
                onClick={handleCancelEditPost}
                type="button"
              >
                Cancel
              </button>
              <button
                className={styles.commentSubmit}
                onClick={handleSaveEditPost}
                type="button"
                disabled={!editedPostBody.trim() && editedMedia.length === 0 && newMediaFiles.length === 0}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          {post.body && (
            <p className={styles.postBody}>
              {isBodyExpanded || post.body.length <= MAX_POST_LENGTH
                ? post.body
                : `${post.body.slice(0, MAX_POST_LENGTH)}`}
              {post.body.length > MAX_POST_LENGTH && !isBodyExpanded && (
                <button
                  onClick={() => setIsBodyExpanded(true)}
                  className={styles.seeMoreBtn}
                >
                  ...see more
                </button>
              )}
            </p>
          )}
          
          {/* Post Media Rendering */}
          {post.media && post.media.length > 0 && (
            <div className={styles.mediaContainer}>
              {post.media.map((mediaItem) => (
                mediaItem.type === "video" ? (
                  <video key={mediaItem.publicId} src={mediaItem.url} controls className={styles.postMedia} />
                ) : (
                  <img key={mediaItem.publicId} src={mediaItem.url} alt="Post media" className={styles.postMedia} />
                )
              ))}
            </div>
          )}
        </>
      )}

      {/* Engagement Bar */}
      <div className={styles.engagementBar}>
        <button
          onClick={() => dispatch(toggleLikePost(post._id))}
          className={styles.actionButton}
        >
          👍 Like ({post.likeCount || 0})
        </button>
        <button onClick={handleToggleComments} className={styles.actionButton}>
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
                  src={
                    comment.author?.profilePicture ||
                    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  }
                  alt="Avatar"
                  className={styles.commentAvatar}
                />
                <div className={styles.commentBodyContainer}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "10px",
                    }}
                  >
                    <p className={styles.commentAuthorName}>
                      {comment.author?.name || "Unknown"}
                    </p>

                    {myId &&
                      comment.author?._id &&
                      String(comment.author._id) === String(myId) && (
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button
                            className={styles.actionButton}
                            type="button"
                            onClick={() => startEditComment(comment)}
                            disabled={comment.isDeleted}
                          >
                            Edit
                          </button>
                          <button
                            className={styles.actionButton}
                            type="button"
                            onClick={() => deleteComment(comment._id)}
                            disabled={comment.isDeleted}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                  </div>

                  {comment.isDeleted ? (
                    <p className={styles.commentBodyText} style={{ color: "#999" }}>
                      (deleted)
                    </p>
                  ) : editingCommentId === comment._id ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <input
                        value={editedCommentBody}
                        onChange={(e) => setEditedCommentBody(e.target.value)}
                        className={styles.commentInput}
                      />
                      <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                        <button
                          className={styles.actionButton}
                          type="button"
                          onClick={cancelEditComment}
                        >
                          Cancel
                        </button>
                        <button
                          className={styles.commentSubmit}
                          type="button"
                          onClick={() => saveEditComment(comment._id)}
                          disabled={!editedCommentBody.trim()}
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className={styles.commentBodyText}>{comment.body}</p>
                  )}

                  <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                    <button
                      className={styles.actionButton}
                      type="button"
                      onClick={() => startReply(comment._id)}
                      disabled={comment.isDeleted}
                    >
                      Reply
                    </button>
                    <button
                      className={styles.actionButton}
                      type="button"
                      onClick={() => toggleReplies(comment._id)}
                      disabled={comment.isDeleted}
                    >
                      {loadingRepliesFor === comment._id
                        ? "Loading..."
                        : repliesByCommentId[comment._id]
                          ? "Hide replies"
                          : `View replies (${comment.replyCount || 0})`}
                    </button>
                  </div>

                  {replyingToCommentId === comment._id && (
                    <form onSubmit={submitReply} className={styles.commentForm} style={{ marginTop: "10px" }}>
                      <input
                        type="text"
                        placeholder="Write a reply..."
                        value={replyBody}
                        onChange={(e) => setReplyBody(e.target.value)}
                        className={styles.commentInput}
                      />
                      <button
                        type="button"
                        className={styles.actionButton}
                        onClick={cancelReply}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className={styles.commentSubmit}
                        disabled={!replyBody.trim()}
                      >
                        Reply
                      </button>
                    </form>
                  )}

                  {repliesByCommentId[comment._id]?.length > 0 && (
                    <div style={{ marginTop: "10px", paddingLeft: "10px", borderLeft: "2px solid #ddd" }}>
                      {repliesByCommentId[comment._id].map((reply) => (
                        <div key={reply._id} style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                          <img
                            src={
                              reply.author?.profilePicture ||
                              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                            }
                            alt="Avatar"
                            className={styles.commentAvatar}
                          />
                          <div className={styles.commentBodyContainer}>
                            <p className={styles.commentAuthorName}>
                              {reply.author?.name || "Unknown"}
                            </p>
                            <p className={styles.commentBodyText}>{reply.body}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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
