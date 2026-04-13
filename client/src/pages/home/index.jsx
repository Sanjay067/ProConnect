import { useEffect } from "react";
import ProtectedRoute from "@/components/Protected";
import UserLayout from "@/layout/UserLayout";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfile } from "@/config/redux/action/profileAction";
import Feed from "@/features/posts/Feed/Feed";

export default function Home() {
  const dispatch = useDispatch();
  const profileFetched = useSelector((state) => state.profile.profileFetched);

  useEffect(() => {
    if (!profileFetched) dispatch(getUserProfile());
  }, [dispatch, profileFetched]);

  return (
    <ProtectedRoute>
      <UserLayout>
        <Feed />
      </UserLayout>
    </ProtectedRoute>
  );
}
