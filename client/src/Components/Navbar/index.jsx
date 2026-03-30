import React, { useState, useEffect } from "react";
import styles from "./style.module.css";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { searchUsers } from "@/config/redux/action/searchAction";
import { clearSearch } from "@/config/redux/reducer/searchReducer";
import { useRouter } from "next/router";
import { logoutUser } from "@/config/redux/action/authAction";
import { reset as resetAuth } from "@/config/redux/reducer/authReducer";

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
    <div className={styles.container}>
      {/* Left Section: Logo + Search */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <div className={styles.logo}>
          <i className="fa-regular fa-compass"></i>
          <h2> ProConnect</h2>
        </div>

        {/* Global Search Interface */}
        <div className={styles.searchContainer}>
          <i className={`fa-solid fa-search ${styles.searchIcon}`}></i>
          <input
            type="text"
            placeholder="Search users..."
            className={styles.searchInput}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          {/* Search Dropdown Modal */}
          {query.trim().length > 0 && (
            <div className={styles.searchDropdown}>
              {isLoading && (
                <p
                  style={{
                    padding: "10px",
                    textAlign: "center",
                    color: "#666",
                    margin: 0,
                  }}
                >
                  Searching...
                </p>
              )}

              {!isLoading &&
                searchResults?.length > 0 &&
                searchResults.map((user) => (
                  <div
                    key={user._id}
                    className={styles.searchResultItem}
                    onClick={() => setQuery("")}
                  >
                    <img
                      src={
                        user.profilePicture ||
                        "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                      }
                      alt="Avatar"
                      className={styles.searchAvatar}
                    />
                    <div>
                      <p style={{ margin: 0, fontWeight: "bold" }}>
                        {user.name}
                      </p>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "0.85rem",
                          color: "#666",
                        }}
                      >
                        @{user.username}
                      </p>
                    </div>
                  </div>
                ))}

              {!isLoading && searchResults?.length === 0 && (
                <p
                  style={{
                    padding: "10px",
                    textAlign: "center",
                    color: "#666",
                    margin: 0,
                  }}
                >
                  No users found.
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Section: Navigation Icons */}
      <div className={styles.featureContainer}>
        <Link href="/home">
          <div className={styles.feature}>
            <i className="fa-solid fa-house"></i>
            <h4>Home</h4>
          </div>
        </Link>

        <Link href="/network">
          <div className={styles.feature}>
            <i className="fa-solid fa-network-wired"></i>
            <h4>Network</h4>
          </div>
        </Link>

        <Link href="/profile">
          <div className={styles.feature}>
            <i className="fa-solid fa-circle-user"></i>
            <h4>{user?.name || "Profile"}</h4>
          </div>
        </Link>
      </div>

      <div onClick={handleLogout} className={styles.logoutLink} role="button">
        <div className={styles.feature}>
          <i className="fa-solid fa-arrow-right-from-bracket"></i>
          <h4>Logout</h4>
        </div>
      </div>
    </div>
  );
}
