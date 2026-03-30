import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFeed, createPost } from "@/config/redux/action/postAction";
// 1. IMPORT IT HERE
import PostCard from "../Postcard/PostCard";
import styles from "./styles.module.css";
import Loader from "@/Components/Loader";

export default function Feed() {
  const dispatch = useDispatch();
  const { feedPosts, isLoading } = useSelector((state) => state.post);
  const [postBody, setPostBody] = useState("");

  useEffect(() => {
    dispatch(getFeed());
  }, [dispatch]);

  const handlePostSubmit = (e) => {
    e.preventDefault();
    if (postBody.trim()) {
      dispatch(createPost({ body: postBody }));
      setPostBody("");
    }
  };

  return (
    <div className={styles.feedWrapper}>
      {/* --- CREATE POST BOX --- */}
      <div className={styles.feedcontainer}>
        <form
          onSubmit={handlePostSubmit}
          className={styles.postForm}
        >
          <input
            type="text"
            placeholder="Start a post..."
            value={postBody}
            onChange={(e) => setPostBody(e.target.value)}
            className={styles.postInput}
          />
          <button type="submit" className={styles.postButton}>
            Post
          </button>
        </form>
      </div>

      {/* --- LOADING & EMPTY STATES --- */}
      {isLoading && (
        <div className={styles.loader}>
          <Loader />
        </div>
      )}



      {/* --- POST LIST --- */}
      {/* 2. USE POSTCARD HERE */}
      {!isLoading && feedPosts?.length === 0 && (
        <p className={styles.emptyMessage}>
          No posts yet. Be the first to post!
        </p>
      )}

      {feedPosts?.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  );
}
