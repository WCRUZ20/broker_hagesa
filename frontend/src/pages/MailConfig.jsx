import { useEffect, useState } from "react";
import API from "../services/api";
import MailConfigModal from "../components/MailConfigModal";
import ListStyles from "../components/ListStyles";

export default function MailConfig() {
  const [items, setItems] = useState([]);
  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "true");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [selected, setSelected] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const loadItems = async () => {
    try {
      const res = await API.get("/seguimiento/parametrizaciones-mail");
      setItems(res.data);
    } catch (err) {
      console.error("Error cargando configuraciones", err);
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

  const handleEdit = (cfg) => {
    setEditing(cfg);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (confirm("¿Eliminar configuración?")) {
      await API.delete(`/seguimiento/parametrizaciones-mail/${id}`);
      loadItems();
    }
  };

  const toggleSelect = (id) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const toggleSelectAll = () => {
    if (selected.length === filtered.length) {
      setSelected([]);
    } else {
      setSelected(filtered.map((c) => c.id));
    }
  };

  const handleBulkDelete = () => {
    if (selected.length === 0) return alert("Seleccione al menos una configuración");
    if (!confirm("¿Eliminar configuraciones seleccionadas?")) return;
    Promise.all(selected.map((id) => API.delete(`/seguimiento/parametrizaciones-mail/${id}`))).then(() => {
      setSelected([]);
      loadItems();
    });
  };

  const filtered = items.filter((i) => i.USER_SMTP.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="container-fluid py-4 px-4">
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className={`mb-1 fw-bold ${darkMode ? 'text-white' : 'text-dark'}`}>Configuración de correo</h2>
              <p className={`mb-0 ${darkMode ? 'text-muted' : 'text-secondary'}`}>Parámetros de SMTP</p>
            </div>
            <button
              className="btn btn-primary px-4 py-2 rounded-3 shadow-sm d-flex align-items-center gap-2"
              onClick={() => { setEditing(null); setShowModal(true); }}
              style={{ fontWeight: '500', transition: 'all 0.3s ease', border: 'none' }}
            >
              <i className="bi bi-plus-lg"></i>
              Nuevo
            </button>
          </div>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-12">
          <div className={`card border-0 shadow-sm ${darkMode ? 'bg-dark' : 'bg-white'}`}>
            <div className="card-body py-3">
              <div className="row align-items-center">
                <div className="col-md-8">
                  <div className="d-flex gap-3 align-items-center">
                    <div className="dropdown">
                      <button
                        className={`btn btn-outline-secondary dropdown-toggle px-3 py-2 rounded-3 ${darkMode ? 'border-secondary text-light' : ''}`}
                        type="button"
                        data-bs-toggle="dropdown"
                        style={{ fontWeight: '500', transition: 'all 0.3s ease' }}
                      >
                        <i className="bi bi-three-dots me-2"></i>
                        Acciones
                      </button>
                      <ul className={`dropdown-menu shadow-lg border-0 ${darkMode ? 'dropdown-menu-dark' : ''}`}>
                        <li>
                          <button className="dropdown-item py-2 px-3 d-flex align-items-center gap-2" onClick={handleBulkDelete}>
                            <i className="bi bi-trash text-danger"></i>
                            Eliminar seleccionados
                          </button>
                        </li>
                      </ul>
                    </div>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Buscar"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-4 text-end">
                  <span className="text-muted">{filtered.length} registros</span>
                </div>
              </div>
            </div>
            <div className="table-responsive">
              <table className={`table table-hover mb-0 ${darkMode ? 'table-dark' : ''}`}>
                <thead>
                  <tr>
                    <th scope="col">
                      <input type="checkbox" checked={selected.length === filtered.length && filtered.length > 0} onChange={toggleSelectAll} />
                    </th>
                    <th scope="col">Usuario SMTP</th>
                    <th scope="col">Host</th>
                    <th scope="col">Puerto</th>
                    <th scope="col">Estado</th>
                    <th scope="col">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c) => (
                    <tr key={c.id}>
                      <td>
                        <input type="checkbox" checked={selected.includes(c.id)} onChange={() => toggleSelect(c.id)} />
                      </td>
                      <td>{c.USER_SMTP}</td>
                      <td>{c.HOST_SMTP}</td>
                      <td>{c.PORT_SMTP}</td>
                      <td>{c.Estado === "A" ? "Activo" : "Desactivado"}</td>
                      <td>
                        <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(c)}>
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(c.id)}>
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <MailConfigModal
          config={editing}
          onClose={() => {
            setShowModal(false);
            loadItems();
          }}
        />
      )}

      <ListStyles darkMode={darkMode} />
    </div>
  );
}