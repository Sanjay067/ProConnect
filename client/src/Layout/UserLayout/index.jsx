import Navbar from "@/components/Navbar";
import React from "react";

export default function UserLayout({ children }) {
  return (
    <div
      style={{
        backgroundColor: "#dedfd6ff",
        minHeight: "100vh",
        minWidth: "100vw",
      }}
    >
      <Navbar style={{}} />
      {children}
    </div>
  );
}
