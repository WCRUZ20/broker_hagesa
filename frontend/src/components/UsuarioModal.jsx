import { useState, useEffect } from "react";
import API from "../services/api";

export default function UsuarioModal({ user, onClose }) {
  const isEdit = !!user;

  const [form, setForm] = useState({
    user_name: "",
    last_name: "",
    user_role: "R",
    user_cod: "",
    user_email: "",
    user_password: ""
  });

  useEffect(() => {
    if (isEdit) {
      setForm({ ...user, user_password: "" }); // no mostrar hash
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await API.put(`/users/${user.id}`, form);
      } else {
        await API.post("/users/create", form);
      }
      onClose();
    } catch (err) {
      alert("Error al guardar el usuario");
    }
  };

  return (
    <div className="modal show fade d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">{isEdit ? "Editar Usuario" : "Nuevo Usuario"}</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              <input name="user_name" className="form-control mb-2" placeholder="Nombre" value={form.user_name} onChange={handleChange} required />
              <input name="last_name" className="form-control mb-2" placeholder="Apellido" value={form.last_name} onChange={handleChange} required />
              <input name="user_cod" className="form-control mb-2" placeholder="Código usuario" value={form.user_cod} onChange={handleChange} required />
              <input name="user_email" className="form-control mb-2" placeholder="Correo" type="email" value={form.user_email} onChange={handleChange} required />
              {!isEdit && (
                <input name="user_password" className="form-control mb-2" placeholder="Contraseña" type="password" value={form.user_password} onChange={handleChange} required />
              )}
              <select name="user_role" className="form-select mb-2" value={form.user_role} onChange={handleChange}>
                <option value="A">Administrador</option>
                <option value="R">Regular</option>
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
