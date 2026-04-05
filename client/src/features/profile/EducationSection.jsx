import React from "react";
import styles from "@/pages/profile/styles.module.css";

export default function EducationSection({ profile, onEdit, readOnly }) {
  return (
    <div className={styles.sectionCard}>
      <h2 className={styles.sectionHeader}>Education</h2>

      {!readOnly && onEdit && (
        <div className={styles.iconRow}>
          <button
            onClick={() => onEdit("EDUCATION", null)}
            className={styles.pencilBtn}
            style={{ position: "relative", top: 0, right: 0 }}
          >
            <i className="fa-solid fa-plus"></i>
          </button>
        </div>
      )}

      <div style={{ marginTop: "1rem" }}>
        {profile.education?.length > 0 ? (
          profile.education.map((edu, index) => (
            <div key={index} className={styles.listItem}>
              <div style={{ display: "flex", gap: "15px" }}>
                <i
                  className="fa-solid fa-building"
                  style={{ width: "10px", marginTop: "5px" }}
                ></i>
                <div>
                  <h3 className={styles.itemTitle}>
                    <strong>{edu.school}</strong>
                  </h3>
                  <p className={styles.itemSubtitle}>{edu.degree}</p>
                  <p className={styles.itemDate}>{edu.year}</p>
                </div>
              </div>
              {!readOnly && onEdit && (
                <button
                  onClick={() => onEdit("EDUCATION", index)}
                  className={styles.pencilBtn}
                  style={{ position: "relative", top: 0, right: 0 }}
                >
                  <i className="fa-solid fa-pencil"></i>
                </button>
              )}
            </div>
          ))
        ) : (
          <p className={styles.emptyText}>No education added yet.</p>
        )}
      </div>
    </div>
  );
}
