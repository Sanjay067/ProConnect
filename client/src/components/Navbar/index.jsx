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
import { reset as resetPost, toggleMessageSidebar } from "@/config/redux/reducer/postReducer";

export default function Navbar() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [query, setQuery] = useState("");
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
    <div className="sticky top-0 z-50 mb-4 flex w-full flex-wrap items-center justify-between gap-3  border border-yellow-900/50 bg-white px-3 py-2 shadow-sm sm:px-4 md:px-6">
      {/* Left Section: Logo + Search */}
      <div className="flex w-full items-center gap-3 md:w-auto">
        <div className="flex items-center gap-1">
          <i className="fa-regular fa-compass"></i>
          <h2 className="text-lg font-semibold sm:text-xl">ProConnect</h2>
        </div>

        {/* Global Search Interface */}
        <div className="relative hidden items-center sm:flex">
          <i className="fa-solid fa-search pointer-events-none absolute left-3 text-sm text-gray-500"></i>
          <input
            type="text"
            placeholder="Search users..."
            className="h-9 w-44 rounded-md border-none bg-slate-100 py-2 pr-3 pl-9 text-sm outline-none transition-all focus:w-64 focus:ring-2 focus:ring-black/20 md:w-56"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          {/* Search Dropdown Modal */}
          {query.trim().length > 0 && (
            <div className="absolute top-11 left-0 z-[1000] max-h-[24rem] w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
              {isLoading && (
                <p className="m-0 p-2.5 text-center text-sm text-gray-500">
                  Searching...
                </p>
              )}

              {!isLoading &&
                searchResults?.length > 0 &&
                searchResults.map((u) => (
                  <Link
                    key={u._id || u.username}
                    href={u._id ? `/profile/${u._id}` : "/network"}
                    className="flex items-center gap-2.5 px-3 py-2.5 text-inherit transition hover:bg-stone-100"
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
                      <p className="m-0 font-bold">
                        {u.name}
                      </p>
                      <p className="m-0 text-sm text-gray-500">
                        @{u.username}
                      </p>
                    </div>
                  </Link>
                ))}

              {!isLoading && searchResults?.length === 0 && (
                <p className="m-0 p-2.5 text-center text-sm text-gray-500">
                  No users found.
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Section: Navigation Icons */}
      <div className="flex w-full items-center justify-between gap-1 overflow-x-auto sm:justify-start md:w-auto md:gap-2">
        <Link href="/home" className="no-underline">
          <div className="flex min-w-16 flex-col items-center px-2 py-2 text-black">
            <i className="fa-solid fa-house"></i>
            <h4 className="text-xs sm:text-sm">Home</h4>
          </div>
        </Link>

        <Link href="/network" className="no-underline">
          <div className="flex min-w-16 flex-col items-center px-2 py-2 text-black">
            <i className="fa-solid fa-network-wired"></i>
            <h4 className="text-xs sm:text-sm">Network</h4>
          </div>
        </Link>

        <div
          onClick={() => dispatch(toggleMessageSidebar())}
          className="cursor-pointer"
          role="button"
        >
          <div className="flex min-w-16 flex-col items-center px-2 py-2 text-black">
            <i className="fa-regular fa-comment-dots"></i>
            <h4 className="text-xs sm:text-sm">Messages</h4>
          </div>
        </div>

        <Link href="/profile" className="no-underline">
          <div className="flex min-w-16 flex-col items-center px-2 py-2 text-black">
            <i className="fa-solid fa-circle-user"></i>
            <h4 className="max-w-20 truncate text-xs sm:text-sm">{user?.name || "Profile"}</h4>
          </div>
        </Link>
        <div onClick={handleLogout} className="cursor-pointer" role="button">
          <div className="flex min-w-16 flex-col items-center px-2 py-2 text-black">
            <i className="fa-solid fa-arrow-right-from-bracket"></i>
            <h4 className="text-xs sm:text-sm">Logout</h4>
          </div>
        </div>
      </div>
    </div>
  );
}
