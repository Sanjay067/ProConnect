import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleCommentSection } from "@/config/redux/reducer/postReducer";
import { toggleLikePost } from "@/config/redux/action/postAction";
import Like from "./Like";
import LikesModal from "./LikesModal";

export default function EngagementSection({ post }) {
  const dispatch = useDispatch();
  const [showLikes, setShowLikes] = useState(false);
  const activeCommentPostId = useSelector(
    (state) => state.post.activeCommentPostId,
  );
  const isActive = activeCommentPostId === post._id;

  return (
    <>
      <div className="flex gap-6 border-t border-gray-200 pt-4">
        <Like
          likeCount={post.likeCount}
          isLiked={post.isLiked}
          onToggleLike={() => dispatch(toggleLikePost(post._id))}
          onOpenLikes={() => setShowLikes(true)}
        />
        <button
          type="button"
          onClick={() => dispatch(toggleCommentSection(post._id))}
          className={`cursor-pointer border-none bg-transparent font-bold text-gray-500 ${isActive ? "text-[#0a66c2]" : ""}`}
        >
          <i className="fa-regular fa-comment text-xl"></i>
          &nbsp;
          {post.commentCount || 0}
        </button>
      </div>

      {showLikes && (
        <LikesModal postId={post._id} onClose={() => setShowLikes(false)} />
      )}
    </>
  );
}
