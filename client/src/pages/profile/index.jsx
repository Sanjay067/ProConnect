import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getUserProfile,
  updateProfile,
} from "@/config/redux/action/profileAction";
import UserLayout from "@/Layout/UserLayout";
import ProtectedRoute from "@/Components/Protected";
import styles from "./styles.module.css";

export default function ProfilePage() {
  const dispatch = useDispatch();

  const { profile, isLoading } = useSelector((state) => state.profile);

  // Edit Mode state
  const [isEditing, setIsEditing] = useState(false);

  // Form State
  const [bio, setBio] = useState("");
  const [currentPosition, setCurrentPosition] = useState("");

  useEffect(() => {
    dispatch(getUserProfile());
  }, [dispatch]);

  // Pre-fill the form whenever we open Edit Mode
  const handleOpenEdit = () => {
    setBio(profile?.bio || "");
    setCurrentPosition(profile?.currentPosition || "");
    setIsEditing(true);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    // Dispatch our new updateProfile action!
    await dispatch(updateProfile({ bio, currentPosition }));
    setIsEditing(false); // Close the modal
  };

  const user = profile?.userId;

  return (
    <ProtectedRoute>
      <UserLayout>
        <div className={styles.container}>
          {isLoading && <p>Loading profile...</p>}

          {profile && user && (
            <div className={styles.profileCard}>
              <div className={styles.headerSection}>
                <img
                  src={
                    user.profilePicture ||
                    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  }
                  alt="Avatar"
                  className={styles.avatar}
                />
                <div>
                  <h1 className={styles.name}>{user.name}</h1>
                  <p className={styles.username}>@{user.username}</p>
                  <p className={styles.position}>
                    {profile.currentPosition || "Open to work"}
                  </p>
                </div>
                {!isEditing && (
                  <button
                    onClick={handleOpenEdit}
                    className={styles.editButton}
                  >
                    Edit Profile
                  </button>
                )}
              </div>

              {/* ----- EDIT MODE FORM ----- */}
              {isEditing ? (
                <form
                  onSubmit={handleSaveProfile}
                  style={{
                    marginTop: "2rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  <label style={{ fontWeight: "bold" }}>Bio</label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    style={{
                      padding: "10px",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                      minHeight: "100px",
                    }}
                  />

                  <div
                    style={{ display: "flex", gap: "10px", marginTop: "1rem" }}
                  >
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      style={{
                        padding: "10px 20px",
                        background: "#eee",
                        borderRadius: "5px",
                        border: "none",
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      style={{
                        padding: "10px 20px",
                        background: "#0a66c2",
                        color: "white",
                        borderRadius: "5px",
                        border: "none",
                      }}
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                /* ----- NORMAL VIEW MODE ----- */
                <>
                  <h2 className={styles.firstSectionHeader}>About</h2>
                  <p className={styles.bioText}>
                    {profile.bio || "No bio added yet."}
                  </p>

                  <h2 className={styles.sectionHeader}>Experience</h2>
                  {profile.pastWork?.length > 0 ? (
                    profile.pastWork.map((work, index) => (
                      <div key={index} className={styles.listItem}>
                        <h3 className={styles.itemTitle}>{work.position}</h3>
                        <p className={styles.itemSubtitle}>
                          {work.companyName}
                        </p>
                        <p className={styles.itemDate}>{work.years}</p>
                      </div>
                    ))
                  ) : (
                    <p className={styles.emptyText}>No experience added yet.</p>
                  )}

                  <h2 className={styles.sectionHeader}>Education</h2>
                  {profile.education?.length > 0 ? (
                    profile.education.map((edu, index) => (
                      <div key={index} className={styles.listItem}>
                        <h3 className={styles.itemTitle}>{edu.school}</h3>
                        <p className={styles.itemSubtitleRegular}>
                          {edu.degree}
                        </p>
                        <p className={styles.itemDate}>{edu.year}</p>
                      </div>
                    ))
                  ) : (
                    <p className={styles.emptyText}>No education added yet.</p>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </UserLayout>
    </ProtectedRoute>
  );
}
