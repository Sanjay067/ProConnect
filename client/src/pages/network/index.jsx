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
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
          <h2 className="mb-4 text-2xl font-semibold">My Connections</h2>
          {connectionsLoading ? (
            <p>Loading connections...</p>
          ) : (
            <div className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-2">
              {connections?.length > 0 ? (
                connections.map((connection) => {
                  const isSender =
                    connection.senderId?._id === currentUser?.userId?._id;
                  const friend = isSender
                    ? connection.receiverId
                    : connection.senderId;

                  if (!friend) return null;

                  return (
                    <div key={connection._id} className="flex w-full items-center gap-2.5 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                      <img
                        src={
                          friend.profilePicture ||
                          "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                        }
                        alt=""
                        className="h-12 w-12 rounded-full object-cover"
                      />
                      <div>
                        <p className="m-0 font-bold">{friend.name}</p>
                        <p className="m-0 text-sm text-gray-500">
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

          <hr className="mb-10 border border-gray-100" />

          {/* Connection Requests */}
          <h2 className="mb-4 text-2xl font-semibold">
            Connection Requests
            {pendingReceived.length > 0 && (
              <span className="ml-2 inline-flex h-[22px] min-w-[22px] items-center justify-center rounded-xl bg-[#0a66c2] px-1.5 text-xs font-bold text-white align-middle">{pendingReceived.length}</span>
            )}
          </h2>

          {connectionsLoading ? (
            <p>Loading requests...</p>
          ) : pendingReceived.length > 0 ? (
            <div className="mb-10 grid grid-cols-1 gap-4 lg:grid-cols-2">
              {pendingReceived.map((req) => {
                const sender = req.senderId;
                if (!sender) return null;
                return (
                  <div key={req._id} className="flex w-full max-w-full flex-wrap items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:flex-nowrap">
                    <img
                      src={
                        sender.profilePicture ||
                        "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                      }
                      alt=""
                      className="h-12 w-12 rounded-full object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="m-0 font-bold">{sender.name}</p>
                      <p className="m-0 text-sm text-gray-500">@{sender.username}</p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <button
                        type="button"
                        className="cursor-pointer rounded-full border-none bg-[#0a66c2] px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-[#084d93]"
                        onClick={() => dispatch(acceptConnections(req._id))}
                      >
                        Accept
                      </button>
                      <button
                        type="button"
                        className="cursor-pointer rounded-full border border-gray-400 bg-transparent px-4 py-1.5 text-sm font-semibold text-gray-600 transition hover:border-gray-700 hover:text-gray-700"
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

          <hr className="mb-10 border border-gray-100" />

          <h2 className="mb-4 text-2xl font-semibold">People you may know</h2>
          {profilesLoading && <p>Loading network...</p>}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {allProfiles?.length > 0
              ? allProfiles.map((user) => (
                  <UserCard key={user._id || user.username} user={user} />
                ))
              : !profilesLoading && <p>No new users to discover.</p>}
          </div>

          {!profilesLoading && profilesPagination.hasMore && (
            <div className="flex justify-center px-0 pt-6 pb-10">
              <button
                type="button"
                className="cursor-pointer rounded-full border border-[#0a66c2] bg-white px-7 py-2.5 font-semibold text-[#0a66c2] transition hover:bg-[#eef3f8] disabled:cursor-not-allowed disabled:opacity-60"
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
