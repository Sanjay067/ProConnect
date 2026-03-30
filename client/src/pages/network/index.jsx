import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllProfiles,
  getUserProfile,
} from "@/config/redux/action/profileAction";
import { getMyConnections } from "@/config/redux/action/connectionAction.js";
import UserLayout from "@/Layout/UserLayout";
import ProtectedRoute from "@/Components/Protected";
import UserCard from "@/features/network/UserCard";
import styles from "./styles.module.css";

export default function NetworkPage() {
  const dispatch = useDispatch();

  const { allProfiles, isLoading: profilesLoading, profile: currentUser } =
    useSelector((state) => state.profile);
  const { connections, isLoading: connectionsLoading } = useSelector(
    (state) => state.connection,
  );

  useEffect(() => {
    dispatch(getUserProfile());
    dispatch(getAllProfiles());
    dispatch(getMyConnections());
  }, [dispatch]);

  return (
    <ProtectedRoute>
      <UserLayout>
        <div className={styles.container}>
          {/* ----- MY CONNECTIONS SECTION ----- */}
          <h2 className={styles.sectionHeader}>My Connections</h2>
          {connectionsLoading && <p>Loading connections...</p>}
          
          <div className={`${styles.grid} ${styles.connectionsSection}`}>
            {connections?.length > 0 ? (
              connections.map((connection) => {
                // If the user sent the request, the friend is the receiver. Otherwise, the friend is the sender.
                const isSender =
                  connection.senderId?._id === currentUser?.userId?._id;
                const friend = isSender
                  ? connection.receiverId
                  : connection.senderId;

                // If friend is missing due to weird db states, skip it
                if (!friend) return null;

                return (
                  <div key={connection._id} className={styles.connectionCard}>
                    <img
                      src={friend.profilePicture}
                      alt=""
                      className={styles.connectionAvatar}
                    />
                    <div>
                      <p className={styles.connectionName}>{friend.name}</p>
                      <p className={styles.connectionUsername}>@{friend.username}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p>You don't have any connections yet.</p>
            )}
          </div>

          <hr className={styles.divider} />

          {/* ----- DISCOVER SECTION ----- */}
          <h2 className={styles.sectionHeader}>People you may know</h2>
          {profilesLoading && <p>Loading network...</p>}
          
          <div className={styles.grid}>
            {allProfiles?.length > 0
              ? allProfiles.map((user) => (
                  <UserCard key={user._id || user.username} user={user} />
                ))
              : !profilesLoading && <p>No new users to discover.</p>}
          </div>
        </div>
      </UserLayout>
    </ProtectedRoute>
  );
}
