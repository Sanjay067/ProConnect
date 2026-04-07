import React, { useEffect, useState } from "react";
import Link from "next/link";
import clientApi from "@/services/clientApi";

export default function LikesModal({ postId, onClose }) {
  const [likes, setLikes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    clientApi
      .get(`/posts/${postId}/likes`)
      .then(({ data }) => {
        if (!cancelled) setLikes(data.likes || []);
      })
      .catch(() => {
        if (!cancelled) setLikes([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [postId]);

  return (
    <div
      className="fixed inset-0 z-[10001] flex items-center justify-center bg-black/45 p-4"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="flex max-h-[70vh] w-full max-w-[400px] flex-col overflow-hidden rounded-xl bg-white shadow-2xl"
        role="dialog"
        aria-labelledby="likes-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3.5">
          <h3 id="likes-title">People who liked this</h3>
          <button type="button" className="cursor-pointer border-none bg-transparent p-1 text-xl text-gray-500" onClick={onClose}>
            <i className="fa-solid fa-times" />
          </button>
        </div>
        <div className="overflow-y-auto py-2">
          {loading && <p className="m-0 p-4 text-center text-gray-500">Loading…</p>}
          {!loading && likes.length === 0 && (
            <p className="m-0 p-4 text-center text-gray-500">No likes yet.</p>
          )}
          {!loading &&
            likes.map((like) => {
              const u = like.userId;
              if (!u?._id) return null;
              return (
                <Link
                  key={like._id}
                  href={`/profile/${u._id}`}
                  className="flex items-center gap-3 px-4 py-2.5 text-inherit no-underline hover:bg-stone-100"
                  onClick={onClose}
                >
                  <img
                    src={
                      u.profilePicture ||
                      "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                    }
                    alt=""
                    className="h-11 w-11 rounded-full object-cover"
                  />
                  <div>
                    <p className="m-0 font-semibold">{u.name}</p>
                    <p className="m-0 text-sm text-gray-500">@{u.username}</p>
                  </div>
                </Link>
              );
            })}
        </div>
      </div>
    </div>
  );
}
