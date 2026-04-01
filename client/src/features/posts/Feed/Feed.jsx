import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFeed, createPost } from "@/config/redux/action/postAction";
// 1. IMPORT IT HERE
import PostCard from "../Postcard/PostCard";
import styles from "./styles.module.css";
import Loader from "@/Components/Loader";
import PostBox from "../PostBox";

export default function Feed() {
  const dispatch = useDispatch();
  const { feedPosts, isLoading } = useSelector((state) => state.post);
  const [postBody, setPostBody] = useState("");

  useEffect(() => {
    dispatch(getFeed());
  }, [dispatch]);

  return (
    <div className={styles.feedWrapper}>
      <PostBox />

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
