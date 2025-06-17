import { useState } from "react";

export default function InsuranceSelectModal({ insurances = [], onSelect, onClose }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = insurances.filter(
    (i) =>
      i.CompanyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (i.Identification || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="modal show fade d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Seleccionar Aseguradora</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Buscar aseguradora"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="table-responsive" style={{ maxHeight: "300px", overflowY: "auto" }}>
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Identificación</th>
                    <th>Nombre</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((i) => (
                    <tr key={i.id} style={{ cursor: "pointer" }} onClick={() => onSelect(i)}>
                      <td>{i.Identification}</td>
                      <td>{i.CompanyName}</td>
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