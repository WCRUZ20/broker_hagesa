import { useState, useEffect } from "react";
import API from "../services/api";

export default function ProvinciaModal({ provincia, onClose }) {
  const isEdit = !!provincia;
  const [form, setForm] = useState({
    id_pais: "",
    Description: "",
  });
  const [paises, setPaises] = useState([]);

  useEffect(() => {
    API.get("/paises").then(res => setPaises(res.data));
    if (isEdit) {
      setForm({
        id_pais: provincia.id_pais,
        Description: provincia.Description,
      });
    }
  }, [provincia, isEdit]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const data = {
      id_pais: Number(form.id_pais),
      Description: form.Description.trim(),
    };
    try {
      if (isEdit) {
        await API.put(`/provincias/${provincia.id}`, data);
      } else {
        await API.post("/provincias", data);
      }
      onClose();
    } catch (err) {
      const msg = err.response?.data?.detail || "Error al guardar provincia";
      alert(msg);
    }
  };

  return (
    <div className="modal show fade d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">{isEdit ? "Editar Provincia" : "Nueva Provincia"}</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              <select name="id_pais" className="form-select mb-2" value={form.id_pais} onChange={handleChange} required>
                <option value="">Seleccione país</option>
                {paises.map(p => (
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