import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateProfile } from "@/config/redux/action/profileAction";
import styles from "./styles.module.css";

export default function EducationForm({ profile, onClose, editIndex }) {
  const dispatch = useDispatch();
  
  const isEditing = editIndex !== null && editIndex !== undefined;
  const existingEdu = isEditing ? profile?.education[editIndex] : null;

  const [school, setSchool] = useState(existingEdu?.school || "");
  const [degree, setDegree] = useState(existingEdu?.degree || "");
  const [fieldOfStudy, setFieldOfStudy] = useState(existingEdu?.fieldOfStudy || existingEdu?.year || "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newEdu = { school, degree, fieldOfStudy };
    let updatedEdu = [...(profile?.education || [])];
    
    if (isEditing) {
      updatedEdu[editIndex] = newEdu; // Update existing
    } else {
      updatedEdu.unshift(newEdu); // Add to top
    }
    
    await dispatch(updateProfile({ education: updatedEdu }));
    onClose();
  };

  const handleDelete = async () => {
    if (!isEditing) return;
    let updatedEdu = [...(profile?.education || [])];
    updatedEdu.splice(editIndex, 1);
    await dispatch(updateProfile({ education: updatedEdu }));
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <div className={styles.inputGroup}>
        <label className={styles.label}>School / University</label>
        <input type="text" value={school} onChange={(e) => setSchool(e.target.value)} required className={styles.input} />
      </div>

      <div className={styles.inputGroup}>
        <label className={styles.label}>Degree</label>
        <input type="text" value={degree} onChange={(e) => setDegree(e.target.value)} required className={styles.input} />
      </div>

      <div className={styles.inputGroup}>
        <label className={styles.label}>Field of Study / Graduation Year</label>
        <input type="text" value={fieldOfStudy} onChange={(e) => setFieldOfStudy(e.target.value)} required className={styles.input} />
      </div>

      <div className={styles.buttonRow}>
        {isEditing && (
          <button type="button" onClick={handleDelete} className={styles.deleteButton}>
            Delete
          </button>
        )}
        <button type="submit" className={styles.saveButton}>
          Save
        </button>
      </div>
    </form>
  );
}
