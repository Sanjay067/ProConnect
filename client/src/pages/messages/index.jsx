import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import UserLayout from "@/layout/UserLayout";
import ProtectedRoute from "@/components/Protected";
import clientApi from "@/services/clientApi";
import styles from "./styles.module.css";

export default function MessagesPage() {
  const router = useRouter();
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const loadConversations = useCallback(async () => {
    try {
      const { data } = await clientApi.get("/messages/conversations");
      setConversations(data.conversations || []);
    } catch {
      setConversations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMessages = async (conversationId) => {
    if (!conversationId) return;
    try {
      const { data } = await clientApi.get(
        `/messages/conversations/${conversationId}/messages`,
      );
      setMessages(data.messages || []);
    } catch {
      setMessages([]);
    }
  };

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    if (!router.isReady) return;
    const c = router.query.c;
    if (c) setActiveId(String(c));
  }, [router.isReady, router.query.c]);

  useEffect(() => {
    if (activeId) loadMessages(activeId);
  }, [activeId]);

  const send = async (e) => {
    e.preventDefault();
    const text = body.trim();
    if (!text || !activeId) return;
    setSending(true);
    try {
      const { data } = await clientApi.post(
        `/messages/conversations/${activeId}/messages`,
        { body: text },
      );
      setMessages((prev) => [...prev, data.chatMessage]);
      setBody("");
      loadConversations();
    } catch {
      /* ignore */
    } finally {
      setSending(false);
    }
  };

  const active = conversations.find((c) => c._id === activeId);

  return (
    <ProtectedRoute>
      <UserLayout>
        <div className={styles.layout}>
          <aside className={styles.sidebar}>
            <h2 className={styles.title}>Messages</h2>
            {loading && <p>Loading…</p>}
            {!loading && conversations.length === 0 && (
              <p className={styles.muted}>
                No conversations yet. Open someone&apos;s profile and start from
                Network.
              </p>
            )}
            <ul className={styles.convList}>
              {conversations.map((c) => (
                <li key={c._id}>
                  <button
                    type="button"
                    className={
                      c._id === activeId ? styles.convActive : styles.convBtn
                    }
                    onClick={() => setActiveId(c._id)}
                  >
                    {c.otherUser?.name || "User"}
                    <span className={styles.sub}>@{c.otherUser?.username}</span>
                  </button>
                </li>
              ))}
            </ul>
            <Link href="/network" className={styles.link}>
              Find people
            </Link>
          </aside>
          <main className={styles.thread}>
            {!activeId && (
              <p className={styles.placeholder}>Select a conversation</p>
            )}
            {activeId && active && (
              <>
                <div className={styles.threadHeader}>
                  <h3>{active.otherUser?.name}</h3>
                  {active.otherUser?._id && (
                    <Link href={`/profile/${active.otherUser._id}`}>Profile</Link>
                  )}
                </div>
                <div className={styles.bubbleList}>
                  {messages.map((m) => (
                    <div key={m._id} className={styles.bubble}>
                      <strong>{m.senderId?.name || "User"}</strong>
                      <p>{m.body}</p>
                    </div>
                  ))}
                </div>
                <form onSubmit={send} className={styles.composer}>
                  <input
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Message…"
                  />
                  <button type="submit" disabled={sending}>
                    Send
                  </button>
                </form>
              </>
            )}
          </main>
        </div>
      </UserLayout>
    </ProtectedRoute>
  );
}
