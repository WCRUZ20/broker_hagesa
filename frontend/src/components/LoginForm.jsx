import { useState } from "react";
import axios from "axios";

export default function LoginForm({ onLogin }) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8000/users/login", {
        identifier,
        password,
      });
      localStorage.setItem("token", res.data.access_token);
      onLogin();
    } catch (err) {
      setError("Credenciales inválidas");
    }
  };

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
      {/* logo decorativo */}
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
      <h2 className="fw-bold mb-1" style={{ position: "absolute", top: "19%", left: "20%", fontSize: "2.8rem", color: "white", zIndex: 2,}}>
        AGESA
      </h2>
      <p className="mb-0" style={{ position: "absolute", top: "26.5%", left: "20%", fontSize: "0.9rem", letterSpacing: "1px", color: "white", zIndex: 2,}}>
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

      {/* Líneas decorativas */}
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

      {/* Cuadrado decorativo de puntos */}
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

      {/* Contenedor principal */}
      <div className="row w-100 m-0 align-items-center" style={{ maxWidth: 1250, position: "relative", zIndex: 3 }}>
        {/* Columna izquierda: Logo y texto */}
        <div className="col-md-6 d-flex flex-column justify-content-center align-items-center text-white">
        </div>

        {/* Columna derecha: Login Mejorado */}
        <div className="col-md-6 d-flex justify-content-center">
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
            {/* Elemento decorativo superior */}
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
            
            {/* Título con mejor tipografía */}
            <div className="text-center mb-4">
              <h3 
                className="fw-bold mb-2" 
                style={{ 
                  color: "#1a1a1a", 
                  fontSize: "1.8rem",
                  letterSpacing: "1px",
                  textShadow: "0 2px 4px rgba(0,0,0,0.1)"
                }}
              >
                BIENVENIDO
              </h3>
              <p 
                style={{ 
                  color: "#666", 
                  fontSize: "0.9rem", 
                  margin: 0,
                  fontWeight: "500"
                }}
              >
                Inicia sesión en tu cuenta
              </p>
            </div>

            {error && (
              <div 
                className="alert text-center mb-4" 
                style={{
                  backgroundColor: "rgba(220, 53, 69, 0.1)",
                  border: "1px solid rgba(220, 53, 69, 0.2)",
                  borderRadius: "12px",
                  color: "#dc3545",
                  fontSize: "0.9rem",
                  fontWeight: "500"
                }}
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label 
                  htmlFor="identifier" 
                  className="form-label fw-semibold" 
                  style={{
                    fontSize: "0.85rem",
                    color: "#2c2c2c",
                    marginBottom: "8px",
                    letterSpacing: "0.5px"
                  }}
                >
                  USUARIO O EMAIL
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="identifier"
                  value={identifier}
                  onChange={e => setIdentifier(e.target.value)}
                  style={{
                    border: "2px solid rgba(178, 121, 54, 0.2)",
                    borderRadius: "12px",
                    padding: "12px 16px",
                    fontSize: "1rem",
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    transition: "all 0.3s ease",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#B27936";
                    e.target.style.backgroundColor = "rgba(255, 255, 255, 1)";
                    e.target.style.boxShadow = "0 0 0 3px rgba(178, 121, 54, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(178, 121, 54, 0.2)";
                    e.target.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
                    e.target.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.05)";
                  }}
                  required
                />
              </div>

              <div className="mb-4">
                <label 
                  htmlFor="password" 
                  className="form-label fw-semibold" 
                  style={{ 
                    fontSize: "0.85rem",
                    color: "#2c2c2c",
                    marginBottom: "8px",
                    letterSpacing: "0.5px"
                  }}
                >
                  CONTRASEÑA
                </label>
                <div className="input-group" style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    style={{
                      border: "2px solid rgba(178, 121, 54, 0.2)",
                      borderRadius: "12px",
                      padding: "12px 50px 12px 16px",
                      fontSize: "1rem",
                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                      transition: "all 0.3s ease",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#B27936";
                      e.target.style.backgroundColor = "rgba(255, 255, 255, 1)";
                      e.target.style.boxShadow = "0 0 0 3px rgba(178, 121, 54, 0.1)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "rgba(178, 121, 54, 0.2)";
                      e.target.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
                      e.target.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.05)";
                    }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      color: "#B27936",
                      fontSize: "1.1rem",
                      cursor: "pointer",
                      zIndex: 10,
                      padding: "4px",
                      borderRadius: "4px",
                      transition: "all 0.2s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = "rgba(178, 121, 54, 0.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = "transparent";
                    }}
                  >
                    <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn fw-bold text-white w-100"
                style={{
                  background: "linear-gradient(135deg, #B27936 0%, #D4A574 50%, #B27936 100%)",
                  fontSize: "1.1rem",
                  padding: "14px",
                  borderRadius: "12px",
                  border: "none",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  boxShadow: "0 8px 20px rgba(178, 121, 54, 0.3)",
                  transition: "all 0.3s ease",
                  position: "relative",
                  overflow: "hidden",
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 12px 30px rgba(178, 121, 54, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "0 8px 20px rgba(178, 121, 54, 0.3)";
                }}
              >
                <span style={{ position: "relative", zIndex: 2 }}>INGRESAR</span>
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: "-100%",
                    width: "100%",
                    height: "100%",
                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                    transition: "left 0.5s ease",
                  }}
                  className="shine-effect"
                ></div>
              </button>
            </form>

            {/* Elemento decorativo inferior */}
            <div 
              className="text-center mt-4"
              style={{
                paddingTop: "1rem",
                borderTop: "1px solid rgba(178, 121, 54, 0.1)"
              }}
            >
              <small style={{ color: "#888", fontSize: "0.8rem" }}>
                © 2025 HAGESA SA - Todos los derechos reservados
              </small>
            </div>
          </div>
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