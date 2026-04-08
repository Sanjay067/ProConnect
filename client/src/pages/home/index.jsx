import { useEffect } from "react";
import ProtectedRoute from "@/components/Protected";
import UserLayout from "@/layout/UserLayout";
import { useDispatch } from "react-redux";
import { getUserProfile } from "@/config/redux/action/profileAction";
import Feed from "@/features/posts/Feed/Feed";

export default function Home() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserProfile());
  }, [dispatch]);

  return (
    <ProtectedRoute>
      <UserLayout>
        <Feed />
      </UserLayout>
    </ProtectedRoute>
  );
}
