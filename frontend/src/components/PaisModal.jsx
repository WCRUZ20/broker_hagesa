import { useState, useEffect } from "react";
import API from "../services/api";

export default function PaisModal({ pais, onClose }) {
  const isEdit = !!pais;

  const [form, setForm] = useState({
    id: "",
    Description: "",
  });

  useEffect(() => {
    if (isEdit) {
      setForm({ ...pais });
    }
  }, [pais]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      id: Number(form.id),
      Description: form.Description.trim(),
    };
    try {
      if (isEdit) {
        await API.put(`/paises/${pais.id}`, data);
      } else {
        await API.post("/paises", data);
      }
      onClose();
    } catch (err) {
      const msg = err.response?.data?.detail || "Error al guardar país";
      alert(msg);
    }
  };

  return (
    <div className="modal show fade d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">{isEdit ? "Editar País" : "Nuevo País"}</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              <input
                name="id"
                type="number"
                className="form-control mb-2"
                placeholder="ID"
                value={form.id}
                onChange={handleChange}
                required
                disabled={isEdit}
              />
              <input name="Description" className="form-control mb-2" placeholder="Descripción" value={form.Description} onChange={handleChange} required />
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