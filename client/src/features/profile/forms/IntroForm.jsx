import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateProfile } from "@/config/redux/action/profileAction";

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
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col">
        <label className="mb-1.5 font-bold">Headline</label>
        <input
          type="text"
          value={headline}
          onChange={(e) => setHeadline(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-[0.95rem] outline-none focus:border-[#0a66c2]"
          placeholder="e.g. Software Engineer at Google"
        />
      </div>

      <div className="flex flex-col">
        <label className="mb-1.5 font-bold">Current Position</label>
        <input
          type="text"
          value={currentPosition}
          onChange={(e) => setCurrentPosition(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-[0.95rem] outline-none focus:border-[#0a66c2]"
        />
      </div>

      <button type="submit" className="mt-2 w-full cursor-pointer rounded-full border-none bg-[#0a66c2] px-3 py-2.5 font-bold text-white transition hover:bg-[#004182]">
        Save
      </button>
    </form>
  );
}
