import React from "react";
import styles from "@/pages/profile/styles.module.css";

export default function ExperienceSection({ profile, onEdit }) {
  return (
    <div className={styles.sectionCard}>
      <h2 className={styles.sectionHeader}>Experience</h2>

      <div className={styles.iconRow}>
        <button
          onClick={() => onEdit("EXPERIENCE", null)}
          className={styles.pencilBtn}
          style={{ position: "relative", top: 0, right: 0 }}
        >
          <i className="fa-solid fa-plus"></i>
        </button>
      </div>

      <div style={{ marginTop: "1rem" }}>
        {profile.pastWork?.length > 0 ? (
          profile.pastWork.map((work, index) => (
            <div key={index} className={styles.listItem}>
              <div style={{ display: "flex", gap: "15px" }}>
                <i
                  className="fa-brands fa-simplybuilt"
                  style={{ width: "10px", marginTop: "6px" }}
                ></i>
                <div>
                  <h3 className={styles.itemTitle}>
                    <strong>{work.position}</strong>
                  </h3>
                  <p className={styles.itemSubtitle}>{work.companyName}</p>
                  <p className={styles.itemDate}>{work.years}</p>
                </div>
              </div>
              <button
                onClick={() => onEdit("EXPERIENCE", index)}
                className={styles.pencilBtn}
                style={{ position: "relative", top: 0, right: 0 }}
              >
                <i className="fa-solid fa-pencil"></i>
              </button>
            </div>
          ))
        ) : (
          <p className={styles.emptyText}>No experience added yet.</p>
        )}
      </div>
    </div>
  );
}
