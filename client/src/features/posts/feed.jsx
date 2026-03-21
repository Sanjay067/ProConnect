import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPosts, createPost } from "@/config/redux/action/postAction";
// 1. IMPORT IT HERE
import PostCard from "./PostCard";

export default function Feed() {
  const dispatch = useDispatch();
  const { posts, isLoading } = useSelector((state) => state.post);
  const [postBody, setPostBody] = useState("");

  useEffect(() => {
    dispatch(getPosts());
  }, [dispatch]);

  const handlePostSubmit = (e) => {
    e.preventDefault();
    if (postBody.trim()) {
      dispatch(createPost({ body: postBody }));
      setPostBody("");
    }
  };

  return (
    <div style={{ width: "100%" }}>
      {/* --- CREATE POST BOX --- */}
      <div
        style={{
          background: "white",
          padding: "1rem",
          borderRadius: "8px",
          marginBottom: "2rem",
        }}
      >
        <form
          onSubmit={handlePostSubmit}
          style={{ display: "flex", gap: "10px" }}
        >
          <input
            type="text"
            placeholder="Start a post..."
            value={postBody}
            onChange={(e) => setPostBody(e.target.value)}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "20px",
              border: "1px solid #ccc",
            }}
          />
          <button
            type="submit"
            style={{
              padding: "10px 20px",
              borderRadius: "20px",
              background: "#0a66c2",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            Post
          </button>
        </form>
      </div>

      {/* --- LOADING & EMPTY STATES --- */}
      {isLoading && (
        <div
          style={{ display: "flex", justifyContent: "center", padding: "2rem" }}
        >
          <img src="/spin-loader.gif" alt="Loading..." width={40} />
        </div>
      )}

      {!isLoading && posts?.length === 0 && (
        <p style={{ textAlign: "center" }}>
          No posts yet. Be the first to post!
        </p>
      )}

      {/* --- POST LIST --- */}
      {/* 2. USE POSTCARD HERE */}
      {posts?.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  );
}
