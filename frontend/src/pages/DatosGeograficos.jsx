import { useEffect, useState } from "react";
import API from "../services/api";
import PaisModal from "../components/PaisModal";
import ProvinciaModal from "../components/ProvinciaModal";
import CiudadModal from "../components/CiudadModal";
import ParroquiaModal from "../components/ParroquiaModal";
import ListStyles from "../components/ListStyles";

export default function DatosGeograficos() {
  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "true");
  const accentColor = "rgb(200, 150, 82)";

  const [paises, setPaises] = useState([]);
  const [showPaisModal, setShowPaisModal] = useState(false);
  const [editPais, setEditPais] = useState(null);
  const [selPais, setSelPais] = useState([]);
  const [searchPais, setSearchPais] = useState("");

  const [provincias, setProvincias] = useState([]);
  const [showProvModal, setShowProvModal] = useState(false);
  const [editProv, setEditProv] = useState(null);
  const [selProv, setSelProv] = useState([]);
  const [searchProv, setSearchProv] = useState("");

  const [ciudades, setCiudades] = useState([]);
  const [showCiudadModal, setShowCiudadModal] = useState(false);
  const [editCiudad, setEditCiudad] = useState(null);
  const [selCiudad, setSelCiudad] = useState([]);
  const [searchCiudad, setSearchCiudad] = useState("");

  const [parroquias, setParroquias] = useState([]);
  const [showParroquiaModal, setShowParroquiaModal] = useState(false);
  const [editParroquia, setEditParroquia] = useState(null);
  const [selParroquia, setSelParroquia] = useState([]);
  const [searchParroquia, setSearchParroquia] = useState("");

  const loadAll = async () => {
    const [p, pr, c, pa] = await Promise.all([
      API.get("/paises"),
      API.get("/provincias"),
      API.get("/ciudades"),
      API.get("/parroquias"),
    ]);
    setPaises(p.data);
    setProvincias(pr.data);
    setCiudades(c.data);
    setParroquias(pa.data);
  };

  useEffect(() => {
    loadAll();
  }, []);

  useEffect(() => {
    const handler = () => setDarkMode(localStorage.getItem("darkMode") === "true");
    window.addEventListener("darkModeChange", handler);
    return () => window.removeEventListener("darkModeChange", handler);
  }, []);

  const filteredPais = paises.filter(p => p.Description.toLowerCase().includes(searchPais.toLowerCase()) || String(p.id).includes(searchPais));
  const filteredProv = provincias.filter(p => p.Description.toLowerCase().includes(searchProv.toLowerCase()) || String(p.id).includes(searchProv));
  const filteredCiudad = ciudades.filter(p => p.Description.toLowerCase().includes(searchCiudad.toLowerCase()) || String(p.id).includes(searchCiudad));
  const filteredParroquia = parroquias.filter(p => p.Description.toLowerCase().includes(searchParroquia.toLowerCase()) || String(p.id).includes(searchParroquia));

  const bulkDelete = async (selected, endpoint, reload) => {
    if (selected.length === 0) return alert("Seleccione registros");
    if (!confirm("¿Eliminar seleccionados?")) return;
    await Promise.all(selected.map(id => API.delete(`/${endpoint}/${id}`)));
    reload();
  };

  return (
    <div className="container-fluid py-4 px-4">
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className={`mb-1 fw-bold ${darkMode ? 'text-white' : 'text-dark'}`}>Datos Geográficos</h2>
              <p className={`mb-0 ${darkMode ? 'text-muted' : 'text-secondary'}`}>Administración de catálogos geográficos</p>
            </div>
          </div>
        </div>
      </div>
      {/* Paises y Provincias */}
      <div className="row">
        <div className="col-md-6 mb-4">
          <Section
            title="Países"
            items={filteredPais}
            darkMode={darkMode}
            selected={selPais}
            onToggleSelect={id => setSelPais(s => s.includes(id) ? s.filter(i => i !== id) : [...s, id])}
            onToggleAll={() => setSelPais(selPais.length === filteredPais.length ? [] : filteredPais.map(p => p.id))}
            onBulkDelete={() => bulkDelete(selPais, 'paises', loadAll)}
            onDelete={async id => { if (confirm('¿Eliminar país?')) { await API.delete(`/paises/${id}`); loadAll(); } }}
            onEdit={p => { setEditPais(p); setShowPaisModal(true); }}
            onCreate={() => { setEditPais(null); setShowPaisModal(true); }}
            accentColor={accentColor}
          />
        </div>
        <div className="col-md-6 mb-4">
          <Section
            title="Provincias"
            items={filteredProv}
            darkMode={darkMode}
            selected={selProv}
            onToggleSelect={id => setSelProv(s => s.includes(id) ? s.filter(i => i !== id) : [...s, id])}
            onToggleAll={() => setSelProv(selProv.length === filteredProv.length ? [] : filteredProv.map(p => p.id))}
            onBulkDelete={() => bulkDelete(selProv, 'provincias', loadAll)}
            onDelete={async id => { if (confirm('¿Eliminar provincia?')) { await API.delete(`/provincias/${id}`); loadAll(); } }}
            onEdit={p => { setEditProv(p); setShowProvModal(true); }}
            onCreate={() => { setEditProv(null); setShowProvModal(true); }}
            accentColor={accentColor}
          />
        </div>
      </div>
      {/* Ciudades y Parroquias */}
      <div className="row">
        <div className="col-md-6 mb-4">
          <Section
            title="Ciudades"
            items={filteredCiudad}
            darkMode={darkMode}
            selected={selCiudad}
            onToggleSelect={id => setSelCiudad(s => s.includes(id) ? s.filter(i => i !== id) : [...s, id])}
            onToggleAll={() => setSelCiudad(selCiudad.length === filteredCiudad.length ? [] : filteredCiudad.map(p => p.id))}
            onBulkDelete={() => bulkDelete(selCiudad, 'ciudades', loadAll)}
            onDelete={async id => { if (confirm('¿Eliminar ciudad?')) { await API.delete(`/ciudades/${id}`); loadAll(); } }}
            onEdit={p => { setEditCiudad(p); setShowCiudadModal(true); }}
            onCreate={() => { setEditCiudad(null); setShowCiudadModal(true); }}
            accentColor={accentColor}
          />
        </div>
        <div className="col-md-6 mb-4">
          <Section
            title="Parroquias"
            items={filteredParroquia}
            darkMode={darkMode}
            selected={selParroquia}
            onToggleSelect={id => setSelParroquia(s => s.includes(id) ? s.filter(i => i !== id) : [...s, id])}
            onToggleAll={() => setSelParroquia(selParroquia.length === filteredParroquia.length ? [] : filteredParroquia.map(p => p.id))}
            onBulkDelete={() => bulkDelete(selParroquia, 'parroquias', loadAll)}
            onDelete={async id => { if (confirm('¿Eliminar parroquia?')) { await API.delete(`/parroquias/${id}`); loadAll(); } }}
            onEdit={p => { setEditParroquia(p); setShowParroquiaModal(true); }}
            onCreate={() => { setEditParroquia(null); setShowParroquiaModal(true); }}
            accentColor={accentColor}
          />
        </div>
      </div>

      {showPaisModal && (
        <PaisModal pais={editPais} onClose={() => { setShowPaisModal(false); loadAll(); }} />
      )}
      {showProvModal && (
        <ProvinciaModal provincia={editProv} onClose={() => { setShowProvModal(false); loadAll(); }} />
      )}
      {showCiudadModal && (
        <CiudadModal ciudad={editCiudad} onClose={() => { setShowCiudadModal(false); loadAll(); }} />
      )}
      {showParroquiaModal && (
        <ParroquiaModal parroquia={editParroquia} onClose={() => { setShowParroquiaModal(false); loadAll(); }} />
      )}
      <ListStyles darkMode={darkMode} accentColor={accentColor} />
    </div>
  );
}

