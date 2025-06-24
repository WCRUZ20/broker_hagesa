import { useEffect, useState } from "react";
import API from "../services/api";
import PaisModal from "../components/PaisModal";

export default function Paises() {
  const [paises, setPaises] = useState([]);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [selected, setSelected] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const cargarPaises = async () => {
    try {
      const res = await API.get("/paises");
      setPaises(res.data);
    } catch (err) {
      console.error("Error cargando países:", err);
    }
  };

  useEffect(() => {
    cargarPaises();
  }, []);

  useEffect(() => {
    const handler = () => {
      setDarkMode(localStorage.getItem("darkMode") === "true");
    };
    window.addEventListener("darkModeChange", handler);
    return () => window.removeEventListener("darkModeChange", handler);
  }, []);

  const handleEditar = (pais) => {
    setEditing(pais);
    setShowModal(true);
  };

  const handleEliminar = async (id) => {
    if (confirm("¿Eliminar país?")) {
      await API.delete(`/paises/${id}`);
      cargarPaises();
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
    if (selected.length === 0) return alert("Seleccione al menos un país");
    if (!confirm("¿Eliminar países seleccionados?")) return;
    Promise.all(selected.map((id) => API.delete(`/paises/${id}`))).then(() => {
      setSelected([]);
      cargarPaises();
    });
  };

  const filtered = paises.filter(
    (p) =>
      p.Description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(p.id).includes(searchTerm)
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
                  Eliminar países
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
              placeholder="Buscar países"
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
          Nuevo País
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
                    <td>{p.id}</td>
                    <td>{p.Description}</td>
                    <td>
                      <i
                        className="bi bi-pencil-square text-warning me-3"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleEditar(p)}
                      ></i>
                      <i
                        className="bi bi-trash text-danger"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleEliminar(p.id)}
                      ></i>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center">
                      No hay países registrados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <PaisModal
          pais={editing}
          onClose={() => {
            setShowModal(false);
            cargarPaises();
          }}
        />
      )}
    </div>
  );
}