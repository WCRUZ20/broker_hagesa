import { useState, useEffect } from "react";
import API from "../services/api";

export default function CiudadModal({ ciudad, onClose }) {
  const isEdit = !!ciudad;
  const [form, setForm] = useState({
    id_provincia: "",
    Description: "",
  });
  const [provincias, setProvincias] = useState([]);

  useEffect(() => {
    API.get("/provincias").then(res => setProvincias(res.data));
    if (isEdit) {
      setForm({
        id_provincia: ciudad.id_provincia,
        Description: ciudad.Description,
      });
    }
  }, [ciudad, isEdit]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const data = {
      id_provincia: Number(form.id_provincia),
      Description: form.Description.trim(),
    };
    try {
      if (isEdit) {
        await API.put(`/ciudades/${ciudad.id}`, data);
      } else {
        await API.post("/ciudades", data);
      }
      onClose();
    } catch (err) {
      const msg = err.response?.data?.detail || "Error al guardar ciudad";
      alert(msg);
    }
  };

  return (
    <div className="modal show fade d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">{isEdit ? "Editar Ciudad" : "Nueva Ciudad"}</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              <select name="id_provincia" className="form-select mb-2" value={form.id_provincia} onChange={handleChange} required>
                <option value="">Seleccione provincia</option>
                {provincias.map(p => (
                  <option key={p.id} value={p.id}>{p.Description}</option>
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