import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import clientApi from "@/services/clientApi";
import UserLayout from "@/layout/UserLayout";
import ProtectedRoute from "@/components/Protected";
import Loader from "@/components/Loader";
import ProfileHeader from "@/features/profile/ProfileHeader";
import AboutSection from "@/features/profile/AboutSection";
import ExperienceSection from "@/features/profile/ExperienceSection";
import EducationSection from "@/features/profile/EducationSection";
import ConnectionButton from "@/components/ConnectionButton";
import { getUserProfile } from "@/config/redux/action/profileAction";
import { getConnectionsOverview } from "@/config/redux/action/connectionAction";

export default function PublicProfilePage() {
  const router = useRouter();
  const { userId } = router.query;
  const dispatch = useDispatch();
  const profile = useSelector((s) => s.profile.profile);
  const myId = profile?.userId?._id;

  const [data, setData] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(getUserProfile());
    dispatch(getConnectionsOverview());
  }, [dispatch]);

  useEffect(() => {
    if (!router.isReady || !userId || !myId) return;
    if (String(userId) === String(myId)) {
      router.replace("/profile");
    }
  }, [router, userId, myId]);

  useEffect(() => {
    if (!router.isReady || !userId) return;
    if (myId && String(userId) === String(myId)) return;

    let cancelled = false;
    clientApi
      .get(`/users/profile/${userId}`)
      .then(({ data: res }) => {
        if (cancelled) return;
        if (res.profile) {
          setData({ profile: res.profile, user: res.profile.userId });
        } else {
          setData({ profile: null, user: res.user });
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setLoadError(e.response?.data?.message || "Profile not found");
          setData(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [router.isReady, userId, myId]);

  const displayProfile = data?.profile;
  const displayUser = data?.user;

  return (
    <ProtectedRoute>
      <UserLayout>
        <div className="min-h-screen pb-10">
          <div className="mx-auto flex max-w-4xl flex-col gap-4 px-4 pt-6 sm:px-6 sm:pt-8">
            {loading && <Loader />}
            {loadError && !loading && (
              <p style={{ color: "var(--text-muted)" }}>{loadError}</p>
            )}
            {!loading && !loadError && displayUser && (
              <>
                <div className="mb-2 flex justify-end">
                  <ConnectionButton targetUserId={displayUser._id} />
                </div>
                <ProfileHeader
                  profile={displayProfile || { userId: displayUser }}
                  user={displayUser}
                  readOnly
                />
                <AboutSection profile={displayProfile || {}} readOnly />
                <ExperienceSection profile={displayProfile || {}} readOnly />
                <EducationSection profile={displayProfile || {}} readOnly />
              </>
            )}
          </div>
        </div>
      </UserLayout>
    </ProtectedRoute>
  );
}
