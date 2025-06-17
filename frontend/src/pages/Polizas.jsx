import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Polizas() {
  const [items, setItems] = useState([]);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );
  const [selected, setSelected] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const loadItems = async () => {
    const res = await API.get("/polizas");
    setItems(res.data);
  };

  const handleEdit = (p) => {
    navigate(`/editar-poliza/${p.id}`);
  };

  const handleDelete = async (id) => {
    if (confirm("¿Eliminar póliza?")) {
      await API.delete(`/polizas/${id}`);
      loadItems();
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
      setSelected(filtered.map((p) => p.id));
    }
  };

  const handleBulkDelete = () => {
    if (selected.length === 0) return alert("Seleccione al menos una póliza");
    if (!confirm("¿Eliminar pólizas seleccionadas?")) return;
    Promise.all(selected.map((id) => API.delete(`/polizas/${id}`))).then(() => {
      setSelected([]);
      loadItems();
    });
  };

  useEffect(() => {
    loadItems();
  }, []);

  useEffect(() => {
    const handler = () => {
      setDarkMode(localStorage.getItem("darkMode") === "true");
    };
    window.addEventListener("darkModeChange", handler);
    return () => window.removeEventListener("darkModeChange", handler);
  }, []);

  const filtered = items.filter(
    (p) =>
      p.PolicyNum.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.DocType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.InsuranceName || "").toLowerCase().includes(searchTerm.toLowerCase())
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
                  Eliminar pólizas
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
              placeholder="Buscar pólizas"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => navigate("/crear-poliza")}>Nueva Póliza</button>
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
                  <th>Aseguradora</th>
                  <th>Número</th>
                  <th>Tipo</th>
                  <th>% Comisión</th>
                  <th>Inicio</th>
                  <th>Vencimiento</th>
                  <th>Valor Asegurado</th>
                  <th>Días vencidos</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={selected.includes(p.id)}
                        onChange={() => toggleSelect(p.id)}
                      />
                    </td>
                    <td>{p.InsuranceName}</td>
                    <td>{p.PolicyNum}</td>
                    <td>{p.DocType}</td>
                    <td>{p.ComiPrcnt}</td>
                    <td>{p.InitDate}</td>
                    <td>{p.DueDate}</td>
                    <td>{p.AscValue}</td>
                    <td>{p.DaysOverdue}</td>
                    <td>
                      <i
                        className="bi bi-pencil-square text-warning me-3"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleEdit(p)}
                      ></i>
                      <i
                        className="bi bi-trash text-danger"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleDelete(p.id)}
                      ></i>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
