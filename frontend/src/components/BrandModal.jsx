import { useState, useEffect } from "react";
import API from "../services/api";

export default function BrandModal({ brand, onClose }) {
  const isEdit = !!brand;

  const [form, setForm] = useState({
    Description: "",
  });

  useEffect(() => {
    if (isEdit) {
      setForm({ ...brand });
    }
  }, [brand]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { Description: form.Description.trim() };
    try {
      if (isEdit) {
        await API.put(`/marcas/${brand.id}`, data);
      } else {
        await API.post("/marcas", data);
      }
      onClose();
    } catch (err) {
      const msg = err.response?.data?.detail || "Error al guardar marca";
      alert(msg);
    }
  };

  return (
    <div className="modal show fade d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">{isEdit ? "Editar Marca" : "Nueva Marca"}</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
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