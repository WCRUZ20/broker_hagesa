import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function RecoverPassword() {
  const [identifier, setIdentifier] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await API.post("/users/recover-password", { identifier });
      setMsg("Se envió una contraseña temporal a su correo");
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setMsg("Usuario no encontrado");
    }
  };

  return (
    <div className="container" style={{ maxWidth: 400, marginTop: 100 }}>
      <h3 className="mb-3">Recuperar contraseña</h3>
      {msg && <div className="alert alert-info">{msg}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Usuario o correo</label>
          <input className="form-control" value={identifier} onChange={e => setIdentifier(e.target.value)} required />
        </div>
        <button className="btn btn-primary w-100">Enviar</button>
      </form>
    </div>
  );
}