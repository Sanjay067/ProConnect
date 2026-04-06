import React, { useState } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/router";
import ConnectionButton from "@/components/ConnectionButton";
import clientApi from "@/services/clientApi";
import styles from "./styles.module.css";

export default function UserCard({ user }) {
  const router = useRouter();
  const myId = useSelector((state) => state.profile.profile?.userId?._id);
  const userId = user?._id;
  const isSelf = myId && userId ? String(myId) === String(userId) : false;
  const [msgLoading, setMsgLoading] = useState(false);

  const openMessages = async () => {
    if (!userId) return;
    setMsgLoading(true);
    try {
      const { data } = await clientApi.post("/messages/conversations", {
        userId,
      });
      const id = data.conversation?._id;
      if (id) router.push(`/messages?c=${id}`);
    } catch {
      /* ignore */
    } finally {
      setMsgLoading(false);
    }
  };

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
        <>
          <ConnectionButton targetUserId={userId} className={styles.connectButton} />
          <button
            type="button"
            className={styles.connectButton}
            onClick={openMessages}
            disabled={msgLoading}
            style={{ marginTop: 8 }}
          >
            {msgLoading ? "…" : "Message"}
          </button>
        </>
      )}
    </div>
  );
}
