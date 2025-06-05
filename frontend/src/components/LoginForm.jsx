import { useState } from "react";
import axios from "axios";

export default function LoginForm({ onLogin }) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

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
        backgroundImage: "url('/LoginForm/fondoLogin.jpg')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Montserrat', sans-serif",
      }}
    >
      <div className="row w-100 m-0 align-items-center" style={{ maxWidth: 1100 }}>
        {/* Columna Izquierda: Logo y texto */}
        <div className="col-md-6 d-flex justify-content-center">
         
        </div>

        {/* Columna Derecha: Login */}
        <div className="col-md-6 d-flex justify-content-start ps-md-5">
          <div
            className="p-4 rounded shadow-lg w-100"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.5)",
              maxWidth: 500,
            }}
          >
            {error && <div className="alert alert-danger text-center">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="identifier" className="form-label">USUARIO O EMAIL</label>
                <input
                  type="text"
                  className="form-control"
                  id="identifier"
                  value={identifier}
                  onChange={e => setIdentifier(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="password" className="form-label">CONTRASEÑA</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="btn w-100 fw-bold text-white"
                style={{
                  backgroundColor: "#B27936",
                  fontSize: "1rem",
                  padding: "0.6rem",
                  borderRadius: "0.4rem",
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
