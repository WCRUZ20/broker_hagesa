import { useEffect, useState } from "react";
import API from "../services/api";
import IdentificationTypeModal from "../components/IdentificationTypeModal";

export default function DatosPersonas() {
  const [types, setTypes] = useState([]);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [selected, setSelected] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const loadTypes = async () => {
    try {
      const res = await API.get("/tipos-identificacion");
      setTypes(res.data);
    } catch (err) {
      console.error("Error cargando tipos:", err);
    }
  };

  useEffect(() => {
    loadTypes();
  }, []);

  useEffect(() => {
    const handler = () => {
      setDarkMode(localStorage.getItem("darkMode") === "true");
    };
    window.addEventListener("darkModeChange", handler);
    return () => window.removeEventListener("darkModeChange", handler);
  }, []);

  const handleEditar = (tipo) => {
    setEditing(tipo);
    setShowModal(true);
  };

  const handleEliminar = async (id) => {
    if (confirm("¿Eliminar tipo?")) {
      await API.delete(`/tipos-identificacion/${id}`);
      loadTypes();
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
    if (selected.length === 0) return alert("Seleccione al menos un tipo");
    if (!confirm("¿Eliminar tipos seleccionados?")) return;
    Promise.all(selected.map((id) => API.delete(`/tipos-identificacion/${id}`))).then(() => {
      setSelected([]);
      loadTypes();
    });
  };

  const filtered = types.filter((c) =>
    c.Description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.id.toLowerCase().includes(searchTerm.toLowerCase())
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
                  Eliminar tipos
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
              placeholder="Buscar tipos"
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
          Nuevo Tipo
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
                  <th>ID</th>
                  <th>Descripción</th>
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
                    <td>{c.id}</td>
                    <td>{c.Description}</td>
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
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center">
                      No hay tipos registrados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <IdentificationTypeModal
          tipo={editing}
          onClose={() => {
            setShowModal(false);
            loadTypes();
          }}
        />
      )}
    </div>
  );
}