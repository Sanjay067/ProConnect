import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import clientApi from "@/services/clientApi";
import { getSocket, disconnectSocket } from "@/lib/socket";
import styles from "./NotificationBell.module.css";

const PUBLIC_PATHS = ["/login", "/forgot-password", "/reset-password", "/verify-email"];

export default function NotificationBell() {
  const router = useRouter();
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const refreshCount = useCallback(async () => {
    if (PUBLIC_PATHS.includes(router.pathname)) return;
    try {
      const { data } = await clientApi.get("/notifications/unread-count");
      setCount(data.count ?? 0);
    } catch {
      setCount(0);
    }
  }, [router.pathname]);

  const loadList = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await clientApi.get("/notifications", {
        params: { limit: 15 },
      });
      setItems(data.notifications || []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (PUBLIC_PATHS.includes(router.pathname)) {
      disconnectSocket();
      return undefined;
    }
    refreshCount();
    const socket = getSocket();
    if (!socket) return undefined;
    const onNotify = () => {
      refreshCount();
      if (open) loadList();
    };
    socket.on("notification", onNotify);
    const id = setInterval(refreshCount, 60000);
    return () => {
      socket.off("notification", onNotify);
      clearInterval(id);
    };
  }, [router.pathname, refreshCount, open, loadList]);

  useEffect(() => {
    if (open) loadList();
  }, [open, loadList]);

  const markAll = async () => {
    try {
      await clientApi.patch("/notifications/read-all");
      setCount(0);
      setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch {
      /* ignore */
    }
  };

  if (PUBLIC_PATHS.includes(router.pathname)) return null;

  return (
    <div className={styles.wrap}>
      <button
        type="button"
        className={styles.bell}
        aria-label="Notifications"
        onClick={() => setOpen((v) => !v)}
      >
        <i className="fa-regular fa-bell" />
        {count > 0 && <span className={styles.badge}>{count > 99 ? "99+" : count}</span>}
      </button>
      {open && (
        <>
          <div
            className={styles.backdrop}
            role="presentation"
            onClick={() => setOpen(false)}
          />
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <span>Notifications</span>
              <button type="button" className={styles.linkBtn} onClick={markAll}>
                Mark all read
              </button>
            </div>
            {loading && <p className={styles.muted}>Loading…</p>}
            {!loading && items.length === 0 && (
              <p className={styles.muted}>No notifications yet.</p>
            )}
            <ul className={styles.list}>
              {items.map((n) => (
                <li key={n._id} className={n.read ? styles.itemRead : styles.item}>
                  <p className={styles.title}>{n.title}</p>
                  {n.message && <p className={styles.msg}>{n.message}</p>}
                  {n.meta?.postId && (
                    <Link
                      href="/home"
                      className={styles.link}
                      onClick={() => setOpen(false)}
                    >
                      View feed
                    </Link>
                  )}
                </li>
              ))}
            </ul>
            <Link href="/messages" className={styles.footerLink} onClick={() => setOpen(false)}>
              Messages
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
