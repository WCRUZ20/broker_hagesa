import React from "react";

export default function AuthCard({ children }) {
  return (
    <div
      className="shadow-lg"
      style={{
        background: "linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%)",
        backdropFilter: "blur(20px)",
        borderRadius: "24px",
        maxWidth: 450,
        width: "100%",
        padding: "2.5rem 2rem",
        border: "1px solid rgba(255, 255, 255, 0.3)",
        boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.1)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "4px",
          background: "linear-gradient(90deg, #B27936 0%, #D4A574 50%, #B27936 100%)",
        }}
      ></div>
      {children}
    </div>
  );
}