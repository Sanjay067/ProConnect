import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFeed, createPost } from "@/config/redux/action/postAction";
// 1. IMPORT IT HERE
import PostCard from "../PostCard";
import styles from "./styles.module.css";
import Loader from "@/components/Loader";
import PostBox from "../PostBox";

export default function Feed() {
  const dispatch = useDispatch();
  const { feedPosts, feedLoading } = useSelector((state) => state.post);
  // const [postBody, setPostBody] = useState("");

  useEffect(() => {
    dispatch(getFeed());
  }, [dispatch]);

  return (
    <div className={styles.feedWrapper}>
      <PostBox />

      {/* --- LOADING & EMPTY STATES --- */}
      {feedLoading && (
        <div className={styles.loader}>
          <Loader />
        </div>
      )}

      {/* --- POST LIST --- */}
      {/* 2. USE POSTCARD HERE */}
      {!feedLoading && feedPosts?.length === 0 && (
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
