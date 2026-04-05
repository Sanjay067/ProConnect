import React, { useRef } from "react";
import { useDispatch } from "react-redux";
import { updateProfilePicture, updateBannerPicture } from "@/config/redux/action/profileAction";
import styles from "@/pages/profile/styles.module.css";

export default function ProfileHeader({ profile, user, onEdit, readOnly }) {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const bannerInputRef = useRef(null);

  if (readOnly) {
    const p = profile || {};
    return (
      <div className={styles.profileCard} style={{ padding: 0 }}>
        <div
          className={styles.banner}
          style={{
            backgroundImage: p?.bannerPicture
              ? `url(${p.bannerPicture})`
              : "none",
            backgroundSize: "cover",
            backgroundPosition: "center",
            minHeight: "140px",
          }}
        />
        <div className={styles.headerContent}>
          <div className={styles.avatarWrapper} style={{ cursor: "default" }}>
            <img
              src={
                user?.profilePicture ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              alt=""
              className={styles.avatar}
            />
          </div>
          <div className={styles.headerTopRow}>
            <div className={styles.nameInfo}>
              <h1 className={styles.name}>{user?.name}</h1>
              <p className={styles.headline}>
                {p.headline || p.currentPosition || ""}
              </p>
            </div>
            {p.education?.length > 0 && (
              <div className={styles.rightPanel}>
                <i
                  className="fa-solid fa-building"
                  style={{ width: "10px" }}
                ></i>
                <span>{p.education[0].school}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("avatar", file);
      await dispatch(updateProfilePicture(formData));
    }
  };

  const handleBannerChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("banner", file);
      await dispatch(updateBannerPicture(formData));
    }
  };

  return (
    <div className={styles.profileCard} style={{ padding: 0 }}>
      {/* Banner */}
      <div 
        className={styles.banner}
        style={{ 
          backgroundImage: profile?.bannerPicture ? `url(${profile.bannerPicture})` : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
          cursor: "pointer"
        }}
        onClick={() => bannerInputRef.current?.click()}
      >
        <div style={{ position: "absolute", top: "15px", right: "20px", backgroundColor: "white", borderRadius: "50%", width: "35px", height: "35px", display: "flex", justifyContent: "center", alignItems: "center", boxShadow: "0 0 5px rgba(0,0,0,0.3)"}}>
           <i className="fa-solid fa-camera" style={{ color: "#0a66c2", fontSize: "1rem" }}></i>
        </div>
        <input
          type="file"
          accept="image/*"
          ref={bannerInputRef}
          style={{ display: "none" }}
          onChange={handleBannerChange}
        />
      </div>

      {/* Main Content */}
      <div className={styles.headerContent}>
        <div
          className={styles.avatarWrapper}
          onClick={() => fileInputRef.current?.click()}
        >
          <img
            src={
              user.profilePicture ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            alt="Avatar"
            className={styles.avatar}
          />
          <div className={styles.uploadIcon}>
            <i className="fa-solid fa-camera"></i>
          </div>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleImageChange}
          />
        </div>

        <button onClick={() => onEdit("INTRO")} className={styles.pencilBtn}>
          <i className="fa-solid fa-pencil"></i>
        </button>

        <div className={styles.headerTopRow}>
          <div className={styles.nameInfo}>
            <h1 className={styles.name}>{user.name}</h1>
            <p className={styles.headline}>
              {profile.headline ||
                profile.currentPosition ||
                "Update your headline"}
            </p>
          </div>

          <div className={styles.rightPanel}>
            {profile.education?.length > 0 && (
              <>
                <i
                  className="fa-solid fa-building"
                  style={{ width: "10px" }}
                ></i>
                <span>{profile.education[0].school}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
