import { useState, useEffect } from "react";
import API from "../services/api";

export default function ParroquiaModal({ parroquia, onClose }) {
  const isEdit = !!parroquia;
  const [form, setForm] = useState({
    id_ciudad: "",
    Description: "",
  });
  const [ciudades, setCiudades] = useState([]);

  useEffect(() => {
    API.get("/ciudades").then(res => setCiudades(res.data));
    if (isEdit) {
      setForm({
        id_ciudad: parroquia.id_ciudad,
        Description: parroquia.Description,
      });
    }
  }, [parroquia, isEdit]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const data = {
      id_ciudad: Number(form.id_ciudad),
      Description: form.Description.trim(),
    };
    try {
      if (isEdit) {
        await API.put(`/parroquias/${parroquia.id}`, data);
      } else {
        await API.post("/parroquias", data);
      }
      onClose();
    } catch (err) {
      const msg = err.response?.data?.detail || "Error al guardar parroquia";
      alert(msg);
    }
  };

  return (
    <div className="modal show fade d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">{isEdit ? "Editar Parroquia" : "Nueva Parroquia"}</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              <select name="id_ciudad" className="form-select mb-2" value={form.id_ciudad} onChange={handleChange} required>
                <option value="">Seleccione ciudad</option>
                {ciudades.map(c => (
                  <option key={c.id} value={c.id}>{c.Description}</option>
                ))}
              </select>
              <input
                name="Description"
                className="form-control mb-2"
                placeholder="Descripción"
                value={form.Description}
                onChange={handleChange}
                required
              />
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