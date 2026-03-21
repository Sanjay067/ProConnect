import { useEffect } from "react";
import ProtectedRoute from "@/Components/Protected";
import UserLayout from "@/Layout/UserLayout";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfile } from "@/config/redux/action/profileAction";
import Feed from "@/features/posts/feed";

export default function Dashboard() {
  const dispatch = useDispatch();
  const { profile, isLoading } = useSelector((state) => state.profile);

  useEffect(() => {
    dispatch(getUserProfile());
  }, []);

  return (
    <ProtectedRoute>
      <UserLayout>
        <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
          <h1>Dashboard</h1>

          {isLoading ? (
            <p>Loading Profile...</p>
          ) : profile ? (
            <div>
              <h2>Welcome, {profile.userId?.name}!</h2>
              <p>
                <strong>Email:</strong> {profile.userId?.email}
              </p>
              <p>
                <strong>Username:</strong> {profile.userId?.username}
              </p>
              <p>
                <strong>Bio:</strong> {profile.bio || "No bio yet"}
              </p>
            </div>
          ) : (
            <p>No profile found</p>
          )}
          <Feed />
        </div>
      </UserLayout>
    </ProtectedRoute>
  );
}
