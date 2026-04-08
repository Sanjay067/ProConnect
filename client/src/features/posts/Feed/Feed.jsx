import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFeed } from "@/config/redux/action/postAction";
import PostCard from "../PostCard";
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
    <div className="mx-auto min-h-screen w-full max-w-[760px] px-2 sm:px-3">
      <PostBox />

      <p className="mb-2 text-sm leading-snug text-gray-600"></p>
      {feedPagination.truncated && (
        <p
          className="mb-3 text-xs italic sm:text-sm"
          style={{ color: "var(--text-muted)" }}
        >
          Showing the most recent posts from your network for performance.
        </p>
      )}

      {feedLoading && (
        <div className="flex justify-center py-6">
          <Loader />
        </div>
      )}

      {!feedLoading && feedPosts?.length === 0 && (
        <p className="text-center" style={{ color: "var(--text-muted)" }}>
          No posts yet. Be the first to post!
        </p>
      )}

      <div className="space-y-4">
        {feedPosts?.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>

      {!feedLoading && feedPagination.hasMore && (
        <div className="flex justify-center px-0 pt-5 pb-10">
          <button
            type="button"
            className="cursor-pointer rounded-full border px-7 py-2.5 font-semibold transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            style={{
              borderColor: "var(--accent)",
              color: "var(--accent)",
              background: "var(--surface)",
            }}
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
