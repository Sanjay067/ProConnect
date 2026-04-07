import React from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import ConnectionButton from "@/components/ConnectionButton";

export default function UserCard({ user }) {
  const myId = useSelector((state) => state.profile.profile?.userId?._id);
  const userId = user?._id;
  const isSelf = myId && userId ? String(myId) === String(userId) : false;

  return (
    <div className="flex min-h-[260px] w-full max-w-[240px] flex-col items-center justify-between rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm transition hover:shadow-md">
      <Link href={userId ? `/profile/${userId}` : "#"}>
        <img
          src={
            user.profilePicture ||
            "https://cdn-icons-png.flaticon.com/512/149/149071.png"
          }
          alt="Avatar"
          className="mb-4 h-20 w-20 rounded-full object-cover ring-2 ring-slate-100"
        />
      </Link>

      <Link href={userId ? `/profile/${userId}` : "#"} className="text-inherit no-underline">
        <h3 className="m-0 text-lg font-semibold">{user.name}</h3>
      </Link>
      <p className="mt-1 text-sm text-gray-500">@{user.username}</p>

      {!isSelf && (
        <ConnectionButton targetUserId={userId} />
      )}
    </div>
  );
}
