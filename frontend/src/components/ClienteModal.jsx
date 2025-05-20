import { useState, useEffect } from "react";
import API from "../services/api";

export default function ClienteModal({ cliente, onClose }) {
  const isEdit = !!cliente;

  const [form, setForm] = useState({
    nombre: "",
    identificacion: "",
    telefono: "",
    email: "",
    direccion: "",
  });

  useEffect(() => {
    if (isEdit) {
      setForm({ ...cliente });
    }
  }, [cliente]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await API.put(`/clientes/${cliente.id}`, form);
      } else {
        await API.post("/clientes", form);
      }
      onClose();
    } catch (err) {
      alert("Error al guardar cliente");
    }
  };

  return (
    <div className="modal show fade d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">{isEdit ? "Editar Cliente" : "Nuevo Cliente"}</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              <input name="nombre" className="form-control mb-2" placeholder="Nombre" value={form.nombre} onChange={handleChange} required />
              <input name="identificacion" className="form-control mb-2" placeholder="Identificación" value={form.identificacion} onChange={handleChange} required />
              <input name="telefono" className="form-control mb-2" placeholder="Teléfono" value={form.telefono} onChange={handleChange} />
              <input name="email" className="form-control mb-2" placeholder="Correo" type="email" value={form.email} onChange={handleChange} />
              <input name="direccion" className="form-control mb-2" placeholder="Dirección" value={form.direccion} onChange={handleChange} />
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
