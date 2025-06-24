import { useState } from "react";

export default function PolicySelectModal({ policies = [], onSelect, onClose }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = policies.filter((p) =>
    p.PolicyNum.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="modal show fade d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Seleccionar Póliza</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Buscar póliza"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="table-responsive" style={{ maxHeight: "300px", overflowY: "auto" }}>
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Número</th>
                    <th>Tipo</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p) => (
                    <tr key={p.id} style={{ cursor: "pointer" }} onClick={() => onSelect(p)}>
                      <td>{p.PolicyNum}</td>
                      <td>{p.DocType}</td>
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