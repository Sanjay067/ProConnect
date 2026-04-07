import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateProfile } from "@/config/redux/action/profileAction";

export default function AboutForm({ profile, onClose }) {
  const dispatch = useDispatch();
  const [bio, setBio] = useState(profile?.bio || "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(updateProfile({ bio }));
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col">
        <label className="mb-1.5 font-bold">About You (Bio)</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="min-h-[150px] resize-y rounded-md border border-gray-300 px-3 py-2 text-[0.95rem] outline-none focus:border-[#0a66c2]"
          placeholder="Tell visitors about your career, goals, and passions..."
        />
      </div>

      <button type="submit" className="mt-2 w-full cursor-pointer rounded-full border-none bg-[#0a66c2] px-3 py-2.5 font-bold text-white transition hover:bg-[#004182]">
        Save
      </button>
    </form>
  );
}
