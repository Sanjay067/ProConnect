import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateProfile } from "@/config/redux/action/profileAction";

export default function ExperienceForm({ profile, onClose, editIndex }) {
  const dispatch = useDispatch();

  // If editIndex is provided, we edit that specific item. Otherwise, it's a new entry.
  const isEditing = editIndex !== null && editIndex !== undefined;
  const existingJob = isEditing ? profile?.pastWork[editIndex] : null;

  const [company, setCompany] = useState(
    existingJob?.company || existingJob?.companyName || "",
  );
  const [position, setPosition] = useState(existingJob?.position || "");
  const [years, setYears] = useState(existingJob?.years || "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newJob = { company, position, years };
    let updatedWork = [...(profile?.pastWork || [])];

    if (isEditing) {
      updatedWork[editIndex] = newJob; // Update existing
    } else {
      updatedWork.unshift(newJob); // Add to top
    }

    await dispatch(updateProfile({ pastWork: updatedWork }));
    onClose();
  };

  const handleDelete = async () => {
    if (!isEditing) return;
    let updatedWork = [...(profile?.pastWork || [])];
    updatedWork.splice(editIndex, 1);
    await dispatch(updateProfile({ pastWork: updatedWork }));
    onClose();
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: "15px" }}
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        <label style={{ fontWeight: "bold", marginBottom: "5px" }}>
          Company Name
        </label>
        <input
          type="text"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          required
          style={{
            padding: "8px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <label style={{ fontWeight: "bold", marginBottom: "5px" }}>
          Title / Position
        </label>
        <input
          type="text"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          required
          style={{
            padding: "8px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <label style={{ fontWeight: "bold", marginBottom: "5px" }}>
          Years Active (e.g. 2021 - Present)
        </label>
        <input
          type="text"
          value={years}
          onChange={(e) => setYears(e.target.value)}
          required
          style={{
            padding: "8px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
      </div>

      <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
        {isEditing && (
          <button
            type="button"
            onClick={handleDelete}
            style={{
              flex: 1,
              padding: "10px",
              background: "#f8d7da",
              color: "#721c24",
              borderRadius: "20px",
              border: "none",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Delete
          </button>
        )}
        <button
          type="submit"
          style={{
            flex: 2,
            padding: "10px",
            background: "#0a66c2",
            color: "white",
            borderRadius: "20px",
            border: "none",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Save
        </button>
      </div>
    </form>
  );
}
