import { useState } from "react";

export default function VehicleSelectModal({ vehicles = [], onSelect, onClose }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = vehicles.filter(
    (v) =>
      v.Plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (v.Model || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="modal show fade d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Seleccionar Vehículo</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Buscar vehículo"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="table-responsive" style={{ maxHeight: "300px", overflowY: "auto" }}>
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Placa</th>
                    <th>Modelo</th>
                    <th>Año</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((v) => (
                    <tr key={v.id} style={{ cursor: "pointer" }} onClick={() => onSelect(v)}>
                      <td>{v.Plate}</td>
                      <td>{v.Model}</td>
                      <td>{v.YearItem}</td>
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