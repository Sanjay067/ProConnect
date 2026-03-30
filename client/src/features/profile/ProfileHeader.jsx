import React, { useRef } from "react";
import { useDispatch } from "react-redux";
import { updateProfilePicture } from "@/config/redux/action/profileAction";
import styles from "@/pages/profile/styles.module.css";

export default function ProfileHeader({ profile, user, onEdit }) {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("avatar", file);
      await dispatch(updateProfilePicture(formData));
    }
  };

  return (
    <div className={styles.profileCard} style={{ padding: 0 }}>
      {/* Banner */}
      <div className={styles.banner}></div>

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
