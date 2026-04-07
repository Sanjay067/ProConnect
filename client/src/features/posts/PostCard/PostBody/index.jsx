import React, { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { editPost } from "@/config/redux/action/postAction";

export default function PostBody({ post, isEditingPost, onCancelEdit }) {
  const dispatch = useDispatch();
  const MAX_POST_LENGTH = 150;
  const mediaTrackRef = useRef(null);

  const [isBodyExpanded, setIsBodyExpanded] = useState(false);
  const [editedPostBody, setEditedPostBody] = useState(post?.body || "");
  const [editedMedia, setEditedMedia] = useState(post?.media || []);
  const [newMediaFiles, setNewMediaFiles] = useState([]);
  const [newMediaPreviews, setNewMediaPreviews] = useState([]);
  
  const editFileRef = useRef(null);

  // reset form when edit mode opens
  React.useEffect(() => {
    if (isEditingPost) {
      setEditedPostBody(post?.body || "");
      setEditedMedia(post?.media || []);
      setNewMediaFiles([]);
      setNewMediaPreviews([]);
    }
  }, [isEditingPost, post]);

  const handleSaveEditPost = async () => {
    const nextBody = editedPostBody.trim();
    if (!nextBody && editedMedia.length === 0 && newMediaFiles.length === 0) return;
    
    const formData = new FormData();
    formData.append("body", nextBody);
    formData.append("existingMedia", JSON.stringify(editedMedia));
    
    newMediaFiles.forEach((file) => formData.append("media", file));

    await dispatch(editPost({ postId: post._id, postData: formData }));
    onCancelEdit(); // Triggers global container to shut off edit mode
  };

  const removeExistingMedia = (publicId) => {
    setEditedMedia((prev) => prev.filter((m) => m.publicId !== publicId));
  };

  const removeNewMedia = (index) => {
    setNewMediaFiles((prev) => prev.filter((_, i) => i !== index));
    setNewMediaPreviews((prev) => prev.filter((_, i) => i !== index));
    if (editFileRef.current) editFileRef.current.value = "";
  };

  const handleNewMediaChoice = (e) => {
    const files = Array.from(e.target.files);
    setNewMediaFiles((prev) => [...prev, ...files]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewMediaPreviews((prev) => [
          ...prev,
          { url: reader.result, type: file.type.startsWith("video/") ? "video" : "image" }
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  if (isEditingPost) {
    return (
      <div className="flex flex-col gap-2">
        <textarea
          value={editedPostBody}
          onChange={(e) => setEditedPostBody(e.target.value)}
          rows={3}
          className="w-full resize-y rounded-lg border border-gray-300 p-2.5 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        />
        
        {/* Internal Post Editor Media Area */}
        {(editedMedia.length > 0 || newMediaPreviews.length > 0) && (
          <div className="my-2.5 flex flex-wrap gap-2.5">
            {editedMedia.map((m) => (
              <div key={m.publicId} className="relative h-24 w-24 sm:h-28 sm:w-28">
                {m.type === "video" ? (
                  <video src={m.url} className="h-full w-full rounded object-cover bg-black" />
                ) : (
                  <img src={m.url} alt="" className="h-full w-full rounded object-cover" />
                )}
                <button type="button" onClick={() => removeExistingMedia(m.publicId)} className="absolute top-1 right-1 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border-none bg-black/60 text-white">
                  <i className="fa-solid fa-times text-xs"></i>
                </button>
              </div>
            ))}
            {newMediaPreviews.map((m, i) => (
              <div key={i} className="relative h-24 w-24 sm:h-28 sm:w-28">
                {m.type === "video" ? (
                  <video src={m.url} className="h-full w-full rounded object-cover bg-black" />
                ) : (
                  <img src={m.url} alt="" className="h-full w-full rounded object-cover" />
                )}
                <button type="button" onClick={() => removeNewMedia(i)} className="absolute top-1 right-1 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border-none bg-black/60 text-white">
                  <i className="fa-solid fa-times text-xs"></i>
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-1 flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-4">
             <input type="file" ref={editFileRef} className="hidden" multiple accept="image/*,video/*" onChange={handleNewMediaChoice} />
             <button type="button" onClick={() => { if(editFileRef.current) { editFileRef.current.accept="image/*"; editFileRef.current.click(); } }} className="cursor-pointer border-none bg-transparent px-1 text-xl text-blue-500"><i className="fa-solid fa-image"></i></button>
             <button type="button" onClick={() => { if(editFileRef.current) { editFileRef.current.accept="video/*"; editFileRef.current.click(); } }} className="cursor-pointer border-none bg-transparent px-1 text-xl text-green-600"><i className="fa-solid fa-video"></i></button>
          </div>
          
          <div className="flex gap-2">
            <button className="cursor-pointer border-none bg-transparent font-bold text-gray-600" onClick={onCancelEdit} type="button">Cancel</button>
            <button className="cursor-pointer rounded-full border-none bg-[#0a66c2] px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-60" onClick={handleSaveEditPost} type="button" disabled={!editedPostBody.trim() && editedMedia.length === 0 && newMediaFiles.length === 0}>Save</button>
          </div>
        </div>
      </div>
    );
  }


  return (
    <>
      {post?.body && (
        <p className="mb-4 text-base sm:text-[1.05rem]">
          {isBodyExpanded || post.body.length <= MAX_POST_LENGTH
            ? post.body
            : `${post.body.slice(0, MAX_POST_LENGTH)}`}
          {post.body.length > MAX_POST_LENGTH && !isBodyExpanded && (
            <button
              onClick={() => setIsBodyExpanded(true)}
              className="ml-1 cursor-pointer border-none bg-transparent p-0 text-sm font-medium text-gray-500 hover:text-[#0a66c2] hover:underline"
            >
              ...see more
            </button>
          )}
        </p>
      )}
      
      {post?.media && post.media.length > 0 && (
        <>
          {post.media.length === 1 ? (
            <div className="mt-2.5 flex w-full flex-col gap-2.5 overflow-hidden rounded-lg bg-neutral-50">
              {post.media[0].type === "video" ? (
                <video
                  key={post.media[0].publicId}
                  src={post.media[0].url}
                  controls
                  className="block max-h-[500px] w-full object-contain"
                />
              ) : (
                <img
                  key={post.media[0].publicId}
                  src={post.media[0].url}
                  alt="Post media"
                  className="block max-h-[500px] w-full object-contain"
                />
              )}
            </div>
          ) : (
            <div className="relative mt-2.5 w-full">
              <button
                type="button"
                className="absolute top-1/2 left-2 z-[2] flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border-none bg-white/90 text-gray-700 shadow hover:bg-white hover:text-[#0a66c2]"
                aria-label="Previous media"
                onClick={() => {
                  const el = mediaTrackRef.current;
                  if (el) el.scrollBy({ left: -el.clientWidth, behavior: "smooth" });
                }}
              >
                <i className="fa-solid fa-chevron-left" />
              </button>
              <div ref={mediaTrackRef} className="flex snap-x snap-mandatory overflow-x-auto rounded-lg bg-neutral-50 scroll-smooth">
                {post.media.map((mediaItem) => (
                  <div key={mediaItem.publicId} className="min-w-full flex-[0_0_100%] snap-start">
                    {mediaItem.type === "video" ? (
                      <video
                        src={mediaItem.url}
                        controls
                        className="block max-h-[500px] w-full object-contain"
                      />
                    ) : (
                      <img
                        src={mediaItem.url}
                        alt="Post media"
                        className="block max-h-[500px] w-full object-contain"
                      />
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                className="absolute top-1/2 right-2 z-[2] flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border-none bg-white/90 text-gray-700 shadow hover:bg-white hover:text-[#0a66c2]"
                aria-label="Next media"
                onClick={() => {
                  const el = mediaTrackRef.current;
                  if (el) el.scrollBy({ left: el.clientWidth, behavior: "smooth" });
                }}
              >
                <i className="fa-solid fa-chevron-right" />
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
}
