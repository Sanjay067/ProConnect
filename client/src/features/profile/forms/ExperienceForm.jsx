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
      className="flex flex-col gap-4"
    >
      <div className="flex flex-col">
        <label className="mb-1.5 font-bold">
          Company Name
        </label>
        <input
          type="text"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          required
          className="rounded-md border border-gray-300 px-3 py-2 text-[0.95rem] outline-none focus:border-[#0a66c2]"
        />
      </div>

      <div className="flex flex-col">
        <label className="mb-1.5 font-bold">
          Title / Position
        </label>
        <input
          type="text"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          required
          className="rounded-md border border-gray-300 px-3 py-2 text-[0.95rem] outline-none focus:border-[#0a66c2]"
        />
      </div>

      <div className="flex flex-col">
        <label className="mb-1.5 font-bold">
          Years Active (e.g. 2021 - Present)
        </label>
        <input
          type="text"
          value={years}
          onChange={(e) => setYears(e.target.value)}
          required
          className="rounded-md border border-gray-300 px-3 py-2 text-[0.95rem] outline-none focus:border-[#0a66c2]"
        />
      </div>

      <div className="mt-2 flex gap-2.5">
        {isEditing && (
          <button
            type="button"
            onClick={handleDelete}
            className="flex-1 cursor-pointer rounded-full border-none bg-rose-100 px-3 py-2.5 font-bold text-rose-900 transition hover:bg-rose-200"
          >
            Delete
          </button>
        )}
        <button
          type="submit"
          className="flex-[2] cursor-pointer rounded-full border-none bg-[#0a66c2] px-3 py-2.5 font-bold text-white transition hover:bg-[#004182]"
        >
          Save
        </button>
      </div>
    </form>
  );
}
