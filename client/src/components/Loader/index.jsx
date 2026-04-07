import React from "react";

export default function Loader() {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "20px" }}>
      <div 
        style={{
          width: "40px",
          height: "40px",
          border: "4px solid #eef3f8",
          borderTop: "4px solid #0a66c2",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      />
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
