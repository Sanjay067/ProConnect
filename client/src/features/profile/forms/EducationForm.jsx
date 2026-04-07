import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateProfile } from "@/config/redux/action/profileAction";

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
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col">
        <label className="mb-1.5 font-bold">School / University</label>
        <input type="text" value={school} onChange={(e) => setSchool(e.target.value)} required className="rounded-md border border-gray-300 px-3 py-2 text-[0.95rem] outline-none focus:border-[#0a66c2]" />
      </div>

      <div className="flex flex-col">
        <label className="mb-1.5 font-bold">Degree</label>
        <input type="text" value={degree} onChange={(e) => setDegree(e.target.value)} required className="rounded-md border border-gray-300 px-3 py-2 text-[0.95rem] outline-none focus:border-[#0a66c2]" />
      </div>

      <div className="flex flex-col">
        <label className="mb-1.5 font-bold">Field of Study / Graduation Year</label>
        <input type="text" value={fieldOfStudy} onChange={(e) => setFieldOfStudy(e.target.value)} required className="rounded-md border border-gray-300 px-3 py-2 text-[0.95rem] outline-none focus:border-[#0a66c2]" />
      </div>

      <div className="mt-2 flex gap-2.5">
        {isEditing && (
          <button type="button" onClick={handleDelete} className="flex-1 cursor-pointer rounded-full border-none bg-rose-100 px-3 py-2.5 font-bold text-rose-900 transition hover:bg-rose-200">
            Delete
          </button>
        )}
        <button type="submit" className="flex-[2] cursor-pointer rounded-full border-none bg-[#0a66c2] px-3 py-2.5 font-bold text-white transition hover:bg-[#004182]">
          Save
        </button>
      </div>
    </form>
  );
}
