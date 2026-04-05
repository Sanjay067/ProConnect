import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfile } from "@/config/redux/action/profileAction";
import { getPosts } from "@/config/redux/action/postAction";
import UserLayout from "@/layout/UserLayout";
import ProtectedRoute from "@/components/Protected";
import styles from "./styles.module.css";
import PopupDialog from "@/features/profile/popupDialog";
import Loader from "@/components/Loader";
import { getConnectionsOverview } from "@/config/redux/action/connectionAction";

// Import modular UI sections
import ProfileHeader from "@/features/profile/ProfileHeader";
import AboutSection from "@/features/profile/AboutSection";
import ExperienceSection from "@/features/profile/ExperienceSection";
import EducationSection from "@/features/profile/EducationSection";
import ActivitySection from "@/features/profile/ActivitySection";

// Import precise forms
import IntroForm from "@/features/profile/forms/IntroForm";
import AboutForm from "@/features/profile/forms/AboutForm";
import ExperienceForm from "@/features/profile/forms/ExperienceForm";
import EducationForm from "@/features/profile/forms/EducationForm";

export default function ProfilePage() {
  const dispatch = useDispatch();

  const { profile, isLoading } = useSelector((state) => state.profile);
  const { posts } = useSelector((state) => state.post);

  // Dynamic Modal State
  const [modalType, setModalType] = useState(null);
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    dispatch(getUserProfile());
    dispatch(getPosts()); // Ensure we pull posts down so we can filter them for Activity
    dispatch(getConnectionsOverview());
  }, [dispatch]);

  const handleOpenModal = (type, index = null) => {
    setModalType(type);
    setEditIndex(index);
  };

  const handleCloseModal = () => {
    setModalType(null);
    setEditIndex(null);
  };

  const user = profile?.userId;
  
  // Filter for ONLY this user's posts
  const userPosts = posts?.filter(p => p.author?._id === user?._id);

  const renderModalContent = () => {
    switch (modalType) {
      case "INTRO":
        return <IntroForm profile={profile} onClose={handleCloseModal} />;
      case "ABOUT":
        return <AboutForm profile={profile} onClose={handleCloseModal} />;
      case "EXPERIENCE":
        return <ExperienceForm profile={profile} onClose={handleCloseModal} editIndex={editIndex} />;
      case "EDUCATION":
        return <EducationForm profile={profile} onClose={handleCloseModal} editIndex={editIndex} />;
      default:
        return null;
    }
  };

  return (
    <ProtectedRoute>
      <UserLayout>
        <div className={styles.layout}>
          <div className={styles.container}>
            {isLoading && !profile && <Loader />}

            {profile && user && (
              <>
                <ProfileHeader profile={profile} user={user} onEdit={handleOpenModal} />
                
                <ActivitySection posts={userPosts} />

                <AboutSection profile={profile} onEdit={handleOpenModal} />
                
                <ExperienceSection profile={profile} onEdit={handleOpenModal} />
                
                <EducationSection profile={profile} onEdit={handleOpenModal} />

                {/* Dynamic Modal Manager */}
                {modalType && (
                  <PopupDialog onClose={handleCloseModal}>
                    {renderModalContent()}
                  </PopupDialog>
                )}
              </>
            )}
          </div>
        </div>
      </UserLayout>
    </ProtectedRoute>
  );
}
