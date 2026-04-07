import React from "react";

export default function ConfirmDialog({
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  confirmVariant = "danger",
  onConfirm,
  onCancel,
}) {
  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/55 p-4"
      role="presentation"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
        role="dialog"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-desc"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 id="confirm-title" className="mb-3 text-xl text-gray-700">
          {title}
        </h3>
        <p id="confirm-desc" className="mb-6 leading-relaxed text-gray-500">
          {message}
        </p>
        <div className="flex justify-end gap-2.5">
          <button type="button" className="cursor-pointer rounded-full border border-gray-300 bg-transparent px-4 py-2 font-semibold text-gray-500 transition hover:bg-stone-100" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button
            type="button"
            className={confirmVariant === "danger" ? "cursor-pointer rounded-full border-none bg-[#cc1016] px-5 py-2 font-semibold text-white transition hover:bg-[#a30d12]" : "cursor-pointer rounded-full border-none bg-[#0a66c2] px-5 py-2 font-semibold text-white transition hover:bg-[#004182]"}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