function Section({ title, items, darkMode, selected, onToggleSelect, onToggleAll, onBulkDelete, onDelete, onEdit, onCreate, accentColor }) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const filtered = items.filter(i => i.Description.toLowerCase().includes(search.toLowerCase()) || String(i.id).includes(search));

  useEffect(() => { setSearch(""); setCurrentPage(1); }, [items]);
  useEffect(() => { setCurrentPage(1); }, [search]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div>
      <h5 className="mb-2 fw-bold">{title}</h5>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <div className="d-flex gap-2">
          <div className="dropdown">
            <button
              className="btn dropdown-toggle px-3 py-2 rounded-3"
              type="button"
              data-bs-toggle="dropdown"
              style={{
                fontWeight: '500',
                transition: 'all 0.3s ease',
                border: `1px solid ${accentColor}`,
                color: accentColor,
                backgroundColor: 'transparent'
              }}
            >
              Acción
            </button>
            <ul className="dropdown-menu">
              <li><button className="dropdown-item" onClick={onBulkDelete}>Eliminar</button></li>
            </ul>
          </div>
          <div className="input-group">
            <span className={`input-group-text ${darkMode ? "bg-dark text-white border-secondary" : "bg-white"}`}> <i className="bi bi-search"></i> </span>
            <input type="text" className={`form-control ${darkMode ? "bg-dark text-white border-secondary" : ""}`} placeholder={`Buscar ${title.toLowerCase()}`} value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <button
          className="btn px-3 py-2 rounded-3"
          onClick={onCreate}
          style={{
            fontWeight: '500',
            transition: 'all 0.3s ease',
            backgroundColor: accentColor,
            borderColor: accentColor,
            color: '#fff'
          }}
        >
          Nuevo
        </button>
      </div>
      <div className={`card shadow-sm ${darkMode ? "bg-dark text-white" : ""}`}>
        <div className="card-body p-0">
          <div className="table-responsive" style={{ maxHeight: "40vh", overflowY: "auto" }}>
            <table className={`table table-hover align-middle mb-0 ${darkMode ? "table-dark" : "table-striped"}`}>
              <thead className={darkMode ? "" : "table-light"}>
                <tr>
                  <th>
                    <input type="checkbox" className="form-check-input" checked={filtered.length > 0 && selected.length === filtered.length} onChange={onToggleAll} />
                  </th>
                  <th>ID</th>
                  <th>Descripción</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map(i => (
                  <tr key={i.id}>
                    <td>
                      <input type="checkbox" className="form-check-input" checked={selected.includes(i.id)} onChange={() => onToggleSelect(i.id)} />
                    </td>
                    <td>{i.id}</td>
                    <td>{i.Description}</td>
                    <td>
                      <i className="bi bi-pencil-square text-warning me-3" style={{ cursor: "pointer" }} onClick={() => onEdit(i)}></i>
                      <i className="bi bi-trash text-danger" style={{ cursor: "pointer" }} onClick={() => onDelete(i.id)}></i>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center">No hay registros.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="d-flex justify-content-between align-items-center p-2">
            <div className="hint-text">
              Mostrando <b>{filtered.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}</b>
              -<b>{Math.min(currentPage * itemsPerPage, filtered.length)}</b>{" de "}
              <b>{filtered.length}</b> registros
            </div>
            <ul className="pagination mb-0">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}> 
                <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>Anterior</button>
              </li>
              {Array.from({ length: totalPages }, (_, i) => (
                <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}> 
                  <button className="page-link" onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
                </li>
              ))}
              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}> 
                <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>Siguiente</button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}