import { useState } from "react";

export default function ClientSelectModal({ clients = [], onSelect, onClose }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = clients.filter(
    (c) =>
      c.identificacion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.apellidos || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="modal show fade d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Seleccionar Cliente</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Buscar cliente"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="table-responsive" style={{ maxHeight: "300px", overflowY: "auto" }}>
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Identificación</th>
                    <th>Nombre</th>
                    <th>Apellidos</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c) => (
                    <tr key={c.id} style={{ cursor: "pointer" }} onClick={() => onSelect(c)}>
                      <td>{c.identificacion}</td>
                      <td>{c.nombre}</td>
                      <td>{c.apellidos}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}