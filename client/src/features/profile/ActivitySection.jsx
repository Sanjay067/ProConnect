import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import PostCard from "@/features/posts/PostCard";

export default function ActivitySection({ posts }) {
  const { connections } = useSelector((state) => state.connection);
  const [showAll, setShowAll] = useState(false);

  const safePosts = Array.isArray(posts) ? posts : [];
  const previewPosts = useMemo(() => safePosts.slice(0, 2), [safePosts]);
  const displayedPosts = showAll ? safePosts : previewPosts;

  return (
    <div className="rounded-2xl border p-6" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
      <h2 className="mb-4 text-xl">Activity</h2>
      <p className="-mt-2 mb-4 font-bold text-[#0a66c2]">
        {connections?.length || 0} connections
      </p>

      <div className="mt-4">
        {displayedPosts.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {displayedPosts.map((post) => (
              <div key={post._id} className="w-full border-b border-gray-200 pb-2.5">
                <p className="mb-1 text-xs" style={{ color: "var(--text-muted)" }}>
                  You posted this
                </p>
                <div className="overflow-hidden rounded-lg border" style={{ borderColor: "var(--border)" }}>
                  <PostCard post={post} isOwnProfile={true} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: "var(--text-muted)" }}>You haven&apos;t posted anything yet.</p>
        )}
      </div>

      <div
        role="button"
        tabIndex={0}
        onClick={() => setShowAll((prev) => !prev)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") setShowAll((prev) => !prev);
        }}
        className="mx-[-1.5rem] mt-4 mb-[-1.5rem] border-t p-4 text-center font-bold select-none"
        style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
      >
        {showAll ? "Show less activity" : "Show all activity"}{" "}
        <i className="fa-solid fa-arrow-right"></i>
      </div>
    </div>
  );
}
