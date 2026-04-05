import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  sendConnections,
  acceptConnections,
  rejectConnections,
  cancelPendingConnection,
  removeAcceptedConnection,
} from "@/config/redux/action/connectionAction";
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

export default function ConnectionButton({ targetUserId, className }) {
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
    conn &&
    String(conn.senderId?._id || conn.senderId) === String(myId);
  const iAmReceiver =
    conn &&
    String(conn.receiverId?._id || conn.receiverId) === String(myId);

  const btnClass = className || styles.connectButton;

  if (!conn) {
    return (
      <button
        type="button"
        className={btnClass}
        onClick={() => dispatch(sendConnections(targetUserId))}
      >
        Connect
      </button>
    );
  }

  if (isPending && iAmSender) {
    return (
      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <span style={{ color: "#666", fontWeight: 600, fontSize: "0.9rem" }}>
          Pending
        </span>
        <button
          type="button"
          className={btnClass}
          onClick={() => dispatch(cancelPendingConnection(conn._id))}
        >
          Cancel
        </button>
      </div>
    );
  }

  if (isPending && iAmReceiver) {
    return (
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        <button
          type="button"
          className={btnClass}
          onClick={() => dispatch(acceptConnections(conn._id))}
        >
          Accept
        </button>
        <button
          type="button"
          className={btnClass}
          onClick={() => dispatch(rejectConnections(conn._id))}
        >
          Ignore
        </button>
      </div>
    );
  }

  if (isAccepted) {
    return (
      <>
        <button
          type="button"
          className={btnClass}
          onClick={() => setConfirmRemove(true)}
        >
          Remove
        </button>
        {confirmRemove && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10000,
            }}
          >
            <div
              style={{
                background: "#fff",
                padding: "24px",
                borderRadius: "12px",
                maxWidth: "400px",
                width: "90%",
              }}
            >
              <h3 style={{ marginTop: 0 }}>Remove connection</h3>
              <p style={{ color: "#555" }}>
                Are you sure you want to remove this user as a connection?
              </p>
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  justifyContent: "flex-end",
                  marginTop: "16px",
                }}
              >
                <button
                  type="button"
                  onClick={() => setConfirmRemove(false)}
                  style={{
                    padding: "8px 16px",
                    border: "1px solid #ccc",
                    borderRadius: "20px",
                    background: "#fff",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    dispatch(removeAcceptedConnection(conn._id));
                    setConfirmRemove(false);
                  }}
                  style={{
                    padding: "8px 16px",
                    border: "none",
                    borderRadius: "20px",
                    background: "#c00",
                    color: "#fff",
                    cursor: "pointer",
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <button
      type="button"
      className={btnClass}
      onClick={() => dispatch(sendConnections(targetUserId))}
    >
      Connect
    </button>
  );
}
