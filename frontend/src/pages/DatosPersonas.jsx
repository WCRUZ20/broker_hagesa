import { useEffect, useState } from "react";
import API from "../services/api";
import IdentificationTypeModal from "../components/IdentificationTypeModal";
import CargoModal from "../components/CargoModal";
import ListStyles from "../components/ListStyles";

export default function DatosPersonas() {
  const [types, setTypes] = useState([]);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );
  const accentColor = "rgb(200, 150, 82)";
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [selected, setSelected] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Estados para cargos
  const [cargos, setCargos] = useState([]);
  const [showCargoModal, setShowCargoModal] = useState(false);
  const [editingCargo, setEditingCargo] = useState(null);
  const [selectedCargos, setSelectedCargos] = useState([]);
  const [searchCargo, setSearchCargo] = useState("");
  const [currentCargoPage, setCurrentCargoPage] = useState(1);
  const cargosPerPage = 5;


  const loadTypes = async () => {
    try {
      const res = await API.get("/tipos-identificacion");
      setTypes(res.data);
    } catch (err) {
      console.error("Error cargando tipos:", err);
    }
  };

  const loadCargos = async () => {
    try {
      const res = await API.get("/cargos");
      setCargos(res.data);
    } catch (err) {
      console.error("Error cargando cargos:", err);
    }
  };

  useEffect(() => {
    loadTypes();
    loadCargos();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, types]);

  useEffect(() => {
    setCurrentCargoPage(1);
  }, [searchCargo, cargos]);

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

  // Funciones para manejo de cargos
  const handleEditarCargo = (cargo) => {
    setEditingCargo(cargo);
    setShowCargoModal(true);
  };

  const handleEliminarCargo = async (id) => {
    if (confirm("¿Eliminar cargo?")) {
      await API.delete(`/cargos/${id}`);
      loadCargos();
    }
  };

  const toggleSelectCargo = (id) => {
    setSelectedCargos((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAllCargos = () => {
    if (selectedCargos.length === cargosFiltered.length) {
      setSelectedCargos([]);
    } else {
      setSelectedCargos(cargosFiltered.map((c) => c.id));
    }
  };

  const handleBulkDeleteCargos = () => {
    if (selectedCargos.length === 0) return alert("Seleccione al menos un cargo");
    if (!confirm("¿Eliminar cargos seleccionados?")) return;
    Promise.all(selectedCargos.map((id) => API.delete(`/cargos/${id}`))).then(() => {
      setSelectedCargos([]);
      loadCargos();
    });
  };

  const filtered = types.filter((c) =>
    c.Description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.id.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const cargosFiltered = cargos.filter((c) =>
    c.Description.toLowerCase().includes(searchCargo.toLowerCase())
  );
  const cargosTotalPages = Math.ceil(cargosFiltered.length / cargosPerPage) || 1;
  const paginatedCargos = cargosFiltered.slice(
    (currentCargoPage - 1) * cargosPerPage,
    currentCargoPage * cargosPerPage
  );

  return (
    <div className="container-fluid py-4 px-4">
      <div className="row">
        <div className="col-lg-6 mb-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className={`mb-1 fw-bold ${darkMode ? 'text-white' : 'text-dark'}`}>Datos de Personas</h2>
              <p className={`mb-0 ${darkMode ? 'text-muted' : 'text-secondary'}`}>Tipos de identificación</p>
            </div>
            <button
              className="btn px-4 py-2 rounded-3 shadow-sm d-flex align-items-center gap-2"
              onClick={() => { setEditing(null); setShowModal(true); }}
              style={{
                fontWeight: '500',
                transition: 'all 0.3s ease',
                backgroundColor: accentColor,
                borderColor: accentColor,
                color: '#fff'
              }}
            >
              <i className="bi bi-plus-lg"></i>
              Nuevo Tipo
            </button>
          </div>

        <div className={`card border-0 shadow-sm mb-4 ${darkMode ? 'bg-dark' : 'bg-white'}`}>
            <div className="card-body py-3">
              <div className="row align-items-center">
                <div className="col-md-8">
                  <div className="d-flex gap-3 align-items-center">
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
                        <i className="bi bi-three-dots me-2"></i>
                        Acciones
                      </button>
                      <ul className={`dropdown-menu shadow-lg border-0 ${darkMode ? 'dropdown-menu-dark' : ''}`}>
                        <li>
                          <button className="dropdown-item py-2 px-3 d-flex align-items-center gap-2" onClick={handleBulkDelete}>
                            <i className="bi bi-trash text-danger"></i>
                            Eliminar tipos
                          </button>
                        </li>
                      </ul>
                    </div>

                    {selected.length > 0 && (
                      <div
                        className="badge px-3 py-2 rounded-pill"
                        style={{
                          backgroundColor: 'rgba(200,150,82,0.15)',
                          color: accentColor
                        }}
                      >
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
                      placeholder="Buscar tipos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{ fontSize: '0.95rem', transition: 'all 0.3s ease' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        
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
                      <th className="py-3 border-0">ID</th>
                      <th className="py-3 border-0">Descripción</th>
                      <th className="py-3 border-0 text-center"><i className="bi bi-gear"></i></th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.map((c) => (
                      <tr key={c.id} className={`${darkMode ? 'border-secondary' : ''}`} style={{ transition: 'all 0.2s ease', fontSize: '0.95rem' }}>
                        <td className="ps-4 py-3 border-0">
                          <input
                            type="checkbox"
                            className="form-check-input rounded"
                            checked={selected.includes(c.id)}
                            onChange={() => toggleSelect(c.id)}
                            style={{ transform: 'scale(1.1)' }}
                          />
                        </td>
                        <td className="py-3 border-0">{c.id}</td>
                        <td className="py-3 border-0">{c.Description}</td>
                        <td className="py-3 border-0 text-center">
                          <div className="d-flex justify-content-center gap-2">
                            <button className="btn btn-sm btn-outline-primary rounded-circle p-2" onClick={() => handleEditar(c)} style={{ width: '36px', height: '36px', transition: 'all 0.3s ease' }} title="Editar">
                              <i className="bi bi-pencil-square" style={{ fontSize: '0.875rem' }}></i>
                            </button>
                            <button className="btn btn-sm btn-outline-danger rounded-circle p-2" onClick={() => handleEliminar(c.id)} style={{ width: '36px', height: '36px', transition: 'all 0.3s ease' }} title="Eliminar">
                              <i className="bi bi-trash" style={{ fontSize: '0.875rem' }}></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr>
                        <td colSpan="4" className="text-center py-5">
                          <div className={`text-muted ${darkMode ? 'text-secondary' : ''}`}>
                            <i className="bi bi-search mb-3" style={{ fontSize: '2rem' }}></i>
                            <p className="mb-0">No hay tipos registrados.</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="d-flex justify-content-between align-items-center p-3">
                <div className="hint-text">
                  Mostrando <b>{filtered.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}</b>
                  -<b>{Math.min(currentPage * itemsPerPage, filtered.length)}</b>{" de "}
                  <b>{filtered.length}</b> tipos
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
      <div className="col-lg-6 mb-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className={`mb-1 fw-bold ${darkMode ? 'text-white' : 'text-dark'}`}>Cargos de Usuarios</h2>
              <p className={`mb-0 ${darkMode ? 'text-muted' : 'text-secondary'}`}>Gestión de cargos asignables</p>
            </div>
            <button
              className="btn px-4 py-2 rounded-3 shadow-sm d-flex align-items-center gap-2"
              onClick={() => { setEditingCargo(null); setShowCargoModal(true); }}
              style={{
                fontWeight: '500',
                transition: 'all 0.3s ease',
                backgroundColor: accentColor,
                borderColor: accentColor,
                color: '#fff'
              }}
            >
              <i className="bi bi-plus-lg"></i>
              Nuevo Cargo
            </button>
          </div>
        
        <div className={`card border-0 shadow-sm mb-4 ${darkMode ? 'bg-dark' : 'bg-white'}`}>
            <div className="card-body py-3">
              <div className="row align-items-center">
                <div className="col-md-8">
                  <div className="d-flex gap-3 align-items-center">
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
                        }}>
                        <i className="bi bi-three-dots me-2"></i>
                        Acciones
                      </button>
                      <ul className={`dropdown-menu shadow-lg border-0 ${darkMode ? 'dropdown-menu-dark' : ''}`}>
                        <li>
                          <button className="dropdown-item py-2 px-3 d-flex align-items-center gap-2" onClick={handleBulkDeleteCargos}>
                            <i className="bi bi-trash text-danger"></i>
                            Eliminar cargos
                          </button>
                        </li>
                      </ul>
                    </div>

                    {selectedCargos.length > 0 && (
                      <div
                        className="badge px-3 py-2 rounded-pill"
                        style={{
                          backgroundColor: 'rgba(200,150,82,0.15)',
                          color: accentColor
                        }}
                      >
                        {selectedCargos.length} seleccionado{selectedCargos.length !== 1 ? 's' : ''}
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
                      placeholder="Buscar cargos..."
                      value={searchCargo}
                      onChange={(e) => setSearchCargo(e.target.value)}
                      style={{ fontSize: '0.95rem', transition: 'all 0.3s ease' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        
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
                          checked={cargosFiltered.length > 0 && selectedCargos.length === cargosFiltered.length}
                          onChange={toggleSelectAllCargos}
                          style={{ transform: 'scale(1.1)' }}
                        />
                      </th>
                      <th className="py-3 border-0">ID</th>
                      <th className="py-3 border-0">Descripción</th>
                      <th className="py-3 border-0 text-center"><i className="bi bi-gear"></i></th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedCargos.map((c) => (
                      <tr key={c.id} className={`${darkMode ? 'border-secondary' : ''}`} style={{ transition: 'all 0.2s ease', fontSize: '0.95rem' }}>
                        <td className="ps-4 py-3 border-0">
                          <input
                            type="checkbox"
                            className="form-check-input rounded"
                            checked={selectedCargos.includes(c.id)}
                            onChange={() => toggleSelectCargo(c.id)}
                            style={{ transform: 'scale(1.1)' }}
                          />
                        </td>
                        <td className="py-3 border-0">{c.id}</td>
                        <td className="py-3 border-0">{c.Description}</td>
                        <td className="py-3 border-0 text-center">
                          <div className="d-flex justify-content-center gap-2">
                            <button className="btn btn-sm btn-outline-primary rounded-circle p-2" onClick={() => handleEditarCargo(c)} style={{ width: '36px', height: '36px', transition: 'all 0.3s ease' }} title="Editar">
                              <i className="bi bi-pencil-square" style={{ fontSize: '0.875rem' }}></i>
                            </button>
                            <button className="btn btn-sm btn-outline-danger rounded-circle p-2" onClick={() => handleEliminarCargo(c.id)} style={{ width: '36px', height: '36px', transition: 'all 0.3s ease' }} title="Eliminar">
                              <i className="bi bi-trash" style={{ fontSize: '0.875rem' }}></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {cargosFiltered.length === 0 && (
                      <tr>
                        <td colSpan="4" className="text-center py-5">
                          <div className={`text-muted ${darkMode ? 'text-secondary' : ''}`}>
                            <i className="bi bi-search mb-3" style={{ fontSize: '2rem' }}></i>
                            <p className="mb-0">No hay cargos registrados.</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="d-flex justify-content-between align-items-center p-3">
                <div className="hint-text">
                  Mostrando <b>{cargosFiltered.length === 0 ? 0 : (currentCargoPage - 1) * cargosPerPage + 1}</b>
                  -<b>{Math.min(currentCargoPage * cargosPerPage, cargosFiltered.length)}</b>{" de "}
                  <b>{cargosFiltered.length}</b> cargos
                </div>
                <ul className="pagination mb-0">
                  <li className={`page-item ${currentCargoPage === 1 ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => setCurrentCargoPage(currentCargoPage - 1)}>Anterior</button>
                  </li>
                  {Array.from({ length: cargosTotalPages }, (_, i) => (
                    <li key={i} className={`page-item ${currentCargoPage === i + 1 ? 'active' : ''}`}>
                      <button className="page-link" onClick={() => setCurrentCargoPage(i + 1)}>{i + 1}</button>
                    </li>
                  ))}
                  <li className={`page-item ${currentCargoPage === cargosTotalPages ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => setCurrentCargoPage(currentCargoPage + 1)}>Siguiente</button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          {showCargoModal && (
            <CargoModal
              cargo={editingCargo}
              onClose={() => {
                setShowCargoModal(false);
                loadCargos();
              }}
            />
          )}
        </div>
      </div>

      <ListStyles darkMode={darkMode} accentColor={accentColor} />
    </div>
  );
}