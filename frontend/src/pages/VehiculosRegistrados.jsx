import { useEffect, useState } from "react";
import API from "../services/api";
import VehicleModal from "../components/VehicleModal";
import ListStyles from "../components/ListStyles";

export default function VehiculosRegistrados() {
  const [vehicles, setVehicles] = useState([]);
  const [brands, setBrands] = useState([]);
  const [types, setTypes] = useState([]);
  const [classifications, setClassifications] = useState([]);
  const [clients, setClients] = useState([]);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [selected, setSelected] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const loadVehicles = async () => {
    const res = await API.get("/vehiculos");
    setVehicles(res.data);
  };

  const loadLookups = async () => {
    const [b, t, c, cl] = await Promise.all([
      API.get("/marcas"),
      API.get("/tipos-vehiculo"),
      API.get("/clasificaciones-vehiculo"),
      API.get("/clientes"),
    ]);
    setBrands(b.data);
    setTypes(t.data);
    setClassifications(c.data);
    setClients(cl.data);
  };

  useEffect(() => {
    loadVehicles();
    loadLookups();
  }, []);

  useEffect(() => {
    const handler = () => {
      setDarkMode(localStorage.getItem("darkMode") === "true");
    };
    window.addEventListener("darkModeChange", handler);
    return () => window.removeEventListener("darkModeChange", handler);
  }, []);

  const handleEdit = (v) => {
    setEditing(v);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (confirm("¿Eliminar vehículo?")) {
      await API.delete(`/vehiculos/${id}`);
      loadVehicles();
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
      return alert("Seleccione al menos un vehículo");
    if (!confirm("¿Eliminar vehículos seleccionados?")) return;
    Promise.all(selected.map((id) => API.delete(`/vehiculos/${id}`))).then(() => {
      setSelected([]);
      loadVehicles();
    });
  };

  const filtered = vehicles.filter(
    (v) =>
      v.Model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.Plate.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container-fluid py-4 px-4">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className={`mb-1 fw-bold ${darkMode ? 'text-white' : 'text-dark'}`}>Vehículos Registrados</h2>
              <p className={`mb-0 ${darkMode ? 'text-muted' : 'text-secondary'}`}>Gestiona la lista de vehículos registrados</p>
            </div>
            <button
              className="btn btn-primary px-4 py-2 rounded-3 shadow-sm d-flex align-items-center gap-2"
              onClick={() => { setEditing(null); setShowModal(true); }}
              style={{ fontWeight: '500', transition: 'all 0.3s ease', border: 'none' }}
            >
              <i className="bi bi-plus-lg"></i>
     Nuevo Vehículo
            </button>
          </div>
        </div>
      </div>

      {/* Controls */}
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
                            Eliminar vehículos
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

                <div className="col-md-4">
                  <div className="position-relative">
                    <i className={`bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 ${darkMode ? 'text-muted' : 'text-secondary'}`} style={{ fontSize: '1rem' }}></i>
                    <input
                      type="text"
                      className={`form-control rounded-3 border-0 shadow-sm ps-5 py-2 ${darkMode ? 'bg-secondary text-white' : 'bg-light'}`}
                      placeholder="Buscar vehículos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{ fontSize: '0.95rem', transition: 'all 0.3s ease' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="row">
        <div className="col-12">
          <div className={`card border-0 shadow-sm ${darkMode ? 'bg-dark' : 'bg-white'}`}>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className={`table table-hover align-middle mb-0 ${darkMode ? 'table-dark' : ''}`}>
                  <thead className={`${darkMode ? 'border-secondary' : 'bg-light border-0'}`}>
                    <tr style={{ fontSize: '0.9rem', fontWeight: '600' }}>
                      <th className="ps-4 py-3 border-0">
                        <input
                          type="checkbox"
                          className="form-check-input rounded"
                          checked={filtered.length > 0 && selected.length === filtered.length}
                          onChange={toggleSelectAll}
                          style={{ transform: 'scale(1.1)' }}
                        />
                      </th>
                      <th className="py-3 border-0">Marca</th>
                      <th className="py-3 border-0">Modelo</th>
                      <th className="py-3 border-0">Tipo</th>
                      <th className="py-3 border-0">Clasif.</th>
                      <th className="py-3 border-0">Año</th>
                      <th className="py-3 border-0">Placa</th>
                      <th className="py-3 border-0">Propietario</th>
                      <th className="py-3 border-0 text-center"><i className="bi bi-gear"></i></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((v) => (
                      <tr key={v.id} className={`${darkMode ? 'border-secondary' : ''}`} style={{ transition: 'all 0.2s ease', fontSize: '0.95rem' }}>
                        <td className="ps-4 py-3 border-0">
                          <input
                            type="checkbox"
                            className="form-check-input rounded"
                            checked={selected.includes(v.id)}
                            onChange={() => toggleSelect(v.id)}
                            style={{ transform: 'scale(1.1)' }}
                          />
                        </td>
                        <td className="py-3 border-0">{brands.find(b => b.id === v.Brand)?.Description || ''}</td>
                        <td className="py-3 border-0">{v.Model}</td>
                        <td className="py-3 border-0">{types.find(t => t.id === v.id_itm_type)?.Description || ''}</td>
                        <td className="py-3 border-0">{classifications.find(c => c.id === v.Clasification)?.Description || ''}</td>
                        <td className="py-3 border-0">{v.YearItem}</td>
                        <td className="py-3 border-0">{v.Plate}</td>
                        <td className="py-3 border-0">{clients.find(cl => cl.id === v.Propetary)?.nombre || ''}</td>
                        <td className="py-3 border-0 text-center">
                          <div className="d-flex justify-content-center gap-2">
                            <button className="btn btn-sm btn-outline-primary rounded-circle p-2" onClick={() => handleEdit(v)} style={{ width: '36px', height: '36px', transition: 'all 0.3s ease' }} title="Editar vehículo">
                              <i className="bi bi-pencil-square" style={{ fontSize: '0.875rem' }}></i>
                            </button>
                            <button className="btn btn-sm btn-outline-danger rounded-circle p-2" onClick={() => handleDelete(v.id)} style={{ width: '36px', height: '36px', transition: 'all 0.3s ease' }} title="Eliminar vehículo">
                              <i className="bi bi-trash" style={{ fontSize: '0.875rem' }}></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr>
                        <td colSpan="9" className="text-center py-5">
                          <div className={`text-muted ${darkMode ? 'text-secondary' : ''}`}>
                            <i className="bi bi-search mb-3" style={{ fontSize: '2rem' }}></i>
                            <p className="mb-0">No se encontraron vehículos</p>
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
      </div>

      {showModal && (
        <VehicleModal
          vehicle={editing}
          onClose={() => {
            setShowModal(false);
            loadVehicles();
            loadLookups();
          }}
        />
      )}

      <ListStyles darkMode={darkMode} />
    </div>
  );
}