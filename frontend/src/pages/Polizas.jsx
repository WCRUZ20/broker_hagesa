import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import ListStyles from "../components/ListStyles";

export default function Polizas() {
  const [items, setItems] = useState([]);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );
  const [selected, setSelected] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const loadItems = async () => {
    const res = await API.get("/polizas");
    setItems(res.data);
  };

  const handleEdit = (p) => {
    navigate(`/editar-poliza/${p.id}`);
  };

  const handleDelete = async (id) => {
    if (confirm("¿Eliminar póliza?")) {
      await API.delete(`/polizas/${id}`);
      loadItems();
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
    if (selected.length === 0) return alert("Seleccione al menos una póliza");
    if (!confirm("¿Eliminar pólizas seleccionadas?")) return;
    Promise.all(selected.map((id) => API.delete(`/polizas/${id}`))).then(() => {
      setSelected([]);
      loadItems();
    });
  };

  useEffect(() => {
    loadItems();
  }, []);

  useEffect(() => {
    const handler = () => {
      setDarkMode(localStorage.getItem("darkMode") === "true");
    };
    window.addEventListener("darkModeChange", handler);
    return () => window.removeEventListener("darkModeChange", handler);
  }, []);

  const filtered = items.filter(
    (p) =>
      p.PolicyNum.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.DocType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.InsuranceName || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container-fluid py-4 px-4">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className={`mb-1 fw-bold ${darkMode ? 'text-white' : 'text-dark'}`}>Listado de Pólizas</h2>
              <p className={`mb-0 ${darkMode ? 'text-muted' : 'text-secondary'}`}>Gestiona las pólizas registradas</p>
            </div>
            <button className="btn btn-primary px-4 py-2 rounded-3 shadow-sm d-flex align-items-center gap-2" onClick={() => navigate("/crear-poliza")} style={{ fontWeight: '500', transition: 'all 0.3s ease', border: 'none' }}>
              <i className="bi bi-plus-lg"></i>
              Nueva Póliza
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
                      <button className={`btn btn-outline-secondary dropdown-toggle px-3 py-2 rounded-3 ${darkMode ? 'border-secondary text-light' : ''}`} type="button" data-bs-toggle="dropdown" style={{ fontWeight: '500', transition: 'all 0.3s ease' }}>
                        <i className="bi bi-three-dots me-2"></i>
                        Acciones
                      </button>
                      <ul className={`dropdown-menu shadow-lg border-0 ${darkMode ? 'dropdown-menu-dark' : ''}`}>
                        <li>
                          <button className="dropdown-item py-2 px-3 d-flex align-items-center gap-2" onClick={handleBulkDelete}>
                            <i className="bi bi-trash text-danger"></i>
                            Eliminar pólizas
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
                      placeholder="Buscar pólizas..."
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
                      <th className="py-3 border-0">Aseguradora</th>
                      <th className="py-3 border-0">Número</th>
                      <th className="py-3 border-0">Póliza Rel.</th>
                      <th className="py-3 border-0">Tipo</th>
                      <th className="py-3 border-0">% Comisión</th>
                      <th className="py-3 border-0">Inicio</th>
                      <th className="py-3 border-0">Vencimiento</th>
                      <th className="py-3 border-0">Valor Asegurado</th>
                      <th className="py-3 border-0">Activo</th>
                      <th className="py-3 border-0">Días vencidos</th>
                      <th className="py-3 border-0 text-center"><i className="bi bi-gear"></i></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((p) => (
                      <tr key={p.id} className={`${darkMode ? 'border-secondary' : ''}`} style={{ transition: 'all 0.2s ease', fontSize: '0.95rem' }}>
                        <td className="ps-4 py-3 border-0">
                          <input
                            type="checkbox"
                            className="form-check-input rounded"
                            checked={selected.includes(p.id)}
                            onChange={() => toggleSelect(p.id)}
                            style={{ transform: 'scale(1.1)' }}
                          />
                        </td>
                        <td className="py-3 border-0">{p.InsuranceName}</td>
                        <td className="py-3 border-0">{p.PolicyNum}</td>
                        <td className="py-3 border-0">{p.RelatedPolicyNum}</td>
                        <td className="py-3 border-0">{p.DocType}</td>
                        <td className="py-3 border-0">{p.ComiPrcnt}</td>
                        <td className="py-3 border-0">{p.InitDate}</td>
                        <td className="py-3 border-0">{p.DueDate}</td>
                        <td className="py-3 border-0">{p.AscValue}</td>
                        <td className="py-3 border-0">{p.activo}</td>
                        <td className="py-3 border-0">{p.DaysOverdue}</td>
                        <td className="py-3 border-0 text-center">
                          <div className="d-flex justify-content-center gap-2">
                            <button className="btn btn-sm btn-outline-primary rounded-circle p-2" onClick={() => handleEdit(p)} style={{ width: '36px', height: '36px', transition: 'all 0.3s ease' }} title="Editar">
                              <i className="bi bi-pencil-square" style={{ fontSize: '0.875rem' }}></i>
                            </button>
                            <button className="btn btn-sm btn-outline-danger rounded-circle p-2" onClick={() => handleDelete(p.id)} style={{ width: '36px', height: '36px', transition: 'all 0.3s ease' }} title="Eliminar">
                              <i className="bi bi-trash" style={{ fontSize: '0.875rem' }}></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr>
                        <td colSpan="12" className="text-center py-5">
                          <div className={`text-muted ${darkMode ? 'text-secondary' : ''}`}>
                            <i className="bi bi-search mb-3" style={{ fontSize: '2rem' }}></i>
                            <p className="mb-0">No se encontraron pólizas</p>
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

      <ListStyles darkMode={darkMode} />
    </div>
  );
}
