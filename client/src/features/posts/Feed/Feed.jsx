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
    <div className="mx-auto min-h-screen w-full max-w-3xl px-3 sm:px-4">
      <PostBox />

      <p className="mb-2 text-sm leading-snug text-gray-600">
      </p>
      {feedPagination.truncated && (
        <p className="mb-3 text-xs italic text-gray-500 sm:text-sm">
          Showing the most recent posts from your network for performance.
        </p>
      )}

      {feedLoading && (
        <div className="flex justify-center py-6">
          <Loader />
        </div>
      )}

      {!feedLoading && feedPosts?.length === 0 && (
        <p className="text-center text-gray-500">
          No posts yet. Be the first to post!
        </p>
      )}

      {feedPosts?.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}

      {!feedLoading && feedPagination.hasMore && (
        <div className="flex justify-center px-0 pt-5 pb-10">
          <button
            type="button"
            className="cursor-pointer rounded-full border border-[#0a66c2] bg-white px-7 py-2.5 font-semibold text-[#0a66c2] transition hover:bg-[#eef3f8] disabled:cursor-not-allowed disabled:opacity-60"
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
