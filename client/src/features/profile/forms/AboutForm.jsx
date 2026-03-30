import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateProfile } from "@/config/redux/action/profileAction";
import styles from "./styles.module.css";

export default function AboutForm({ profile, onClose }) {
  const dispatch = useDispatch();
  const [bio, setBio] = useState(profile?.bio || "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(updateProfile({ bio }));
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <div className={styles.inputGroup}>
        <label className={styles.label}>About You (Bio)</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className={`${styles.input} ${styles.textarea}`}
          placeholder="Tell visitors about your career, goals, and passions..."
        />
      </div>

      <button type="submit" className={styles.saveButtonFull}>
        Save
      </button>
    </form>
  );
}
