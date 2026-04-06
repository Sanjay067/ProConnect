import React from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import ConnectionButton from "@/components/ConnectionButton";
import styles from "./styles.module.css";

export default function UserCard({ user }) {
  const myId = useSelector((state) => state.profile.profile?.userId?._id);
  const userId = user?._id;
  const isSelf = myId && userId ? String(myId) === String(userId) : false;

  return (
    <div className={styles.userCard}>
      <Link href={userId ? `/profile/${userId}` : "#"}>
        <img
          src={
            user.profilePicture ||
            "https://cdn-icons-png.flaticon.com/512/149/149071.png"
          }
          alt="Avatar"
          className={styles.avatar}
        />
      </Link>

      <Link href={userId ? `/profile/${userId}` : "#"} style={{ textDecoration: "none", color: "inherit" }}>
        <h3 className={styles.name}>{user.name}</h3>
      </Link>
      <p className={styles.username}>@{user.username}</p>

      {!isSelf && (
        <ConnectionButton targetUserId={userId} />
      )}
    </div>
  );
}
