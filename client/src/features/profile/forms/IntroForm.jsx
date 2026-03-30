import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateProfile } from "@/config/redux/action/profileAction";
import styles from "./styles.module.css";

export default function IntroForm({ profile, onClose }) {
  const dispatch = useDispatch();
  const [headline, setHeadline] = useState(profile?.headline || "");
  const [currentPosition, setCurrentPosition] = useState(profile?.currentPosition || "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(updateProfile({ headline, currentPosition }));
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <div className={styles.inputGroup}>
        <label className={styles.label}>Headline</label>
        <input
          type="text"
          value={headline}
          onChange={(e) => setHeadline(e.target.value)}
          className={styles.input}
          placeholder="e.g. Software Engineer at Google"
        />
      </div>

      <div className={styles.inputGroup}>
        <label className={styles.label}>Current Position</label>
        <input
          type="text"
          value={currentPosition}
          onChange={(e) => setCurrentPosition(e.target.value)}
          className={styles.input}
        />
      </div>

      <button type="submit" className={styles.saveButtonFull}>
        Save
      </button>
    </form>
  );
}
