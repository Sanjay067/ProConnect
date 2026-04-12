import Navbar from "@/components/Navbar";
import MessageSidebar from "@/components/MessageSidebar";
import CommentSidebar from "@/components/CommentSidebar";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { toggleMessageSidebar, closeMessageSidebar } from "@/config/redux/reducer/postReducer";
import { useTheme } from "@/context/ThemeContext";

export default function UserLayout({ children }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isDark, toggleTheme } = useTheme();
  const [showBottomNav, setShowBottomNav] = useState(true);
  const scrollTimeoutRef = useRef(null);

  // Close the message sidebar whenever the user navigates to a different page
  useEffect(() => {
    const handleRouteChange = () => dispatch(closeMessageSidebar());
    router.events.on("routeChangeStart", handleRouteChange);
    return () => router.events.off("routeChangeStart", handleRouteChange);
  }, [router, dispatch]);

  useEffect(() => {
    const onScroll = () => {
      setShowBottomNav(false);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(() => {
        setShowBottomNav(true);
      }, 160);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  const navItemClass = (active) =>
    `flex flex-col items-center gap-0.5 px-2 py-2 text-xs ${active ? "font-semibold" : ""}`;

  return (
    <div
      className="min-h-screen w-screen overflow-x-hidden pb-16 md:pb-0"
      style={{ background: "var(--bg)", color: "var(--text)" }}
    >
      <Navbar />
      <main className="flex w-full justify-center px-0 sm:px-4">
        {children}
      </main>

      <div
        className={`fixed right-0 bottom-0 left-0 z-40 border-t px-2 py-1 tr    ansition-transform duration-200 md:hidden ${showBottomNav ? "translate-y-0" : "translate-y-full"}`}
        style={{ background: "var(--surface)", borderColor: "var(--border)" }}
      >
        <div className="mx-auto flex max-w-md items-center justify-around">
          <Link
            href="/home"
            className={navItemClass(router.pathname === "/home")}
            style={{ color: "var(--text)" }}
          >
            <i className="fa-solid fa-house text-base" />
            <span>Home</span>
          </Link>
          <Link
            href="/network"
            className={navItemClass(router.pathname === "/network")}
            style={{ color: "var(--text)" }}
          >
            <i className="fa-solid fa-network-wired text-base" />
            <span>Network</span>
          </Link>
          <button
            type="button"
            onClick={() => dispatch(toggleMessageSidebar())}
            className={navItemClass(false)}
            style={{ color: "var(--text)" }}
          >
            <i className="fa-regular fa-comment-dots text-base" />
            <span>Messages</span>
          </button>
          <Link
            href="/profile"
            className={navItemClass(router.pathname.startsWith("/profile"))}
            style={{ color: "var(--text)" }}
          >
            <i className="fa-solid fa-circle-user text-base" />
            <span>Profile</span>
          </Link>
          <button
            type="button"
            onClick={toggleTheme}
            className={navItemClass(false)}
            style={{ color: "var(--text)" }}
          >
            <i
              className={`fa-solid ${isDark ? "fa-sun" : "fa-moon"} text-base`}
            />
            <span>Theme</span>
          </button>
        </div>
      </div>

      <MessageSidebar />
      <CommentSidebar />
    </div>
  );
}
