import React, { useRef } from "react";
import { useDispatch } from "react-redux";
import {
  updateProfilePicture,
  updateBannerPicture,
} from "@/config/redux/action/profileAction";

export default function ProfileHeader({ profile, user, onEdit, readOnly }) {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const bannerInputRef = useRef(null);

  if (readOnly) {
    const p = profile || {};
    return (
      <div className="relative overflow-hidden rounded-xl border border-[#dce6f1] bg-white p-0">
        <div
          className="min-h-[140px] w-full bg-[#a0b4b7]"
          style={{
            backgroundImage: p?.bannerPicture
              ? `url(${p.bannerPicture})`
              : "none",
            backgroundSize: "cover",
            backgroundPosition: "center",
            minHeight: "140px",
          }}
        />
        <div className="relative px-6 pb-6">
          <div className="-mt-[110px] mb-4 inline-block cursor-default">
            <img
              src={
                user?.profilePicture ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              alt=""
              className="h-[152px] w-[152px] rounded-full border-4 border-white object-cover"
            />
          </div>
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
            <div className="flex-1">
              <h1 className="mb-1 text-[1.6rem]">{user?.name}</h1>
              <p className="mb-2 text-[1.1rem] text-black">
                {p.headline || p.currentPosition || ""}
              </p>
            </div>
            {p.education?.length > 0 && (
              <div className="mt-2 flex max-w-[250px] items-center gap-2.5 text-sm font-bold">
                <i
                  className="fa-solid fa-building"
                  style={{ width: "10px" }}
                ></i>
                <span>{p.education[0].school}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("avatar", file);
      await dispatch(updateProfilePicture(formData));
    }
  };

  const handleBannerChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("banner", file);
      await dispatch(updateBannerPicture(formData));
    }
  };

  return (
    <div className="relative overflow-hidden rounded-xl border border-[#dce6f1] bg-white p-0">
      {/* Banner */}
      <div
        className="relative h-[200px] w-full cursor-pointer bg-[#a0b4b7]"
        style={{
          backgroundImage: profile?.bannerPicture
            ? `url(${profile.bannerPicture})`
            : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        onClick={() => bannerInputRef.current?.click()}
      >
        <div className="absolute top-4 right-5 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow">
          <i className="fa-solid fa-camera text-base text-[#0a66c2]"></i>
        </div>
        <input
          type="file"
          accept="image/*"
          ref={bannerInputRef}
          className="hidden"
          onChange={handleBannerChange}
        />
      </div>

      {/* Main Content */}
      <div
        className="relative px-6 pb-6"
        style={{ background: "var(--surface)" }}
      >
        <div
          className="-mt-[110px] mb-4 inline-block cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <img
            src={
              user.profilePicture ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            alt="Avatar"
            className="h-[152px] w-[152px] rounded-full border-4 border-white object-cover"
          />
          <div className="absolute right-2.5 bottom-5 flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-500 shadow">
            <i className="fa-solid fa-camera"></i>
          </div>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleImageChange}
          />
        </div>

        <button
          onClick={() => onEdit("INTRO")}
          className="absolute top-6 right-6 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-none bg-transparent text-lg text-gray-500 transition hover:bg-stone-100"
        >
          <i className="fa-solid fa-pencil"></i>
        </button>

        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <div className="flex-1">
            <h1
              className="mb-1 text-[1.6rem] "
              style={{ color: "var(--text)" }}
            >
              {user.name}
            </h1>
            <p className="mb-2 text-[1.1rem] " style={{ color: "var(--text)" }}>
              {profile.headline ||
                profile.currentPosition ||
                "Update your headline"}
            </p>
          </div>

          <div className="mt-2 flex max-w-[250px] items-center gap-2.5 text-sm font-bold">
            {profile.education?.length > 0 && (
              <>
                <i
                  className="fa-solid fa-building"
                  style={{ width: "10px", color: "var(--text)" }}
                ></i>
                <span style={{ color: "var(--text)" }}>
                  {profile.education[0].school}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
