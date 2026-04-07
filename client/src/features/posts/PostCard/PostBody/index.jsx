import React, { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { editPost } from "@/config/redux/action/postAction";
import styles from "./styles.module.css";

export default function PostBody({ post, isEditingPost, onCancelEdit }) {
  const dispatch = useDispatch();
  const MAX_POST_LENGTH = 150;
  const mediaTrackRef = useRef(null);

  const [isBodyExpanded, setIsBodyExpanded] = useState(false);
  const [editedPostBody, setEditedPostBody] = useState(post?.body || "");
  const [editedMedia, setEditedMedia] = useState(post?.media || []);
  const [newMediaFiles, setNewMediaFiles] = useState([]);
  const [newMediaPreviews, setNewMediaPreviews] = useState([]);
  
  const editFileRef = useRef(null);

  // reset form when edit mode opens
  React.useEffect(() => {
    if (isEditingPost) {
      setEditedPostBody(post?.body || "");
      setEditedMedia(post?.media || []);
      setNewMediaFiles([]);
      setNewMediaPreviews([]);
    }
  }, [isEditingPost, post]);

  const handleSaveEditPost = async () => {
    const nextBody = editedPostBody.trim();
    if (!nextBody && editedMedia.length === 0 && newMediaFiles.length === 0) return;
    
    const formData = new FormData();
    formData.append("body", nextBody);
    formData.append("existingMedia", JSON.stringify(editedMedia));
    
    newMediaFiles.forEach((file) => formData.append("media", file));

    await dispatch(editPost({ postId: post._id, postData: formData }));
    onCancelEdit(); // Triggers global container to shut off edit mode
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

  if (isEditingPost) {
    return (
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
            <button className={styles.actionButton} onClick={onCancelEdit} type="button">Cancel</button>
            <button className={styles.commentSubmit} onClick={handleSaveEditPost} type="button" disabled={!editedPostBody.trim() && editedMedia.length === 0 && newMediaFiles.length === 0}>Save</button>
          </div>
        </div>
      </div>
    );
  }


  return (
    <>
      {post?.body && (
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
      
      {post?.media && post.media.length > 0 && (
        <>
          {post.media.length === 1 ? (
            <div className={styles.mediaContainer}>
              {post.media[0].type === "video" ? (
                <video
                  key={post.media[0].publicId}
                  src={post.media[0].url}
                  controls
                  className={styles.postMedia}
                />
              ) : (
                <img
                  key={post.media[0].publicId}
                  src={post.media[0].url}
                  alt="Post media"
                  className={styles.postMedia}
                />
              )}
            </div>
          ) : (
            <div className={styles.carouselWrap}>
              <button
                type="button"
                className={`${styles.carouselNav} ${styles.carouselNavPrev}`}
                aria-label="Previous media"
                onClick={() => {
                  const el = mediaTrackRef.current;
                  if (el) el.scrollBy({ left: -el.clientWidth, behavior: "smooth" });
                }}
              >
                <i className="fa-solid fa-chevron-left" />
              </button>
              <div ref={mediaTrackRef} className={styles.carouselTrack}>
                {post.media.map((mediaItem) => (
                  <div key={mediaItem.publicId} className={styles.carouselSlide}>
                    {mediaItem.type === "video" ? (
                      <video
                        src={mediaItem.url}
                        controls
                        className={styles.postMedia}
                      />
                    ) : (
                      <img
                        src={mediaItem.url}
                        alt="Post media"
                        className={styles.postMedia}
                      />
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                className={`${styles.carouselNav} ${styles.carouselNavNext}`}
                aria-label="Next media"
                onClick={() => {
                  const el = mediaTrackRef.current;
                  if (el) el.scrollBy({ left: el.clientWidth, behavior: "smooth" });
                }}
              >
                <i className="fa-solid fa-chevron-right" />
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
}
