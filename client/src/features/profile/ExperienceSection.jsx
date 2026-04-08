import React from "react";

export default function ExperienceSection({ profile, onEdit, readOnly }) {
  return (
    <div className="relative rounded-2xl border p-6" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
      <h2 className="mb-4 text-xl">Experience</h2>

      {!readOnly && onEdit && (
        <div className="absolute top-6 right-6 flex gap-1">
          <button
            onClick={() => onEdit("EXPERIENCE", null)}
            className="relative top-0 right-0 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-none bg-transparent text-lg text-gray-500 transition hover:bg-stone-100"
          >
            <i className="fa-solid fa-plus"></i>
          </button>
        </div>
      )}

      <div className="mt-4">
        {profile.pastWork?.length > 0 ? (
          profile.pastWork.map((work, index) => (
            <div key={index} className="mb-4 flex justify-between border-b pb-4 last:mb-0 last:border-b-0 last:pb-0" style={{ borderColor: "var(--border)" }}>
              <div className="flex gap-4">
                <i
                  className="fa-brands fa-simplybuilt"
                  style={{ width: "10px", marginTop: "6px" }}
                ></i>
                <div>
                  <h3 className="m-0 text-[1.1rem]">
                    <strong>{work.position}</strong>
                  </h3>
                  <p className="my-1 text-[0.95rem]">{work.companyName}</p>
                  <p className="m-0 text-sm" style={{ color: "var(--text-muted)" }}>{work.years}</p>
                </div>
              </div>
              {!readOnly && onEdit && (
                <button
                  onClick={() => onEdit("EXPERIENCE", index)}
                  className="relative top-0 right-0 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-none bg-transparent text-lg text-gray-500 transition hover:bg-stone-100"
                >
                  <i className="fa-solid fa-pencil"></i>
                </button>
              )}
            </div>
          ))
        ) : (
          <p style={{ color: "var(--text-muted)" }}>No experience added yet.</p>
        )}
      </div>
    </div>
  );
}
