import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleCommentSection } from "@/config/redux/reducer/postReducer";
import CommentSection from "@/features/posts/PostCard/EngagementSection/CommentSection";

export default function CommentSidebar() {
  const dispatch = useDispatch();
  const activeCommentPostId = useSelector(
    (state) => state.post.activeCommentPostId,
  );
  const feedPosts = useSelector((state) => state.post.feedPosts);
  const profilePosts = useSelector((state) => state.post.posts);

  // Find the active post from either feed or profile posts
  const activePost =
    feedPosts.find((p) => String(p._id) === String(activeCommentPostId)) ||
    profilePosts.find((p) => String(p._id) === String(activeCommentPostId));

  const isOpen = !!activeCommentPostId && !!activePost;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[900] bg-black/30"
          onClick={() => dispatch(toggleCommentSection(activeCommentPostId))}
        />
      )}

      {/* Sidebar panel */}
      <div className={`fixed top-0 right-0 z-[950] flex h-screen w-[420px] max-w-[92vw] flex-col bg-white shadow-[-4px_0_24px_rgba(0,0,0,0.12)] transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-gray-200 px-5 py-4">
          <div className="flex flex-col gap-0.5">
            <h3 className="m-0 flex items-center gap-2 text-[1.1rem] font-semibold text-gray-700">
              <i className="fa-regular fa-comments"></i>
              Comments
            </h3>
            {activePost && (
              <span className="text-xs text-gray-400">
                on {activePost.author?.name}&apos;s post
              </span>
            )}
          </div>
          <button
            className="shrink-0 cursor-pointer rounded-full border-none bg-transparent px-2 py-1.5 text-xl text-gray-500 transition hover:bg-stone-100 hover:text-gray-700"
            onClick={() =>
              dispatch(toggleCommentSection(activeCommentPostId))
            }
            type="button"
            aria-label="Close comments"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Post preview snippet */}
        {activePost && (
          <div className="shrink-0 border-b border-gray-200 bg-gray-50 px-5 py-3">
            <p className="m-0 text-sm leading-snug text-gray-600">
              {activePost.body?.length > 120
                ? `${activePost.body.slice(0, 120)}...`
                : activePost.body}
            </p>
          </div>
        )}

        {/* Comment section body */}
        <div className="flex-1 overflow-y-auto p-0">
          {activePost ? (
            <CommentSection post={activePost} />
          ) : (
            <div className="flex flex-col items-center justify-center px-5 py-12 text-center text-gray-400">
              <i className="fa-regular fa-comment-dots"></i>
              <p>Select a post to view comments.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
