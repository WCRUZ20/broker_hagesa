import { useEffect, useState } from "react";
import API from "../services/api";
import VehicleModal from "../components/VehicleModal";

export default function VehiculosRegistrados() {
  const [vehicles, setVehicles] = useState([]);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [selected, setSelected] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const loadVehicles = async () => {
    const res = await API.get("/vehiculos");
    setVehicles(res.data);
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  useEffect(() => {
    const handler = () => {
      setDarkMode(localStorage.getItem("darkMode") === "true");
    };
    window.addEventListener("darkModeChange", handler);
    return () => window.removeEventListener("darkModeChange", handler);
  }, []);

  const handleEdit = (v) => {
    setEditing(v);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (confirm("¿Eliminar vehículo?")) {
      await API.delete(`/vehiculos/${id}`);
      loadVehicles();
    }
  };

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selected.length === filtered.length) {
      setSelected([]);
    } else {
      setSelected(filtered.map((v) => v.id));
    }
  };

  const handleBulkDelete = () => {
    if (selected.length === 0)
      return alert("Seleccione al menos un vehículo");
    if (!confirm("¿Eliminar vehículos seleccionados?")) return;
    Promise.all(selected.map((id) => API.delete(`/vehiculos/${id}`))).then(() => {
      setSelected([]);
      loadVehicles();
    });
  };

  const filtered = vehicles.filter(
    (v) =>
      v.Model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.Plate.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex gap-2">
          <div className="dropdown">
            <button
              className="btn btn-outline-secondary dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
            >
              Acción
            </button>
            <ul className="dropdown-menu">
              <li>
                <button className="dropdown-item" onClick={handleBulkDelete}>
                  Eliminar vehículos
                </button>
              </li>
            </ul>
          </div>
          <div className="input-group">
            <span
              className={`input-group-text ${
                darkMode ? "bg-dark text-white border-secondary" : "bg-white"
              }`}
            >
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className={`form-control ${
                darkMode ? "bg-dark text-white border-secondary" : ""
              }`}
              placeholder="Buscar vehículos"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {
            setEditing(null);
            setShowModal(true);
          }}
        >
          Nuevo Vehículo
        </button>
      </div>

      <div className={`card shadow-sm ${darkMode ? "bg-dark text-white" : ""}`}>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table
              className={`table table-hover align-middle mb-0 ${
                darkMode ? "table-dark" : "table-striped"
              }`}
            >
              <thead className={darkMode ? "" : "table-light"}>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={
                        filtered.length > 0 && selected.length === filtered.length
                      }
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th>Marca</th>
                  <th>Modelo</th>
                  <th>Tipo</th>
                  <th>Clasif.</th>
                  <th>Año</th>
                  <th>Placa</th>
                  <th>Propietario</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((v) => (
                  <tr key={v.id}>
                    <td>
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={selected.includes(v.id)}
                        onChange={() => toggleSelect(v.id)}
                      />
                    </td>
                    <td></td>
                    <td>{v.Model}</td>
                    <td></td>
                    <td></td>
                    <td>{v.YearItem}</td>
                    <td>{v.Plate}</td>
                    <td></td>
                    <td>
                      <i
                        className="bi bi-pencil-square text-warning me-3"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleEdit(v)}
                      ></i>
                      <i
                        className="bi bi-trash text-danger"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleDelete(v.id)}
                      ></i>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <VehicleModal
          vehicle={editing}
          onClose={() => {
            setShowModal(false);
            loadVehicles();
          }}
        />
      )}
    </div>
  );
}