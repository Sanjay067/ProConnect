import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFeed } from "@/config/redux/action/postAction";
import PostCard from "../PostCard";
import styles from "./styles.module.css";
import Loader from "@/components/Loader";
import PostBox from "../PostBox";

export default function Feed() {
  const dispatch = useDispatch();
  const { feedPosts, feedLoading, feedPagination } = useSelector(
    (state) => state.post,
  );
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    dispatch(getFeed({ page: 1, limit: 20, append: false }));
  }, [dispatch]);

  const loadMore = async () => {
    if (!feedPagination.hasMore || loadingMore || feedLoading) return;
    setLoadingMore(true);
    try {
      await dispatch(
        getFeed({
          page: (feedPagination.page || 1) + 1,
          limit: feedPagination.limit || 20,
          append: true,
        }),
      ).unwrap();
    } catch {
      /* toast optional */
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div className={styles.feedWrapper}>
      <PostBox />

      <p className={styles.feedHint}>
        Feed is ordered by recent activity and engagement among your network
        (not strictly chronological).
      </p>
      {feedPagination.truncated && (
        <p className={styles.truncatedHint}>
          Showing the most recent posts from your network for performance.
        </p>
      )}

      {feedLoading && (
        <div className={styles.loader}>
          <Loader />
        </div>
      )}

      {!feedLoading && feedPosts?.length === 0 && (
        <p className={styles.emptyMessage}>
          No posts yet. Be the first to post!
        </p>
      )}

      {feedPosts?.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}

      {!feedLoading && feedPagination.hasMore && (
        <div className={styles.loadMoreWrap}>
          <button
            type="button"
            className={styles.loadMoreBtn}
            onClick={loadMore}
            disabled={loadingMore}
          >
            {loadingMore ? "Loading…" : "Load more"}
          </button>
        </div>
      )}
    </div>
  );
}
