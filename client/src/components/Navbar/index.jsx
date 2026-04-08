import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { searchUsers } from "@/config/redux/action/searchAction";
import { clearSearch } from "@/config/redux/reducer/searchReducer";
import { useRouter } from "next/router";
import { logoutUser } from "@/config/redux/action/authAction";
import { reset as resetAuth } from "@/config/redux/reducer/authReducer";
import { reset as resetProfile } from "@/config/redux/reducer/profileReducer";
import { reset as resetConnection } from "@/config/redux/reducer/connectionReducer";
import {
  reset as resetPost,
  toggleMessageSidebar,
} from "@/config/redux/reducer/postReducer";
import { useTheme } from "@/context/ThemeContext";

export default function Navbar() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const { isDark, toggleTheme } = useTheme();
  const { searchResults, isLoading } = useSelector((state) => state.search);
  const { profile } = useSelector((state) => state.profile);
  const user = profile?.userId;

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
    } catch (e) {
      // Logout may fail if auth middleware rejects due to missing/expired token.
      // We still clear client-side auth state and redirect.
    } finally {
      dispatch(resetAuth());
      dispatch(resetProfile());
      dispatch(resetConnection());
      dispatch(resetPost());
      dispatch(clearSearch());
      router.replace("/login");
    }
  };

  useEffect(() => {
    // Basic debounce to stop blasting the API on every single keystroke
    const delayDebounceFn = setTimeout(() => {
      if (query.trim()) {
        dispatch(searchUsers(query));
      } else {
        dispatch(clearSearch());
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [query, dispatch]);

  return (
    <div
      className="sticky top-0 z-50 mb-5 rounded-2xl border px-3 py-2 shadow-sm sm:px-4 md:px-6"
      style={{ background: "var(--surface)", borderColor: "var(--border)" }}
    >
      <div className="ms-10 flex w-full items-center justify-between gap-3 md:grid md:grid-cols-[1fr_auto_1fr] md:gap-6">
        {/* Left Section: Logo + Search */}
        <div className="ms-4 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <i
              className="fa-regular fa-compass"
              style={{ color: "var(--accent)" }}
            ></i>
            <h2 className="text-lg font-semibold sm:text-xl">ProConnect</h2>
          </div>

          {/* Global Search Interface */}
          <div className="relative flex items-center">
            <i
              className="fa-solid fa-search pointer-events-none absolute left-2 me-6 text-sm"
              style={{ color: "var(--text-muted)" }}
            ></i>
            <input
              type="text"
              placeholder="Search users..."
              className="h-9 w-[52vw] rounded-xl border py-2 pr-3 pl-9 text-sm outline-none transition-all focus:w-[58vw] focus:ring-2 sm:w-44 sm:focus:w-64 md:w-56"
              style={{
                background: "var(--surface-soft)",
                borderColor: "var(--border)",
              }}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />

            {/* Search Dropdown Modal */}
            {query.trim().length > 0 && (
              <div
                className="absolute top-11 left-0 z-[1000] max-h-[24rem] w-full overflow-y-auto rounded-lg border shadow-lg"
                style={{
                  background: "var(--surface)",
                  borderColor: "var(--border)",
                }}
              >
                {isLoading && (
                  <p
                    className="m-0 p-2.5 text-center text-sm"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Searching...
                  </p>
                )}

                {!isLoading &&
                  searchResults?.length > 0 &&
                  searchResults.map((u) => (
                    <Link
                      key={u._id || u.username}
                      href={u._id ? `/profile/${u._id}` : "/network"}
                      className="flex items-center gap-2.5 px-3 py-2.5 text-inherit transition hover:opacity-90"
                      style={{ color: "var(--text)" }}
                      onClick={() => setQuery("")}
                    >
                      <img
                        src={
                          u.profilePicture ||
                          "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                        }
                        alt=""
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="m-0 font-bold">{u.name}</p>
                        <p
                          className="m-0 text-sm"
                          style={{ color: "var(--text-muted)" }}
                        >
                          @{u.username}
                        </p>
                      </div>
                    </Link>
                  ))}

                {!isLoading && searchResults?.length === 0 && (
                  <p
                    className="m-0 p-2.5 text-center text-sm"
                    style={{ color: "var(--text-muted)" }}
                  >
                    No users found.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Center Section: desktop primary navigation */}
        <div className="hidden items-center justify-center gap-1 md:flex md:gap-3">
          <Link href="/home" className="no-underline">
            <div
              className="flex min-w-16 flex-col items-center px-2 py-2"
              style={{ color: "var(--text)" }}
            >
              <i className="fa-solid fa-house"></i>
              <h4 className="text-xs sm:text-sm">Home</h4>
            </div>
          </Link>

          <Link href="/network" className="no-underline">
            <div
              className="flex min-w-16 flex-col items-center px-2 py-2"
              style={{ color: "var(--text)" }}
            >
              <i className="fa-solid fa-network-wired"></i>
              <h4 className="text-xs sm:text-sm">Network</h4>
            </div>
          </Link>

          <div
            onClick={() => dispatch(toggleMessageSidebar())}
            className="cursor-pointer"
            role="button"
          >
            <div
              className="flex min-w-16 flex-col items-center px-2 py-2"
              style={{ color: "var(--text)" }}
            >
              <i className="fa-regular fa-comment-dots"></i>
              <h4 className="text-xs sm:text-sm">Messages</h4>
            </div>
          </div>

          <Link href="/profile" className="no-underline">
            <div
              className="flex min-w-16 flex-col items-center px-2 py-2"
              style={{ color: "var(--text)" }}
            >
              <i className="fa-solid fa-circle-user"></i>
              <h4 className="max-w-20 truncate text-xs sm:text-sm">
                {user?.name || "Profile"}
              </h4>
            </div>
          </Link>
        </div>

        {/* Right Section: desktop utility actions */}
        <div className="hidden items-center justify-end gap-2 md:flex">
          <button
            type="button"
            onClick={toggleTheme}
            className="cursor-pointer rounded-full border px-3 py-2 text-sm font-medium"
            style={{
              borderColor: "var(--border)",
              background: "var(--surface-soft)",
              color: "var(--text)",
            }}
            aria-label="Toggle dark mode"
          >
            {isDark ? (
              <i className="fa-regular fa-moon text-lg sm:text-lg"></i>
            ) : (
              <i className="fa-solid fa-moon text-lg sm:text-lg"></i>
            )}
          </button>
          <div onClick={handleLogout} className="cursor-pointer" role="button">
            <div
              className="flex min-w-16 flex-col items-center px-2 py-2"
              style={{ color: "var(--text)" }}
            >
              <i className="fa-solid fa-arrow-right-from-bracket"></i>
              <h4 className="text-xs sm:text-sm">Logout</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
