import { useEffect, useState } from "react";
import API from "../services/api";
import MailTemplateModal from "../components/MailTemplateModal";
import ListStyles from "../components/ListStyles";

export default function MailTemplates() {
  const [items, setItems] = useState([]);
  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "true");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [selected, setSelected] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const loadItems = async () => {
    try {
      const res = await API.get("/seguimiento/plantillas-mail");
      setItems(res.data);
    } catch (err) {
      console.error("Error cargando plantillas", err);
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

  const handleEdit = (tpl) => { setEditing(tpl); setShowModal(true); };

  const handleDelete = async (id) => {
    if (confirm("¿Eliminar plantilla?")) {
      await API.delete(`/seguimiento/plantillas-mail/${id}`);
      loadItems();
    }
  };

  const toggleSelect = (id) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const toggleSelectAll = () => {
    if (selected.length === filtered.length) { setSelected([]); } else { setSelected(filtered.map((i) => i.id)); }
  };

  const handleBulkDelete = () => {
    if (selected.length === 0) return alert("Seleccione al menos una plantilla");
    if (!confirm("¿Eliminar plantillas seleccionadas?")) return;
    Promise.all(selected.map((id) => API.delete(`/seguimiento/plantillas-mail/${id}`))).then(() => {
      setSelected([]); loadItems();
    });
  };

  const renderStatusBadge = (estado) => {
    const active = estado === "A" || estado === "Activo";
    const color = active ? "success" : "danger";
    const icon = active ? "bi-check-circle" : "bi-x-circle";
    const text = active ? "Activo" : "Desactivado";
    return (
      <span className={`badge bg-${color} px-3 py-2 rounded-pill fw-normal d-flex align-items-center gap-1`} style={{fontSize:'0.875rem', width:'fit-content'}}>
        <i className={`bi ${icon}`} style={{fontSize:'0.8rem'}}></i>
        {text}
      </span>
    );
  };

  const filtered = items.filter((t) => t.Name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="container-fluid py-4 px-4">
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className={`mb-1 fw-bold ${darkMode ? 'text-white' : 'text-dark'}`}>Plantillas de Correo</h2>
              <p className={`mb-0 ${darkMode ? 'text-muted' : 'text-secondary'}`}>Define asuntos y cuerpo del correo</p>
            </div>
            <button className="btn btn-primary px-4 py-2 rounded-3 shadow-sm d-flex align-items-center gap-2" onClick={() => { setEditing(null); setShowModal(true); }} style={{fontWeight:'500', border:'none'}}>
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
                      <button className={`btn btn-outline-secondary dropdown-toggle px-3 py-2 rounded-3 ${darkMode ? 'border-secondary text-light' : ''}`} type="button" data-bs-toggle="dropdown" style={{fontWeight:'500'}}>
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
                    <th className="py-3 border-0">Nombre</th>
                    <th className="py-3 border-0">Destino</th>
                    <th className="py-3 border-0">Estado</th>
                    <th className="py-3 border-0">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((t) => (
                    <tr key={t.id} className={`${darkMode ? 'border-secondary' : ''}`} style={{fontSize:'0.95rem'}}>
                      <td className="ps-4 py-3 border-0">
                        <input type="checkbox" className="form-check-input rounded" checked={selected.includes(t.id)} onChange={() => toggleSelect(t.id)} style={{transform:'scale(1.1)'}} />
                      </td>
                      <td className="py-3 border-0">{t.Name}</td>
                      <td className="py-3 border-0">{t.Destination === "S" ? "Vendedor" : "Cliente"}</td>
                      <td className="py-3 border-0">{renderStatusBadge(t.Estado)}</td>
                      <td className="py-3 border-0">
                        <div className="d-flex gap-2">
                          <button className="btn btn-sm btn-outline-primary rounded-circle p-2" onClick={() => handleEdit(t)} style={{width:'36px',height:'36px'}} title="Editar">
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button className="btn btn-sm btn-outline-danger rounded-circle p-2" onClick={() => handleDelete(t.id)} style={{width:'36px',height:'36px'}} title="Eliminar">
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan="5" className="text-center py-5">
                        <div className={`text-muted ${darkMode ? 'text-secondary' : ''}`}>
                          <i className="bi bi-search mb-3" style={{fontSize:'2rem'}}></i>
                          <p className="mb-0">No se encontraron plantillas</p>
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
        <MailTemplateModal
          template={editing}
          onClose={() => { setShowModal(false); loadItems(); }}
        />
      )}

      <ListStyles darkMode={darkMode} />
    </div>
  );
}