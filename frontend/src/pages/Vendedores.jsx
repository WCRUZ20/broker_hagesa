import { useEffect, useState } from "react";
import API from "../services/api";
import VendedorModal from "../components/VendedorModal";
import ListStyles from "../components/ListStyles";

export default function Vendedores() {
  const [vendedores, setVendedores] = useState([]);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [selected, setSelected] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const cargarVendedores = async () => {
    try {
      const res = await API.get("/vendedores");
      setVendedores(res.data);
    } catch (err) {
      console.error("Error cargando vendedores:", err);
    }
  };

  useEffect(() => {
    cargarVendedores();
  }, []);

  useEffect(() => {
    const handler = () => {
      setDarkMode(localStorage.getItem("darkMode") === "true");
    };
    window.addEventListener("darkModeChange", handler);
    return () => window.removeEventListener("darkModeChange", handler);
  }, []);

  const handleEditar = (vendedor) => {
    setEditing(vendedor);
    setShowModal(true);
  };

  const handleEliminar = async (id) => {
    if (confirm("¿Eliminar vendedor?")) {
      await API.delete(`/vendedores/${id}`);
      cargarVendedores();
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
      return alert("Seleccione al menos un vendedor");
    if (!confirm("¿Eliminar vendedores seleccionados?")) return;
    Promise.all(selected.map((id) => API.delete(`/vendedores/${id}`))).then(() => {
      setSelected([]);
      cargarVendedores();
    });
  };

  const filtered = vendedores.filter(
    (v) =>
      v.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.identificacion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (v.email || "").toLowerCase().includes(searchTerm.toLowerCase())
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
                  Eliminar vendedores
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
              placeholder="Buscar vendedores"
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
          Nuevo Vendedor
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
                  <th>Identificación</th>
                  <th>Email</th>
                  <th>Teléfono</th>
                  <th>Dirección</th>
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
                    <td>{v.nombre}</td>
                    <td>{v.identificacion}</td>
                    <td>{v.email}</td>
                    <td>{v.telefono}</td>
                    <td>{v.direccion}</td>
                    <td>
                      <i
                        className="bi bi-pencil-square text-warning me-3"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleEditar(v)}
                      ></i>
                      <i
                        className="bi bi-trash text-danger"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleEliminar(v.id)}
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
        <VendedorModal
          vendedor={editing}
          onClose={() => {
            setShowModal(false);
            cargarVendedores();
          }}
        />
      )}
    <ListStyles darkMode={darkMode} />
    </div>
  );
}