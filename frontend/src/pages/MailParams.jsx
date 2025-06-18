import { useEffect, useState } from "react";
import API from "../services/api";
import MailParamsModal from "../components/MailParamsModal";
import ListStyles from "../components/ListStyles";

export default function MailParams() {
  const [items, setItems] = useState([]);
  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "true");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [selected, setSelected] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const loadItems = async () => {
    try {
      const res = await API.get("/seguimiento/parametros-envio");
      setItems(res.data);
    } catch (err) {
      console.error("Error cargando parametros", err);
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

  const handleEdit = (p) => {
    setEditing(p);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (confirm("¿Eliminar parámetro?")) {
      await API.delete(`/seguimiento/parametros-envio/${id}`);
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
    if (selected.length === 0) return alert("Seleccione al menos un parámetro");
    if (!confirm("¿Eliminar parámetros seleccionados?")) return;
    Promise.all(selected.map((id) => API.delete(`/seguimiento/parametros-envio/${id}`))).then(() => {
      setSelected([]);
      loadItems();
    });
  };

  const filtered = items.filter((i) => String(i.daystodue || "").includes(searchTerm));

  return (
    <div className="container-fluid py-4 px-4">
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className={`mb-1 fw-bold ${darkMode ? 'text-white' : 'text-dark'}`}>Parámetros de Envío</h2>
              <p className={`mb-0 ${darkMode ? 'text-muted' : 'text-secondary'}`}>Configurar recordatorios</p>
            </div>
            <button
              className="btn btn-primary px-4 py-2 rounded-3 shadow-sm d-flex align-items-center gap-2"
              onClick={() => { setEditing(null); setShowModal(true); }}
              style={{ fontWeight: '500', border: 'none' }}
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
                        style={{ fontWeight: '500' }}
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
                    {selected.length > 0 && (
                      <div className={`badge bg-primary px-3 py-2 rounded-pill`}>
                        {selected.length} seleccionado{selected.length !== 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="position-relative">
                    <i className={`bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 ${darkMode ? 'text-muted' : 'text-secondary'}`} style={{fontSize:'1rem'}}></i>
                    <input type="text" className={`form-control rounded-3 border-0 shadow-sm ps-5 py-2 ${darkMode ? 'bg-secondary text-white' : 'bg-light'}`} placeholder="Buscar" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{fontSize:'0.95rem'}} />
                  </div>
                </div>
                <div className="col-md-1 text-end">
                  <span className="text-muted">{filtered.length}</span>
                </div>
              </div>
            </div>

            <div className="table-responsive">
              <table className={`table table-hover align-middle mb-0 ${darkMode ? 'table-dark' : ''}`}>
                <thead className={`${darkMode ? 'border-secondary' : 'bg-light border-0'}`}>
                  <tr style={{fontSize:'0.9rem', fontWeight:'600'}}>
                    <th className="ps-4 py-3 border-0">
                      <input type="checkbox" className="form-check-input rounded" checked={filtered.length > 0 && selected.length === filtered.length} onChange={toggleSelectAll} style={{transform:'scale(1.1)'}} />
                    </th>
                    <th className="py-3 border-0">Días antes</th>
                    <th className="py-3 border-0">Hora envío</th>
                    <th className="py-3 border-0">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p) => (
                    <tr key={p.id} className={`${darkMode ? 'border-secondary' : ''}`} style={{fontSize:'0.95rem'}}>
                      <td className="ps-4 py-3 border-0">
                        <input type="checkbox" className="form-check-input rounded" checked={selected.includes(p.id)} onChange={() => toggleSelect(p.id)} style={{transform:'scale(1.1)'}} />
                      </td>
                      <td className="py-3 border-0">{p.daystodue}</td>
                      <td className="py-3 border-0">{p.hoursending}</td>
                      <td className="py-3 border-0">
                        <div className="d-flex gap-2">
                          <button className="btn btn-sm btn-outline-primary rounded-circle p-2" onClick={() => handleEdit(p)} style={{width:'36px',height:'36px'}} title="Editar">
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button className="btn btn-sm btn-outline-danger rounded-circle p-2" onClick={() => handleDelete(p.id)} style={{width:'36px',height:'36px'}} title="Eliminar">
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan="4" className="text-center py-5">
                        <div className={`text-muted ${darkMode ? 'text-secondary' : ''}`}>
                          <i className="bi bi-search mb-3" style={{fontSize:'2rem'}}></i>
                          <p className="mb-0">No se encontraron parámetros</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <MailParamsModal
          param={editing}
          onClose={() => { setShowModal(false); loadItems(); }}
        />
      )}

      <ListStyles darkMode={darkMode} />
    </div>
  );
}