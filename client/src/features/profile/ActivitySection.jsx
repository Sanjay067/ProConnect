import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import styles from "@/pages/profile/styles.module.css";
import PostCard from "@/features/posts/PostCard";

export default function ActivitySection({ posts }) {
  const { connections } = useSelector((state) => state.connection);
  const [showAll, setShowAll] = useState(false);

  const safePosts = Array.isArray(posts) ? posts : [];
  const previewPosts = useMemo(() => safePosts.slice(0, 2), [safePosts]);
  const displayedPosts = showAll ? safePosts : previewPosts;

  return (
    <div className={styles.sectionCard}>
      <h2 className={styles.sectionHeader}>Activity</h2>
      <p
        style={{
          color: "#0a66c2",
          fontWeight: "bold",
          margin: "-10px 0 1rem 0",
        }}
      >
        {connections?.length || 0} connections
      </p>

      <div style={{ marginTop: "1rem" }}>
        {displayedPosts.length > 0 ? (
          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            {displayedPosts.map((post) => (
              <div
                key={post._id}
                style={{
                  borderBottom: "1px solid #eee",
                  paddingBottom: "10px",
                  width: "48%",
                }}
              >
                <p
                  style={{
                    color: "#666",
                    fontSize: "0.8rem",
                    margin: "0 0 5px 0",
                  }}
                >
                  You posted this
                </p>
                <div
                  style={{
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    overflow: "hidden",
                  }}
                >
                  <PostCard post={post} isOwnProfile={true} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className={styles.emptyText}>You haven't posted anything yet.</p>
        )}
      </div>

      <div
        role="button"
        tabIndex={0}
        onClick={() => setShowAll((prev) => !prev)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") setShowAll((prev) => !prev);
        }}
        style={{
          borderTop: "1px solid #eee",
          margin: "1rem -1.5rem -1.5rem -1.5rem",
          padding: "1rem",
          textAlign: "center",
          cursor: "pointer",
          color: "#666",
          fontWeight: "bold",
          userSelect: "none",
        }}
      >
        {showAll ? "Show less activity" : "Show all activity"}{" "}
        <i className="fa-solid fa-arrow-right"></i>
      </div>
    </div>
  );
}
