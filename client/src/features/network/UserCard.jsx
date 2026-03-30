import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendConnections } from "@/config/redux/action/connectionAction.js";
import styles from "./styles.module.css";

export default function UserCard({ user }) {
  const dispatch = useDispatch();
  const myId = useSelector((state) => state.profile.profile?.userId?._id);
  const userId = user?._id;
  const isSelf = myId && userId ? String(myId) === String(userId) : false;

  return (
    <div className={styles.userCard}>
      <img
        src={
          user.profilePicture ||
          "https://cdn-icons-png.flaticon.com/512/149/149071.png"
        }
        alt="Avatar"
        className={styles.avatar}
      />

      <h3 className={styles.name}>{user.name}</h3>
      <p className={styles.username}>
        @{user.username}
      </p>

      {!isSelf && (
        <button
          onClick={() => dispatch(sendConnections(userId))}
          className={styles.connectButton}
          disabled={!userId}
        >
          Connect
        </button>
      )}
    </div>
  );
}
