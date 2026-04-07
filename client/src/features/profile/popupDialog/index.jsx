import React, { useEffect } from "react";

const PopupDialog = ({ children, onClose }) => {
  // ESC key close
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // Click outside close
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/50 px-4" onClick={handleOverlayClick}>
      <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl">
        <div className="flex items-center justify-between">
          <h1>Edit Profile</h1>

          <div className="cursor-pointer" onClick={onClose}>
            <i className="fa-solid fa-x"></i>
          </div>
        </div>

        <div>{children}</div>
      </div>
    </div>
  );
};

export default PopupDialog;
