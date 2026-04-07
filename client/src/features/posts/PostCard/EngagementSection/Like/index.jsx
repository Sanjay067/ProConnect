import React from "react";

export default function Like({
  likeCount,
  isLiked,
  onToggleLike,
  onOpenLikes,
  ariaLabel,
  disabled = false,
}) {
  const canOpenLikes = typeof onOpenLikes === "function";

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={onToggleLike}
        className="cursor-pointer rounded-full border-none bg-transparent p-1.5"
        aria-label={ariaLabel || (isLiked ? "Unlike" : "Like")}
        disabled={disabled}
      >
        <i
          className={`fa-solid fa-thumbs-up rounded-full p-1 text-[1.2rem] ${isLiked ? "text-sky-500" : "text-gray-500"}`}
        />
      </button>
      <button
        type="button"
        className="rounded border-none bg-transparent px-2 py-1 text-[0.95rem] font-semibold text-gray-500 enabled:cursor-pointer enabled:hover:bg-stone-100 enabled:hover:text-[#0a66c2] disabled:cursor-default"
        onClick={() => onOpenLikes?.()}
        aria-label="View likes"
        disabled={!canOpenLikes}
      >
        {likeCount ?? 0}
      </button>
    </div>
  );
}
