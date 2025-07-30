import { useState } from "react";
import API from "../services/api";

export default function ResetPassword({ onDone }) {
  const [pwd, setPwd] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = async e => {
    e.preventDefault();
    if (pwd !== confirm) {
      setMsg("Las contraseñas no coinciden");
      return;
    }
    try {
      await API.post("/users/change-password", { new_password: pwd });
      setMsg("Contraseña actualizada");
      onDone && onDone();
    } catch (err) {
      setMsg("Error al actualizar contraseña");
    }
  };

  return (
    <div className="container" style={{ maxWidth: 400, marginTop: 100 }}>
      <h3 className="mb-3">Nueva contraseña</h3>
      {msg && <div className="alert alert-info">{msg}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Contraseña</label>
          <input type="password" className="form-control" value={pwd} onChange={e => setPwd(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Confirmar</label>
          <input type="password" className="form-control" value={confirm} onChange={e => setConfirm(e.target.value)} required />
        </div>
        <button className="btn btn-primary w-100">Guardar</button>
      </form>
    </div>
  );
}