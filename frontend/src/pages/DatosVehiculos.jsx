import { useEffect, useState } from "react";
import API from "../services/api";
import BrandModal from "../components/BrandModal";
import VehicleTypeModal from "../components/VehicleTypeModal";
import VehicleUseModal from "../components/VehicleUseModal";
import VehicleClassificationModal from "../components/VehicleClassificationModal";
import ListStyles from "../components/ListStyles";


export default function DatosVehiculos() {
  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "true");
  const accentColor = "rgb(200, 150, 82)";

  const [brands, setBrands] = useState([]);
  const [showBrandModal, setShowBrandModal] = useState(false);
  const [editBrand, setEditBrand] = useState(null);
  const [selBrand, setSelBrand] = useState([]);

  const [types, setTypes] = useState([]);
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [editType, setEditType] = useState(null);
  const [selType, setSelType] = useState([]);

  const [uses, setUses] = useState([]);
  const [showUseModal, setShowUseModal] = useState(false);
  const [editUse, setEditUse] = useState(null);
  const [selUse, setSelUse] = useState([]);

  const [classifications, setClassifications] = useState([]);
  const [showClassModal, setShowClassModal] = useState(false);
  const [editClass, setEditClass] = useState(null);
  const [selClass, setSelClass] = useState([]);

  const loadAll = async () => {
    const [b, t, u, c] = await Promise.all([
      API.get("/marcas"),
      API.get("/tipos-vehiculo"),
      API.get("/usos-vehiculo"),
      API.get("/clasificaciones-vehiculo"),
    ]);
    setBrands(b.data);
    setTypes(t.data);
    setUses(u.data);
    setClassifications(c.data);
  };

  useEffect(() => {
    loadAll();
  }, []);

  useEffect(() => {
    const handler = () => setDarkMode(localStorage.getItem("darkMode") === "true");
    window.addEventListener("darkModeChange", handler);
    return () => window.removeEventListener("darkModeChange", handler);
  }, []);

  const filteredBrand = brands;
  const filteredType = types;
  const filteredUse = uses;
  const filteredClass = classifications;

  const bulkDelete = async (selected, endpoint, reload) => {
    if (selected.length === 0) return alert("Seleccione registros");
    if (!confirm("¿Eliminar seleccionados?")) return;
    await Promise.all(selected.map(id => API.delete(`/${endpoint}/${id}`)));
    reload();
  };

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-md-4 mb-4">
          <Section
              title="Marcas"
              items={filteredBrand}
              darkMode={darkMode}
              selected={selBrand}
            onToggleSelect={id => setSelBrand(s => s.includes(id) ? s.filter(i => i !== id) : [...s, id])}
            onToggleAll={() => setSelBrand(selBrand.length === filteredBrand.length ? [] : filteredBrand.map(p => p.id))}
            onBulkDelete={() => bulkDelete(selBrand, 'marcas', loadAll)}
            onDelete={async id => { if (confirm('¿Eliminar marca?')) { await API.delete(`/marcas/${id}`); loadAll(); } }}
            onEdit={p => { setEditBrand(p); setShowBrandModal(true); }}
              onCreate={() => { setEditBrand(null); setShowBrandModal(true); }}
              accentColor={accentColor}
            />
        </div>
        <div className="col-md-4 mb-4">
          <Section
            title="Tipo de Vehículo"
            items={filteredType}
            darkMode={darkMode}
            selected={selType}
            onToggleSelect={id => setSelType(s => s.includes(id) ? s.filter(i => i !== id) : [...s, id])}
            onToggleAll={() => setSelType(selType.length === filteredType.length ? [] : filteredType.map(p => p.id))}
            onBulkDelete={() => bulkDelete(selType, 'tipos-vehiculo', loadAll)}
            onDelete={async id => { if (confirm('¿Eliminar tipo?')) { await API.delete(`/tipos-vehiculo/${id}`); loadAll(); } }}
            onEdit={p => { setEditType(p); setShowTypeModal(true); }}
            onCreate={() => { setEditType(null); setShowTypeModal(true); }}
          />
        </div>
        <div className="col-md-4 mb-4">
          <Section
            title="Uso de Vehículo"
            items={filteredUse}
            darkMode={darkMode}
            selected={selUse}
            onToggleSelect={id => setSelUse(s => s.includes(id) ? s.filter(i => i !== id) : [...s, id])}
            onToggleAll={() => setSelUse(selUse.length === filteredUse.length ? [] : filteredUse.map(p => p.id))}
            onBulkDelete={() => bulkDelete(selUse, 'usos-vehiculo', loadAll)}
            onDelete={async id => { if (confirm('¿Eliminar uso?')) { await API.delete(`/usos-vehiculo/${id}`); loadAll(); } }}
           onEdit={p => { setEditUse(p); setShowUseModal(true); }}
              onCreate={() => { setEditUse(null); setShowUseModal(true); }}
              accentColor={accentColor}
            />
        </div>
      </div>

      <div className="row">
        <div className="col-md-4 mb-4">
          <Section
            title="Clasificación"
            items={filteredClass}
            darkMode={darkMode}
            selected={selClass}
            onToggleSelect={id => setSelClass(s => s.includes(id) ? s.filter(i => i !== id) : [...s, id])}
            onToggleAll={() => setSelClass(selClass.length === filteredClass.length ? [] : filteredClass.map(p => p.id))}
            onBulkDelete={() => bulkDelete(selClass, 'clasificaciones-vehiculo', loadAll)}
            onDelete={async id => { if (confirm('¿Eliminar clasificación?')) { await API.delete(`/clasificaciones-vehiculo/${id}`); loadAll(); } }}
            onEdit={p => { setEditClass(p); setShowClassModal(true); }}
              onCreate={() => { setEditClass(null); setShowClassModal(true); }}
              accentColor={accentColor}
            />
        </div>
      </div>

      {showBrandModal && (
        <BrandModal brand={editBrand} onClose={() => { setShowBrandModal(false); loadAll(); }} />
      )}
      {showTypeModal && (
        <VehicleTypeModal type={editType} onClose={() => { setShowTypeModal(false); loadAll(); }} />
      )}
      {showUseModal && (
        <VehicleUseModal useItem={editUse} onClose={() => { setShowUseModal(false); loadAll(); }} />
      )}
      {showClassModal && (
        <VehicleClassificationModal classification={editClass} onClose={() => { setShowClassModal(false); loadAll(); }} />
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