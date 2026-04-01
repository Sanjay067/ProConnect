import Navbar from "@/Components/Navbar";
import React from "react";

export default function UserLayout({ children }) {
  return (
    <div style={{ backgroundColor: "#dedfd6ff", minHeight: "100vh" }}>
      <Navbar style={{}} />
      {children}
    </div>
  );
}
