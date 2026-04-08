import React from "react";

export default function AboutSection({ profile, onEdit, readOnly }) {
  return (
    <div className="relative rounded-2xl border p-6" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
      <h2 className="mb-4 text-xl">About</h2>

      {!readOnly && onEdit && (
        <button onClick={() => onEdit("ABOUT")} className="absolute top-6 right-6 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-none bg-transparent text-lg text-gray-500 transition hover:bg-stone-100">
          <i className="fa-solid fa-pencil"></i>
        </button>
      )}

      <div className="text-[0.95rem] leading-relaxed whitespace-pre-wrap" style={{ color: "var(--text-muted)" }}>{profile.bio || "No bio added yet."}</div>
    </div>
  );
}
