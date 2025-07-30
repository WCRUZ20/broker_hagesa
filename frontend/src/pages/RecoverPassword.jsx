import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import AuthCard from "../components/AuthCard";

export default function RecoverPassword() {
  const [identifier, setIdentifier] = useState("");
  const [msg, setMsg] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/users/recover-password", { identifier });
      localStorage.setItem("resetIdentifier", identifier);
      setMsg({ text: "Se envió una contraseña temporal a su correo", type: "success" });
      setTimeout(() => navigate("/reset"), 2000);
    } catch (err) {
      setMsg({ text: "Usuario no encontrado", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <AuthCard>
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
            RECUPERAR CONTRASEÑA
          </h3>
          <p
            style={{
              color: "#666",
              fontSize: "0.9rem",
              margin: 0,
              fontWeight: "500"
            }}
          >
            Ingresa tu usuario o correo para recibir una clave temporal
          </p>
        </div>
        {msg.text && (
          <div
            className="alert text-center mb-4"
            style={{
              backgroundColor:
                msg.type === "success"
                  ? "rgba(25, 135, 84, 0.1)"
                  : "rgba(220, 53, 69, 0.1)",
              border:
                msg.type === "success"
                  ? "1px solid rgba(25, 135, 84, 0.2)"
                  : "1px solid rgba(220, 53, 69, 0.2)",
              borderRadius: "12px",
              color: msg.type === "success" ? "#198754" : "#dc3545",
              fontSize: "0.9rem",
              fontWeight: "500"
            }}
          >
            {msg.text}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
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
              className="form-control"
              value={identifier}
              onChange={e => setIdentifier(e.target.value)}
              style={{
                border: "2px solid rgba(178, 121, 54, 0.2)",
                borderRadius: "12px",
                padding: "12px 16px",
                fontSize: "1rem",
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                transition: "all 0.3s ease",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)"
              }}
              onFocus={e => {
                e.target.style.borderColor = "#B27936";
                e.target.style.backgroundColor = "rgba(255, 255, 255, 1)";
                e.target.style.boxShadow = "0 0 0 3px rgba(178, 121, 54, 0.1)";
              }}
              onBlur={e => {
                e.target.style.borderColor = "rgba(178, 121, 54, 0.2)";
                e.target.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
                e.target.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.05)";
              }}
              required
            />
          </div>
          <button
            type="submit"
            className="btn fw-bold text-white w-100"
            disabled={loading}
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
              overflow: "hidden"
            }}
            onMouseEnter={e => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 12px 30px rgba(178, 121, 54, 0.4)";
            }}
            onMouseLeave={e => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 8px 20px rgba(178, 121, 54, 0.3)";
            }}
          >
            {loading && (
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
                style={{ position: "relative", zIndex: 2 }}
              ></span>
            )}
            <span style={{ position: "relative", zIndex: 2 }}>
              {loading ? "ENVIANDO..." : "ENVIAR"}
            </span>
            <div
              style={{
                position: "absolute",
                top: 0,
                left: "-100%",
                width: "100%",
                height: "100%",
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                transition: "left 0.5s ease"
              }}
              className="shine-effect"
            ></div>
          </button>
        </form>
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
      </AuthCard>
    </AuthLayout>
  );
}