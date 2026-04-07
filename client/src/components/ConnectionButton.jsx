import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  sendConnections,
  acceptConnections,
  rejectConnections,
  cancelPendingConnection,
  removeAcceptedConnection,
} from "@/config/redux/action/connectionAction";
import ConfirmDialog from "@/components/ConfirmDialog";
import styles from "@/features/network/styles.module.css";

function findConnectionWith(overview, myId, targetUserId) {
  if (!overview || !myId || !targetUserId) return null;
  const buckets = [
    ...(overview.accepted || []),
    ...(overview.pendingSent || []),
    ...(overview.pendingReceived || []),
  ];
  const t = String(targetUserId);
  const m = String(myId);
  return (
    buckets.find((c) => {
      const s = String(c.senderId?._id || c.senderId);
      const r = String(c.receiverId?._id || c.receiverId);
      return (s === t && r === m) || (s === m && r === t);
    }) || null
  );
}

export default function ConnectionButton({ targetUserId }) {
  const dispatch = useDispatch();
  const myId = useSelector((state) => state.profile.profile?.userId?._id);
  const overview = useSelector((state) => state.connection.overview);
  const [confirmRemove, setConfirmRemove] = useState(false);

  if (!targetUserId || !myId || String(targetUserId) === String(myId)) {
    return null;
  }

  const conn = findConnectionWith(overview, myId, targetUserId);
  const isAccepted = conn?.status === "accepted";
  const isPending = conn?.status === "pending";
  const iAmSender =
    conn && String(conn.senderId?._id || conn.senderId) === String(myId);
  const iAmReceiver =
    conn && String(conn.receiverId?._id || conn.receiverId) === String(myId);

  // No connection — show Connect
  if (!conn) {
    return (
      <div className={styles.buttonArea}>
        <button
          type="button"
          className={styles.connectButton}
          onClick={() => dispatch(sendConnections(targetUserId))}
        >
          Connect
        </button>
      </div>
    );
  }

  // I sent the request — show Pending + Cancel
  if (isPending && iAmSender) {
    return (
      <div className={styles.buttonArea}>
        <span className={styles.pendingLabel}>Pending</span>
        <button
          type="button"
          className={styles.cancelButton}
          onClick={() => dispatch(cancelPendingConnection(conn._id))}
        >
          Cancel
        </button>
      </div>
    );
  }

  // I received the request — show Accept + Ignore
  if (isPending && iAmReceiver) {
    return (
      <div className={styles.buttonArea}>
        <button
          type="button"
          className={styles.acceptButton}
          onClick={() => dispatch(acceptConnections(conn._id))}
        >
          Accept
        </button>
        <button
          type="button"
          className={styles.ignoreButton}
          onClick={() => dispatch(rejectConnections(conn._id))}
        >
          Ignore
        </button>
      </div>
    );
  }

  // Already connected — show Remove
  if (isAccepted) {
    return (
      <div className={styles.buttonArea}>
        <button
          type="button"
          className={styles.removeButton}
          onClick={() => setConfirmRemove(true)}
        >
          Remove
        </button>
        {confirmRemove && (
          <ConfirmDialog
            title="Remove connection"
            message="Are you sure you want to remove this user as a connection?"
            confirmLabel="Remove"
            cancelLabel="Cancel"
            confirmVariant="danger"
            onCancel={() => setConfirmRemove(false)}
            onConfirm={() => {
              dispatch(removeAcceptedConnection(conn._id));
              setConfirmRemove(false);
            }}
          />
        )}
      </div>
    );
  }

  // Fallback
  return (
    <div className={styles.buttonArea}>
      <button
        type="button"
        className={styles.connectButton}
        onClick={() => dispatch(sendConnections(targetUserId))}
      >
        Connect
      </button>
    </div>
  );
}
