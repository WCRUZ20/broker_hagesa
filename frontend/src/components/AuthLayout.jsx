import React from "react";

export default function AuthLayout({ children }) {
  return (
    <div
      style={{
        backgroundImage: "url('/LoginForm/FLogin.jpg')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Montserrat', sans-serif",
        position: "relative",
      }}
    >
      <img
        src="/LoginForm/logo.png"
        alt="Logo"
        style={{
          position: "absolute",
          top: "12%",
          left: "10%",
          width: "150px",
          zIndex: 2,
        }}
      />
      <h2
        className="fw-bold mb-1"
        style={{
          position: "absolute",
          top: "19%",
          left: "20%",
          fontSize: "2.8rem",
          color: "white",
          zIndex: 2,
        }}
      >
        AGESA
      </h2>
      <p
        className="mb-0"
        style={{
          position: "absolute",
          top: "26.5%",
          left: "20%",
          fontSize: "0.9rem",
          letterSpacing: "1px",
          color: "white",
          zIndex: 2,
        }}
      >
        ASESORA DE PRODUCTOS DE SEGURO
      </p>
      <img
        src="/LoginForm/auto3.png"
        alt="Auto"
        style={{
          position: "absolute",
          bottom: "5%",
          left: "5%",
          width: "700px",
          zIndex: 2,
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 0,
          right: 80,
          left: "7%",
          width: "550px",
          height: "100%",
          backgroundColor: "#000000",
          borderRadius: 4,
          background: "linear-gradient(to bottom, black, transparent)",
          zIndex: 1,
        }}
      ></div>

      <div
        style={{
          position: "absolute",
          top: 30,
          right: 80,
          width: 45,
          height: 4,
          backgroundColor: "#B27936",
          borderRadius: 4,
          zIndex: 2,
        }}
      ></div>

      <div
        style={{
          position: "absolute",
          bottom: 0,
          right: 40,
          display: "grid",
          gridTemplateColumns: "repeat(32, 6px)",
          gridTemplateRows: "repeat(4, 6px)",
          gap: "6px",
          zIndex: 2,
        }}
      >
        {[...Array(128)].map((_, i) => (
          <div
            key={i}
            style={{
              width: "6px",
              height: "6px",
              backgroundColor: "#B27936",
              borderRadius: "50%",
            }}
          ></div>
        ))}
      </div>

      <div
        style={{
          position: "absolute",
          top: 40,
          right: 80,
          width: 45,
          height: 4,
          backgroundColor: "#B27936",
          borderRadius: 4,
          zIndex: 2,
        }}
      ></div>
      <div
        style={{
          position: "absolute",
          bottom: 50,
          left: 100,
          width: 60,
          height: 4,
          backgroundColor: "#B27936",
          borderRadius: 4,
          zIndex: 2,
        }}
      ></div>

      <div
        style={{
          position: "absolute",
          bottom: 40,
          left: 100,
          width: 60,
          height: 4,
          backgroundColor: "#B27936",
          borderRadius: 4,
          zIndex: 2,
        }}
      ></div>

      <div className="row w-100 m-0 align-items-center" style={{ maxWidth: 1250, position: 'relative', zIndex: 3 }}>
        <div className="col-md-6 d-flex flex-column justify-content-center align-items-center text-white"></div>
        <div className="col-md-6 d-flex justify-content-center">
          {children}
        </div>
      </div>
      <style jsx>{`
        .btn:hover .shine-effect {
          left: 100% !important;
        }
      `}</style>
    </div>
  );
}