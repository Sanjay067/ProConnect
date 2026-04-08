import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateCommentCount } from "@/config/redux/reducer/postReducer";
import clientApi from "@/services/clientApi";
import CommentItem from "./CommentItem";
import CommentInput from "./CommentInput";

export default function CommentSection({ post }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isLoadingComments, setIsLoadingComments] = useState(true);
  const myId = useSelector((state) => state.profile.profile?.userId?._id);
  const myUser = useSelector((state) => state.profile.profile?.userId);
  const dispatch = useDispatch();

  useEffect(() => {
    clientApi
      .get(`/posts/${post._id}/comments`)
      .then(({ data }) =>
        setComments((data.comments || []).filter((c) => !c.isDeleted)),
      )
      .catch((err) => console.error("Failed to fetch comments", err))
      .finally(() => setIsLoadingComments(false));
  }, [post._id]);

  const removeCommentFromList = (commentId) => {
    setComments((prev) =>
      prev.filter((c) => String(c._id) !== String(commentId)),
    );
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const { data } = await clientApi.post(`/posts/${post._id}/comments`, {
        body: newComment,
      });
      const serverAuthor = data.comment?.author;
      const hasServerAuthor =
        serverAuthor && typeof serverAuthor === "object" && serverAuthor.name;
      const hydratedComment = {
        ...data.comment,
        author: hasServerAuthor
          ? serverAuthor
          : {
              _id: myUser?._id || myId,
              name: myUser?.name || "You",
              username: myUser?.username,
              profilePicture: myUser?.profilePicture,
            },
      };
      setComments((prev) => [hydratedComment, ...prev]);
      setNewComment("");
      dispatch(updateCommentCount({ postId: post._id, count: 1 }));
    } catch (error) {
      console.error("Failed to add comment", error);
    }
  };

  return (
    <div className="mt-4 flex flex-col gap-3 rounded-xl bg-neutral-50 p-5">
      <CommentInput
        value={newComment}
        onChange={(e) => setNewComment(e.target ? e.target.value : e)}
        onSubmit={handleAddComment}
        placeholder="Add a comment..."
        submitLabel="Post"
      />

      {isLoadingComments ? (
        <p className="text-sm text-gray-500">Loading comments...</p>
      ) : comments.length > 0 ? (
        comments.map((comment) => (
          <CommentItem
            key={comment._id}
            initialComment={comment}
            post={post}
            myId={myId}
            onRemoved={removeCommentFromList}
          />
        ))
      ) : (
        <p className="text-sm text-gray-500">No comments yet.</p>
      )}
    </div>
  );
}
