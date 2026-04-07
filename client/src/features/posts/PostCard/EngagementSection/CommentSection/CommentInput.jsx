import React from "react";

export default function CommentInput({
  value,
  onChange,
  onSubmit,
  onCancel,
  placeholder = "Add a comment...",
  submitLabel = "Post",
  isReply = false,
}) {
  return (
    <form
      onSubmit={onSubmit}
      className={`mb-4 flex gap-2.5 ${isReply ? "mt-2.5" : ""}`}
    >
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="m-0 flex-1 rounded-full border border-gray-300 px-3 py-2"
      />
      {onCancel && (
        <button
          type="button"
          className="cursor-pointer border-none bg-transparent font-bold text-gray-600"
          onClick={onCancel}
        >
          Cancel
        </button>
      )}
      <button
        type="submit"
        className="cursor-pointer rounded-full border-none bg-[#0a66c2] px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-60"
        disabled={!value?.trim()}
      >
        {submitLabel}
      </button>
    </form>
  );
}
