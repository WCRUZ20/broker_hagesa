import { useEffect, useState } from "react";
import API from "../services/api";
import AseguradoraModal from "../components/AseguradoraModal";

export default function Aseguradoras() {
  const [items, setItems] = useState([]);
  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "true");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [selected, setSelected] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const loadItems = async () => {
    try {
      const res = await API.get("/aseguradoras");
      setItems(res.data);
    } catch (err) {
      console.error("Error cargando aseguradoras:", err);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  useEffect(() => {
    const handler = () => setDarkMode(localStorage.getItem("darkMode") === "true");
    window.addEventListener("darkModeChange", handler);
    return () => window.removeEventListener("darkModeChange", handler);
  }, []);

  const handleEditar = (item) => {
    setEditing(item);
    setShowModal(true);
  };

  const handleEliminar = async (id) => {
    if (confirm("¿Eliminar aseguradora?")) {
      await API.delete(`/aseguradoras/${id}`);
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
      setSelected(filtered.map((c) => c.id));
    }
  };

  const handleBulkDelete = () => {
    if (selected.length === 0) return alert("Seleccione al menos una aseguradora");
    if (!confirm("¿Eliminar aseguradoras seleccionadas?")) return;
    Promise.all(selected.map((id) => API.delete(`/aseguradoras/${id}`))).then(() => {
      setSelected([]);
      loadItems();
    });
  };

  const filtered = items.filter(
    (c) =>
      c.CompanyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.Identification || "").toLowerCase().includes(searchTerm.toLowerCase())
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
                  Eliminar aseguradoras
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
              placeholder="Buscar aseguradoras"
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
          Nueva Aseguradora
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
                  <th>Nombre</th>
                  {/* <th>Tipo</th> */}
                  <th>Identificación</th>
                  <th>Teléfono</th>
                  <th>Dirección</th>
                  <th>Comisión %</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={selected.includes(c.id)}
                        onChange={() => toggleSelect(c.id)}
                      />
                    </td>
                    <td>{c.CompanyName}</td>
                    {/* <td>{c.IdentType}</td> */}
                    <td>{c.Identification}</td>
                    <td>{c.TelepCompany}</td>
                    <td>{c.DirCompany}</td>
                    <td>{c.ComiPrcnt}</td>
                    <td>
                      <i
                        className="bi bi-pencil-square text-warning me-3"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleEditar(c)}
                      ></i>
                      <i
                        className="bi bi-trash text-danger"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleEliminar(c.id)}
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
        <AseguradoraModal
          aseguradora={editing}
          onClose={() => {
            setShowModal(false);
            loadItems();
          }}
        />
      )}
    </div>
  );
}