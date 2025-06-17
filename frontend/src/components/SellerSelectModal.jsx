import { useState } from "react";

export default function SellerSelectModal({ sellers = [], onSelect, onClose }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = sellers.filter(
    (s) =>
      s.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.identificacion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="modal show fade d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Seleccionar Vendedor</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Buscar vendedor"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="table-responsive" style={{ maxHeight: "300px", overflowY: "auto" }}>
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Identificación</th>
                    <th>Nombre</th>
                    <th>Teléfono</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((s) => (
                    <tr key={s.id} style={{ cursor: "pointer" }} onClick={() => onSelect(s)}>
                      <td>{s.identificacion}</td>
                      <td>{s.nombre}</td>
                      <td>{s.telefono}</td>
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