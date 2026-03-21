import React from "react";
import { useDispatch } from "react-redux";
import { sendConnections } from "@/config/redux/action/connectionAction.js";
import styles from "./styles.module.css";

export default function UserCard({ user }) {
  const dispatch = useDispatch();

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

      <button
        onClick={() => dispatch(sendConnections(user._id))}
        className={styles.connectButton}
      >
        Connect
      </button>
    </div>
  );
}
