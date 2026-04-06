import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllProfiles,
  getUserProfile,
} from "@/config/redux/action/profileAction";
import {
  getConnectionsOverview,
  acceptConnections,
  rejectConnections,
} from "@/config/redux/action/connectionAction";
import UserLayout from "@/layout/UserLayout";
import ProtectedRoute from "@/components/Protected";
import UserCard from "@/features/network/UserCard";
import styles from "./styles.module.css";

export default function NetworkPage() {
  const dispatch = useDispatch();
  const [loadingMore, setLoadingMore] = useState(false);

  const {
    allProfiles,
    isLoading: profilesLoading,
    profile: currentUser,
    profilesPagination,
  } = useSelector((state) => state.profile);
  const { connections, overview, initialLoading: connectionsLoading } = useSelector(
    (state) => state.connection,
  );
  const pendingReceived = overview?.pendingReceived || [];

  useEffect(() => {
    dispatch(getUserProfile());
    dispatch(getAllProfiles({ page: 1, limit: 24, append: false }));
    dispatch(getConnectionsOverview());
  }, [dispatch]);

  const loadMorePeople = async () => {
    if (!profilesPagination.hasMore || loadingMore || profilesLoading) return;
    setLoadingMore(true);
    try {
      await dispatch(
        getAllProfiles({
          page: (profilesPagination.page || 1) + 1,
          limit: profilesPagination.limit || 24,
          append: true,
        }),
      ).unwrap();
    } catch {
      /* ignore */
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <ProtectedRoute>
      <UserLayout>
        <div className={styles.container}>
          <h2 className={styles.sectionHeader}>My Connections</h2>
          {connectionsLoading ? (
            <p>Loading connections...</p>
          ) : (
            <div className={`${styles.grid} ${styles.connectionsSection}`}>
              {connections?.length > 0 ? (
                connections.map((connection) => {
                  const isSender =
                    connection.senderId?._id === currentUser?.userId?._id;
                  const friend = isSender
                    ? connection.receiverId
                    : connection.senderId;

                  if (!friend) return null;

                  return (
                    <div key={connection._id} className={styles.connectionCard}>
                      <img
                        src={
                          friend.profilePicture ||
                          "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                        }
                        alt=""
                        className={styles.connectionAvatar}
                      />
                      <div>
                        <p className={styles.connectionName}>{friend.name}</p>
                        <p className={styles.connectionUsername}>
                          @{friend.username}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p>You don&apos;t have any connections yet.</p>
              )}
            </div>
          )}

          <hr className={styles.divider} />

          {/* Connection Requests */}
          <h2 className={styles.sectionHeader}>
            Connection Requests
            {pendingReceived.length > 0 && (
              <span className={styles.requestBadge}>{pendingReceived.length}</span>
            )}
          </h2>

          {connectionsLoading ? (
            <p>Loading requests...</p>
          ) : pendingReceived.length > 0 ? (
            <div className={`${styles.grid} ${styles.connectionsSection}`}>
              {pendingReceived.map((req) => {
                const sender = req.senderId;
                if (!sender) return null;
                return (
                  <div key={req._id} className={styles.requestCard}>
                    <img
                      src={
                        sender.profilePicture ||
                        "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                      }
                      alt=""
                      className={styles.connectionAvatar}
                    />
                    <div className={styles.requestInfo}>
                      <p className={styles.connectionName}>{sender.name}</p>
                      <p className={styles.connectionUsername}>@{sender.username}</p>
                    </div>
                    <div className={styles.requestActions}>
                      <button
                        type="button"
                        className={styles.acceptBtn}
                        onClick={() => dispatch(acceptConnections(req._id))}
                      >
                        Accept
                      </button>
                      <button
                        type="button"
                        className={styles.ignoreBtn}
                        onClick={() => dispatch(rejectConnections(req._id))}
                      >
                        Ignore
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p>No pending requests.</p>
          )}

          <hr className={styles.divider} />

          <h2 className={styles.sectionHeader}>People you may know</h2>
          {profilesLoading && <p>Loading network...</p>}

          <div className={styles.grid}>
            {allProfiles?.length > 0
              ? allProfiles.map((user) => (
                  <UserCard key={user._id || user.username} user={user} />
                ))
              : !profilesLoading && <p>No new users to discover.</p>}
          </div>

          {!profilesLoading && profilesPagination.hasMore && (
            <div className={styles.loadMoreWrap}>
              <button
                type="button"
                className={styles.loadMoreBtn}
                onClick={loadMorePeople}
                disabled={loadingMore}
              >
                {loadingMore ? "Loading…" : "Load more people"}
              </button>
            </div>
          )}
        </div>
      </UserLayout>
    </ProtectedRoute>
  );
}
