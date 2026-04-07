import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createPost } from "@/config/redux/action/postAction";

export default function PostBox() {
  const dispatch = useDispatch();
  const { createPostLoading } = useSelector((state) => state.post);
  const myAvatar = useSelector(
    (state) =>
      state.profile.profile?.userId?.profilePicture ||
      "https://cdn-icons-png.flaticon.com/512/149/149071.png",
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalView, setModalView] = useState("text"); // "text" | "media"
  const [postBody, setPostBody] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileRef = useRef(null);

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!postBody.trim() && !selectedFile) return;

    const formData = new FormData();
    formData.append("body", postBody);
    if (selectedFile) {
      formData.append("media", selectedFile);
    }

    dispatch(createPost(formData));

    // Reset & Close Modal
    setPostBody("");
    removeMedia();
    setIsModalOpen(false);
  };

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
        setModalView("text"); // auto switch back to text view to see preview and type
      };
      reader.readAsDataURL(file);
    }
  };

  const removeMedia = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const openTextModal = () => {
    setModalView("text");
    setIsModalOpen(true);
  };

  const openMediaModal = () => {
    setModalView("media");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    if (!postBody.trim() && !selectedFile) {
      removeMedia();
    }
  };

  return (
    <div className="mb-8 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      {/* --- Trigger Area --- */}
      <div className="mb-2.5 flex items-center gap-2.5">
        <img src={myAvatar} alt="My Avatar" className="h-12 w-12 rounded-full object-cover" />
        <button className="flex-1 cursor-pointer rounded-full border border-gray-300 bg-white px-5 py-3 text-left text-base text-gray-500 transition hover:bg-neutral-200" onClick={openTextModal}>
          Start a post...
        </button>
      </div>
      <div className="mt-1 flex justify-around">
        <button className="flex cursor-pointer items-center gap-2 rounded-md border-none bg-transparent px-3 py-2 text-sm font-bold text-gray-500 transition hover:bg-neutral-200" onClick={openMediaModal}>
          <i className="fa-solid fa-image text-[#378fe9]"></i>{" "}
          Photo
        </button>
        <button className="flex cursor-pointer items-center gap-2 rounded-md border-none bg-transparent px-3 py-2 text-sm font-bold text-gray-500 transition hover:bg-neutral-200" onClick={openMediaModal}>
          <i className="fa-solid fa-video text-[#5f9b41]"></i>{" "}
          Video
        </button>
      </div>

      {/* --- Modal Overlay --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 px-3">
          <div className="flex w-full max-w-[552px] flex-col overflow-hidden rounded-xl bg-white shadow-xl">
            {modalView === "text" ? (
              <>
                <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={myAvatar}
                      alt="Avatar"
                      className="h-12 w-12 rounded-full object-cover"
                    />
                    <span className="text-lg font-bold text-gray-500">
                      Create a post
                    </span>
                  </div>
                  <button className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-none bg-transparent text-xl text-gray-500 transition hover:bg-neutral-200" onClick={closeModal}>
                    <i className="fa-solid fa-times"></i>
                  </button>
                </div>

                <form onSubmit={handlePostSubmit}>
                  <textarea
                    placeholder="What do you want to talk about?"
                    value={postBody}
                    onChange={(e) => setPostBody(e.target.value)}
                    className="min-h-[150px] w-full resize-none border-none p-5 text-[1.05rem] outline-none"
                    autoFocus
                  />

                  {/* --- Media Preview Area --- */}
                  {previewUrl && (
                    <div className="relative mx-auto mb-5 w-[calc(100%-40px)] overflow-hidden rounded-lg border border-gray-300">
                      {selectedFile?.type.startsWith("video/") ? (
                        <video
                          src={previewUrl}
                          controls
                          className="block max-h-[350px] w-full object-cover"
                        />
                      ) : (
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="block max-h-[350px] w-full object-cover"
                        />
                      )}
                      <button
                        type="button"
                        onClick={removeMedia}
                        className="absolute top-2.5 right-2.5 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-none bg-black/60 text-white transition hover:bg-black/80"
                      >
                        <i className="fa-solid fa-times"></i>
                      </button>
                    </div>
                  )}

                  <div className="flex items-center justify-between border-t border-gray-200 px-5 py-4">
                    <div className="flex gap-4">
                      <button
                        type="button"
                        className="flex cursor-pointer items-center gap-2 rounded-md border-none bg-transparent px-3 py-2 text-sm font-bold text-gray-500 transition hover:bg-neutral-200"
                        onClick={() => setModalView("media")}
                      >
                        <i className="fa-solid fa-image text-xl text-[#378fe9]"></i>
                      </button>
                      <button
                        type="button"
                        className="flex cursor-pointer items-center gap-2 rounded-md border-none bg-transparent px-3 py-2 text-sm font-bold text-gray-500 transition hover:bg-neutral-200"
                        onClick={() => setModalView("media")}
                      >
                        <i className="fa-solid fa-video text-xl text-[#5f9b41]"></i>
                      </button>
                    </div>

                    <button
                      type="submit"
                      className="cursor-pointer rounded-full border-none bg-[#0a66c2] px-5 py-2 font-bold text-white disabled:cursor-not-allowed disabled:bg-[#0a66c266]"
                      disabled={
                        createPostLoading ||
                        (!postBody.trim() && !selectedFile)
                      }
                    >
                      {createPostLoading ? "Posting..." : "Post"}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <>
                {/* --- File Selection View --- */}
                <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
                  <div className="flex items-center gap-4">
                    <button
                      className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-none bg-transparent text-xl text-gray-500 transition hover:bg-neutral-200"
                      onClick={() => setModalView("text")}
                    >
                      <i className="fa-solid fa-arrow-left"></i>
                    </button>
                    <span className="text-lg font-bold text-gray-500">
                      Select files
                    </span>
                  </div>
                  <button className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-none bg-transparent text-xl text-gray-500 transition hover:bg-neutral-200" onClick={closeModal}>
                    <i className="fa-solid fa-times"></i>
                  </button>
                </div>

                <div className="flex flex-col items-center justify-center bg-white px-5 py-14 text-center">
                  <i className="fa-solid fa-cloud-arrow-up mb-4 text-6xl text-[#0a66c2]"></i>
                  <h2 className="mb-2.5 text-2xl text-gray-700">
                    Select files to begin
                  </h2>
                  <p className="mb-5 text-base text-gray-500">
                    Share images or a single video in your post.
                  </p>

                  <input
                    type="file"
                    ref={fileRef}
                    className="hidden"
                    onChange={handleChange}
                    accept="image/*,video/*"
                  />
                  <button
                    className="cursor-pointer rounded-full border-none bg-[#0a66c2] px-6 py-3 text-base font-bold text-white transition hover:bg-[#004182]"
                    onClick={() => fileRef.current?.click()}
                  >
                    Upload from computer
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
