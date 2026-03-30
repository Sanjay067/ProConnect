import React from "react";
import styles from "@/pages/profile/styles.module.css";

export default function AboutSection({ profile, onEdit }) {
  return (
    <div className={styles.sectionCard}>
      <h2 className={styles.sectionHeader}>About</h2>

      <button onClick={() => onEdit("ABOUT")} className={styles.pencilBtn}>
        <i className="fa-solid fa-pencil"></i>
      </button>

      <div className={styles.bioText}>{profile.bio || "No bio added yet."}</div>
    </div>
  );
}
