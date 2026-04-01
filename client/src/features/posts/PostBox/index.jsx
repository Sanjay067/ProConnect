import React, { useState, useRef } from "react";
import styles from "./styles.module.css";
import { useDispatch, useSelector } from "react-redux";
import { createPost } from "@/config/redux/action/postAction";

export default function PostBox() {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.post);
  const myAvatar = useSelector(
    (state) =>
      state.profile.profile?.userId?.profilePicture ||
      "https://cdn-icons-png.flaticon.com/512/149/149071.png"
  );
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalView, setModalView] = useState("text"); // "text" | "media"
  const [postBody, setPostBody] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileRef = useRef(null);

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!postBody.trim() && !selectedFile) return;

    const formData = new FormData();
    formData.append("body", postBody);
    if (selectedFile) {
      formData.append("media", selectedFile);
    }

    await dispatch(createPost(formData));
    
    // Reset & Close Modal
    setPostBody("");
    removeMedia();
    setIsModalOpen(false);
  };

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
        setModalView("text"); // auto switch back to text view to see preview and type
      };
      reader.readAsDataURL(file);
    }
  };

  const removeMedia = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const openTextModal = () => {
    setModalView("text");
    setIsModalOpen(true);
  };
  
  const openMediaModal = () => {
    setModalView("media");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    if (!postBody.trim() && !selectedFile) {
      removeMedia();
    }
  };

  return (
    <div className={styles.feedcontainer}>
      {/* --- Trigger Area --- */}
      <div className={styles.triggerArea}>
        <img src={myAvatar} alt="My Avatar" className={styles.myAvatar} />
        <button className={styles.triggerButton} onClick={openTextModal}>
          Start a post...
        </button>
      </div>
      <div className={styles.triggerIcons}>
        <button className={styles.iconBtn} onClick={openMediaModal}>
          <i className="fa-solid fa-image" style={{ color: "#378fe9" }}></i> Photo
        </button>
        <button className={styles.iconBtn} onClick={openMediaModal}>
          <i className="fa-solid fa-video" style={{ color: "#5f9b41" }}></i> Video
        </button>
      </div>

      {/* --- Modal Overlay --- */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            
            {modalView === "text" ? (
              <>
                <div className={styles.modalHeader}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                     <img src={myAvatar} alt="Avatar" className={styles.myAvatar} />
                     <span style={{ fontWeight: "bold", fontSize: "1.2rem", color: "#666" }}>Create a post</span>
                  </div>
                  <button className={styles.closeBtn} onClick={closeModal}>
                    <i className="fa-solid fa-times"></i>
                  </button>
                </div>
                
                <form onSubmit={handlePostSubmit}>
                   <textarea
                     placeholder="What do you want to talk about?"
                     value={postBody}
                     onChange={(e) => setPostBody(e.target.value)}
                     className={styles.modalTextArea}
                     autoFocus
                   />
                   
                   {/* --- Media Preview Area --- */}
                   {previewUrl && (
                     <div className={styles.previewContainer}>
                       {selectedFile?.type.startsWith("video/") ? (
                         <video src={previewUrl} controls className={styles.mediaPreview} />
                       ) : (
                         <img src={previewUrl} alt="Preview" className={styles.mediaPreview} />
                       )}
                       <button type="button" onClick={removeMedia} className={styles.removeMediaBtn}>
                         <i className="fa-solid fa-times"></i>
                       </button>
                     </div>
                   )}

                   <div className={styles.modalFooter}>
                     <div style={{ display: "flex", gap: "15px" }}>
                        <button 
                          type="button"
                          className={styles.iconBtn}
                          onClick={() => setModalView("media")}
                        >
                          <i className="fa-solid fa-image" style={{ color: "#378fe9", fontSize: "1.2rem" }}></i>
                        </button>
                        <button 
                          type="button"
                          className={styles.iconBtn}
                          onClick={() => setModalView("media")}
                        >
                          <i className="fa-solid fa-video" style={{ color: "#5f9b41", fontSize: "1.2rem" }}></i>
                        </button>
                     </div>
                     
                     <button 
                       type="submit" 
                       className={styles.postButton} 
                       disabled={isLoading || (!postBody.trim() && !selectedFile)}
                     >
                       {isLoading ? "Posting..." : "Post"}
                     </button>
                   </div>
                </form>
              </>
            ) : (
              <>
                {/* --- File Selection View --- */}
                <div className={styles.modalHeader}>
                  <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                     <button className={styles.closeBtn} onClick={() => setModalView("text")}>
                       <i className="fa-solid fa-arrow-left"></i>
                     </button>
                     <span style={{ fontWeight: "bold", fontSize: "1.2rem", color: "#666" }}>Select files</span>
                  </div>
                  <button className={styles.closeBtn} onClick={closeModal}>
                    <i className="fa-solid fa-times"></i>
                  </button>
                </div>

                <div className={styles.uploadEmptyState}>
                  <i className="fa-solid fa-cloud-arrow-up" style={{ fontSize: "5rem", color: "#0a66c2", marginBottom: "15px" }}></i>
                  <h2 style={{ margin: "0 0 10px 0", fontSize: "1.5rem", color: "#333" }}>Select files to begin</h2>
                  <p style={{ margin: "0 0 20px 0", color: "#666", fontSize: "1rem" }}>Share images or a single video in your post.</p>
                  
                  <input
                    type="file"
                    ref={fileRef}
                    style={{ display: "none" }}
                    onChange={handleChange}
                    accept="image/*,video/*"
                  />
                  <button 
                    className={styles.uploadFromComputerBtn}
                    onClick={() => fileRef.current?.click()}
                  >
                    Upload from computer
                  </button>
                </div>
              </>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
