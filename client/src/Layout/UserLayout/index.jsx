import Navbar from "@/Components/Navbar";
import React from "react";

export default function UserLayout({ children }) {
  return (
    <div style={{ backgroundColor: "#fafed1", height: "100vh" }}>
      <Navbar />
      {children}
    </div>
  );
}
