import React from "react";

export default function EducationSection({ profile, onEdit, readOnly }) {
  return (
    <div className="relative rounded-xl border border-[#dce6f1] bg-white p-6">
      <h2 className="mb-4 text-xl">Education</h2>

      {!readOnly && onEdit && (
        <div className="absolute top-6 right-6 flex gap-1">
          <button
            onClick={() => onEdit("EDUCATION", null)}
            className="relative top-0 right-0 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-none bg-transparent text-lg text-gray-500 transition hover:bg-stone-100"
          >
            <i className="fa-solid fa-plus"></i>
          </button>
        </div>
      )}

      <div className="mt-4">
        {profile.education?.length > 0 ? (
          profile.education.map((edu, index) => (
            <div key={index} className="mb-4 flex justify-between border-b border-gray-200 pb-4 last:mb-0 last:border-b-0 last:pb-0">
              <div className="flex gap-4">
                <i
                  className="fa-solid fa-building"
                  style={{ width: "10px", marginTop: "5px" }}
                ></i>
                <div>
                  <h3 className="m-0 text-[1.1rem]">
                    <strong>{edu.school}</strong>
                  </h3>
                  <p className="my-1 text-[0.95rem]">{edu.degree}</p>
                  <p className="m-0 text-sm text-gray-500">{edu.year}</p>
                </div>
              </div>
              {!readOnly && onEdit && (
                <button
                  onClick={() => onEdit("EDUCATION", index)}
                  className="relative top-0 right-0 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-none bg-transparent text-lg text-gray-500 transition hover:bg-stone-100"
                >
                  <i className="fa-solid fa-pencil"></i>
                </button>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500">No education added yet.</p>
        )}
      </div>
    </div>
  );
}
