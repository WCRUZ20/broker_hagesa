import { useEffect, useState } from "react";
import API from "../services/api";
import BrandModal from "../components/BrandModal";
import VehicleTypeModal from "../components/VehicleTypeModal";
import VehicleUseModal from "../components/VehicleUseModal";

export default function DatosVehiculos() {
  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "true");

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

  const loadAll = async () => {
    const [b, t, u] = await Promise.all([
      API.get("/marcas"),
      API.get("/tipos-vehiculo"),
      API.get("/usos-vehiculo"),
    ]);
    setBrands(b.data);
    setTypes(t.data);
    setUses(u.data);
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
    </div>
  );
}

function Section({ title, items, darkMode, selected, onToggleSelect, onToggleAll, onBulkDelete, onDelete, onEdit, onCreate }) {
  const [search, setSearch] = useState("");
  const filtered = items.filter(i => i.Description.toLowerCase().includes(search.toLowerCase()) || String(i.id).includes(search));

  useEffect(() => { setSearch(""); }, [items]);

  return (
    <div>
      <h5 className="mb-2 fw-bold">{title}</h5>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <div className="d-flex gap-2">
          <div className="dropdown">
            <button className="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
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
        <button className="btn btn-primary" onClick={onCreate}>Nuevo</button>
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
                {filtered.map(i => (
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
        </div>
      </div>
    </div>
  );
}