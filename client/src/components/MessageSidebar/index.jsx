import React, { useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { closeMessageSidebar } from "@/config/redux/reducer/postReducer";
import {
  getConversations,
  getMessagesByPeer,
  sendMessage,
} from "@/config/redux/action/messageAction";
import { setActivePeer } from "@/config/redux/reducer/messageReducer";

export default function MessageSidebar() {
  const dispatch = useDispatch();
  const { messageSidebarOpen, messageRecipient } = useSelector(
    (state) => state.post,
  );
  const myId = useSelector((state) => state.profile.profile?.userId?._id);
  const {
    conversations,
    activePeer,
    messagesByPeer,
    conversationsLoading,
    messagesLoading,
    sending,
  } = useSelector((state) => state.message);

  const [draft, setDraft] = React.useState("");
  const messagesEndRef = useRef(null);

  /* ── Side effects ── */
  React.useEffect(() => {
    if (!messageSidebarOpen) return;
    dispatch(getConversations());
  }, [messageSidebarOpen, dispatch]);

  React.useEffect(() => {
    if (!messageSidebarOpen || !messageRecipient?._id) return;
    dispatch(setActivePeer(messageRecipient));
  }, [messageSidebarOpen, messageRecipient, dispatch]);

  React.useEffect(() => {
    if (!activePeer?._id) return;
    dispatch(getMessagesByPeer(activePeer._id));
  }, [activePeer?._id, dispatch]);

  // Auto-scroll to bottom whenever messages update
  React.useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messagesByPeer, activePeer?._id]);

  /* ── Derived ── */
  const activePeerId = activePeer?._id ? String(activePeer._id) : null;
  const activeMessages = activePeerId
    ? messagesByPeer[activePeerId] || []
    : [];

  const formatTime = (value) => {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleSend = async (e) => {
    e.preventDefault();
    const body = draft.trim();
    if (!activePeerId || !body || sending) return;
    await dispatch(sendMessage({ peerId: activePeerId, body }));
    setDraft("");
    dispatch(getConversations());
  };

  /* ── Render ── */
  return (
    <>
      {/* ── Mobile overlay ── */}
      {messageSidebarOpen && (
        <div
          className="fixed inset-0 z-[900] bg-black/40 md:hidden"
          onClick={() => dispatch(closeMessageSidebar())}
        />
      )}

      {/*
        Desktop : fixed bottom-right panel (680 × 560 px)
        Mobile  : full-screen slide-up panel
      */}
      <div
        className={`
          fixed z-[950] flex flex-col overflow-hidden border shadow-2xl
          transition-all duration-300
          inset-0
          md:inset-auto md:right-6 md:bottom-0
          md:h-[560px] md:w-[680px] md:rounded-t-2xl
          ${messageSidebarOpen ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none"}
        `}
        style={{ background: "var(--surface)", borderColor: "var(--border)" }}
      >
        {/* ── Header ── */}
        <div
          className="flex flex-shrink-0 items-center gap-3 border-b px-5 py-3.5"
          style={{ borderColor: "var(--border)" }}
        >
          {/* Mobile back arrow (only when a peer is active) */}
          {activePeer && (
            <button
              type="button"
              className="flex items-center justify-center rounded-full border-none bg-transparent p-1.5 text-lg transition hover:opacity-70 md:hidden"
              style={{ color: "var(--text-muted)" }}
              aria-label="Back to conversations"
              onClick={() => dispatch(setActivePeer(null))}
            >
              <i className="fa-solid fa-arrow-left" />
            </button>
          )}

          <h3
            className="m-0 flex flex-1 items-center gap-2 text-base font-semibold"
            style={{ color: "var(--text)" }}
          >
            <i
              className="fa-regular fa-comment-dots"
              style={{ color: "var(--accent)" }}
            />
            {activePeer ? (
              <span className="md:hidden">{activePeer.name}</span>
            ) : null}
            <span className={activePeer ? "hidden md:inline" : ""}>
              Messaging
            </span>
          </h3>

          <button
            className="cursor-pointer rounded-full border-none bg-transparent p-2 text-lg transition hover:opacity-70"
            onClick={() => dispatch(closeMessageSidebar())}
            type="button"
            aria-label="Close messages"
            style={{ color: "var(--text-muted)" }}
          >
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        {/* ── Body (two-pane) ── */}
        <div className="flex min-h-0 flex-1 overflow-hidden">

          {/* ── Left: Conversations list ── */}
          {/*
            Mobile  : visible only when NO peer selected
            Desktop : always visible, fixed 220 px wide
          */}
          <div
            className={`
              flex-shrink-0 overflow-y-auto border-r
              ${activePeer ? "hidden" : "flex w-full flex-col"}
              md:flex md:w-[220px] md:flex-col
            `}
            style={{ borderColor: "var(--border)" }}
          >
            <p
              className="px-4 pt-3 pb-1 text-[11px] font-semibold uppercase tracking-widest"
              style={{ color: "var(--text-muted)" }}
            >
              Conversations
            </p>

            {conversationsLoading && (
              <p
                className="px-4 py-3 text-sm"
                style={{ color: "var(--text-muted)" }}
              >
                Loading…
              </p>
            )}
            {!conversationsLoading && conversations.length === 0 && (
              <p
                className="px-4 py-3 text-sm"
                style={{ color: "var(--text-muted)" }}
              >
                No conversations yet.
              </p>
            )}

            <div className="flex flex-col gap-0.5 p-2">
              {conversations.map((c) => {
                const peer = c.peer;
                if (!peer?._id) return null;
                const selected =
                  String(activePeer?._id) === String(peer._id);
                return (
                  <button
                    key={peer._id}
                    type="button"
                    onClick={() => dispatch(setActivePeer(peer))}
                    className="flex w-full cursor-pointer items-center gap-3 rounded-xl border-none px-3 py-2.5 text-left transition"
                    style={{
                      background: selected
                        ? "color-mix(in srgb, var(--accent) 12%, transparent)"
                        : "transparent",
                      color: "var(--text)",
                    }}
                  >
                    <img
                      src={
                        peer.profilePicture ||
                        "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                      }
                      alt=""
                      className="h-10 w-10 flex-shrink-0 rounded-full object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p
                        className="truncate text-sm font-semibold"
                        style={{
                          color: selected ? "var(--accent)" : "var(--text)",
                        }}
                      >
                        {peer.name}
                      </p>
                      <p
                        className="truncate text-xs"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {c.lastMessage?.body || `@${peer.username}`}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Right: Message area ── */}
          {/*
            Mobile  : visible only when peer IS selected
            Desktop : always visible, fills remaining width
          */}
          <div
            className={`
              min-w-0 flex-1 flex-col
              ${!activePeer ? "hidden" : "flex"}
              md:flex
            `}
          >
            {/* Peer sub-header (desktop only; mobile uses main header) */}
            {activePeer ? (
              <div
                className="hidden flex-shrink-0 items-center gap-3 border-b px-4 py-3 md:flex"
                style={{ borderColor: "var(--border)" }}
              >
                <img
                  src={
                    activePeer.profilePicture ||
                    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  }
                  alt=""
                  className="h-9 w-9 rounded-full object-cover"
                />
                <div>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "var(--text)" }}
                  >
                    {activePeer.name}
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: "var(--text-muted)" }}
                  >
                    @{activePeer.username}
                  </p>
                </div>
              </div>
            ) : (
              <div
                className="flex-shrink-0 border-b px-4 py-3 text-sm"
                style={{
                  borderColor: "var(--border)",
                  color: "var(--text-muted)",
                }}
              >
                Select a conversation to start messaging
              </div>
            )}

            {/* Messages scroller */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
              {messagesLoading && activePeer && (
                <p
                  className="text-sm"
                  style={{ color: "var(--text-muted)" }}
                >
                  Loading messages…
                </p>
              )}
              {!messagesLoading &&
                activePeer &&
                activeMessages.length === 0 && (
                  <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                    <i
                      className="fa-regular fa-comments text-4xl"
                      style={{ color: "var(--text-muted)", opacity: 0.4 }}
                    />
                    <p
                      className="text-sm"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Start the conversation with{" "}
                      <strong>{activePeer.name}</strong>
                    </p>
                  </div>
                )}

              {!messagesLoading &&
                activeMessages.map((m) => {
                  const mine = String(m.senderId) === String(myId);
                  return (
                    <div
                      key={m._id}
                      className={`mb-3 flex flex-col ${mine ? "items-end" : "items-start"}`}
                    >
                      <div
                        className="max-w-[70%] break-words rounded-2xl px-4 py-2.5 text-sm leading-relaxed"
                        style={{
                          background: mine
                            ? "var(--accent)"
                            : "var(--surface-alt, #ebebeb)",
                          color: mine ? "#fff" : "var(--text)",
                        }}
                      >
                        {m.body}
                      </div>
                      <span
                        className="mt-0.5 px-1 text-[11px]"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {formatTime(m.createdAt)}
                      </span>
                    </div>
                  );
                })}
              {/* Anchor for auto-scroll */}
              <div ref={messagesEndRef} />
            </div>

            {/* Message input */}
            <form
              onSubmit={handleSend}
              className="flex flex-shrink-0 items-center gap-2 border-t px-4 py-3"
              style={{ borderColor: "var(--border)" }}
            >
              <input
                type="text"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder={
                  activePeer ? "Type a message…" : "Pick a conversation first"
                }
                disabled={!activePeer}
                className="m-0 flex-1 rounded-full border px-4 py-2 text-sm outline-none transition focus:ring-2"
                style={{
                  borderColor: "var(--border)",
                  background: "var(--bg)",
                  color: "var(--text)",
                }}
              />
              <button
                type="submit"
                disabled={!activePeer || !draft.trim() || sending}
                className="flex-shrink-0 cursor-pointer rounded-full border-none px-5 py-2 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50"
                style={{ background: "var(--accent)" }}
              >
                {sending ? "…" : "Send"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
