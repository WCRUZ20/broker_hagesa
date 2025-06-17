import { useState, useEffect } from "react";
import API from "../services/api";

export default function MailConfigModal({ config, onClose }) {
  const isEdit = !!config;
  const [form, setForm] = useState({
    USER_SMTP: "",
    PASS_SMTP: "",
    HOST_SMTP: "",
    PORT_SMTP: "",
    Estado: "D",
  });

  useEffect(() => {
    if (isEdit) {
      setForm({
        USER_SMTP: config.USER_SMTP || "",
        PASS_SMTP: config.PASS_SMTP || "",
        HOST_SMTP: config.HOST_SMTP || "",
        PORT_SMTP: config.PORT_SMTP || "",
        Estado: config.Estado || "D",
      });
    }
  }, [config]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await API.put(`/seguimiento/parametrizaciones-mail/${config.id}`, form);
      } else {
        await API.post("/seguimiento/parametrizaciones-mail", form);
      }
      onClose();
    } catch (err) {
      const msg = err.response?.data?.detail || "Error al guardar configuración";
      alert(msg);
    }
  };

  return (
    <div className="modal show fade d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">{isEdit ? "Editar Configuración" : "Nueva Configuración"}</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              <input
                name="USER_SMTP"
                className="form-control mb-2"
                placeholder="Usuario SMTP"
                value={form.USER_SMTP}
                onChange={handleChange}
                required
              />
              <input
                name="PASS_SMTP"
                type="password"
                className="form-control mb-2"
                placeholder="Contraseña SMTP"
                value={form.PASS_SMTP}
                onChange={handleChange}
                required
              />
              <input
                name="HOST_SMTP"
                className="form-control mb-2"
                placeholder="Host SMTP"
                value={form.HOST_SMTP}
                onChange={handleChange}
                required
              />
              <input
                name="PORT_SMTP"
                className="form-control mb-2"
                placeholder="Puerto SMTP"
                value={form.PORT_SMTP}
                onChange={handleChange}
                required
              />
              <select
                name="Estado"
                className="form-select mb-2"
                value={form.Estado}
                onChange={handleChange}
              >
                <option value="D">Desactivado</option>
                <option value="A">Activo</option>
              </select>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
              <button className="btn btn-primary" type="submit">Guardar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}