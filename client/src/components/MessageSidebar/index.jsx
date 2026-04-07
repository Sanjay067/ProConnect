import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { closeMessageSidebar } from "@/config/redux/reducer/postReducer";

export default function MessageSidebar() {
  const dispatch = useDispatch();
  const { messageSidebarOpen, messageRecipient } = useSelector(
    (state) => state.post,
  );

  return (
    <>
      {/* Backdrop */}
      {messageSidebarOpen && (
        <div
          className="fixed inset-0 z-[900] bg-black/30"
          onClick={() => dispatch(closeMessageSidebar())}
        />
      )}

      {/* Sidebar panel */}
      <div
        className={`fixed top-0 right-0 z-[950] flex h-screen w-[380px] max-w-[90vw] flex-col bg-white shadow-[-4px_0_24px_rgba(0,0,0,0.12)] transition-transform duration-300 ${messageSidebarOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <h3 className="m-0 flex items-center gap-2 text-[1.1rem] font-semibold text-gray-700">
            <i className="fa-regular fa-comment-dots"></i>
            Messaging
          </h3>
          <button
            className="cursor-pointer rounded-full border-none bg-transparent px-2 py-1.5 text-xl text-gray-500 transition hover:bg-stone-100 hover:text-gray-700"
            onClick={() => dispatch(closeMessageSidebar())}
            type="button"
            aria-label="Close messages"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {messageRecipient ? (
            <div className="mb-5 flex items-center gap-3 rounded-xl bg-gray-100 px-4 py-3.5">
              <img
                src={
                  messageRecipient.profilePicture ||
                  "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }
                alt="Recipient"
                className="h-11 w-11 rounded-full object-cover"
              />
              <div>
                <p className="m-0 text-[0.95rem] font-semibold text-gray-700">
                  {messageRecipient.name}
                </p>
                <p className="m-0 text-sm text-gray-500">
                  @{messageRecipient.username}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center px-5 py-10 text-center text-gray-400">
              <i className="fa-regular fa-paper-plane"></i>
              <p>Select a conversation or message someone from their post.</p>
            </div>
          )}

          <div className="mt-5 flex items-center justify-center rounded-xl border-2 border-dashed border-gray-200 p-8 text-sm text-gray-400">
            <p>No messages yet.</p>
          </div>
        </div>
      </div>
    </>
  );
}
