import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [identifier, setIdentifier] = useState(
    localStorage.getItem("resetIdentifier") || ""
  );
  const [tempPwd, setTempPwd] = useState("");
  const [pwd, setPwd] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleConfirmChange = e => {
    const value = e.target.value;
    setConfirm(value);
    if (pwd && value && value !== pwd) {
      setMsg("Las contraseñas no coinciden");
    } else {
      setMsg("");
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (pwd !== confirm) {
      setMsg("Las contraseñas no coinciden");
      return;
    }
    try {
        await API.post("/users/change-password", {
          identifier,
          temp_password: tempPwd,
          new_password: pwd,
        });
        localStorage.removeItem("resetIdentifier");
        setMsg("Contraseña actualizada");
        setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setMsg("Error al actualizar contraseña");
    }
  };

  return (
    <div className="container" style={{ maxWidth: 400, marginTop: 100 }}>
      <h3 className="mb-3">Restablecer contraseña</h3>
      {msg && <div className="alert alert-info">{msg}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Usuario o correo</label>
          <input className="form-control" value={identifier} onChange={e => setIdentifier(e.target.value)} required disabled/>
        </div>
        <div className="mb-3">
          <label className="form-label">Contraseña temporal</label>
          <input type="password" className="form-control" value={tempPwd} onChange={e => setTempPwd(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Nueva contraseña</label>
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