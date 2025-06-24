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
          {/* <div className="d-flex align-items-center mb-3">
            <img
              src="/LoginForm/logo.png"
              alt="Logo"
              style={{ width: 120, marginRight: 20 }}
            />
            <div>
              <h2 className="fw-bold mb-1" style={{ fontSize: "2rem", color: "white" }}>
                AGESA
              </h2>
              <p className="mb-0" style={{ fontSize: "0.9rem", letterSpacing: "1px", color: "white" }}>
                ASESORA DE PRODUCTOS DE SEGURO
              </p>
            </div>
          </div> */}
        </div>

        {/* Columna derecha: Login */}
        <div className="col-md-6 d-flex justify-content-center">
          <div
            className="p-4 shadow"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.4)",
              backdropFilter: "blur(6px)",
              borderRadius: "1rem",
              maxWidth: 430,
              width: "100%",
            }}
          >
            <h3 className="text-center mb-4 fw-bold" style={{ color: "#2c2c2c", fontSize:"1.2rem"}}>INICIO SESIÓN</h3>
            {error && <div className="alert alert-danger text-center">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="identifier" className="form-label" style={{fontSize:"0.8rem"}}>USUARIO O EMAIL</label>
                <input
                  type="text"
                  className="form-control"
                  id="identifier"
                  value={identifier}
                  onChange={e => setIdentifier(e.target.value)}
                />
              </div>

              <div className="mb-4">
              <label htmlFor="password" className="form-label" style={{ fontSize: "0.8rem" }}>
                  CONTRASEÑA
                </label>
                <div className="input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="btn btn-outline-dark"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn fw-bold text-white"
                style={{
                  backgroundColor: "#B27936",
                  fontSize: "1rem",
                  padding: "0.6rem",
                  borderRadius: "0.4rem",
                  width: "50%",
                  margin: "0 auto",
                  display: "block",
                }}
              >
                INGRESAR
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
