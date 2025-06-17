import { useEffect, useState } from "react";
import API from "../services/api";
import UsuarioModal from "../components/UsuarioModal";

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [cargos, setCargos] = useState([]);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsuarios = async () => {
    try {
      const res = await API.get("/users");
      setUsuarios(res.data);
    } catch (err) {
      console.error("Error cargando usuarios:", err);
    }
  };

  const fetchCargos = async () => {
    try {
      const res = await API.get("/cargos");
      setCargos(res.data);
    } catch (err) {
      console.error("Error cargando cargos:", err);
    }
  };

  useEffect(() => {
    fetchUsuarios();
    fetchCargos();
  }, []);

  useEffect(() => {
    const handler = () => {
      setDarkMode(localStorage.getItem("darkMode") === "true");
    };
    window.addEventListener("darkModeChange", handler);
    return () => window.removeEventListener("darkModeChange", handler);
  }, []);

  const handleEdit = (user) => {
    setEditingUser(user);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (confirm("¿Eliminar este usuario?")) {
      await API.delete(`/users/${id}`);
      fetchUsuarios();
    }
  };

  const toggleSelectUser = (id) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map((u) => u.id));
    }
  };

  const handleBulkAction = (action) => {
    if (selectedUsers.length === 0)
      return alert("Seleccione al menos un usuario");

    let request;
    if (action === "delete") {
      if (!confirm("¿Eliminar usuarios seleccionados?")) return;
      request = Promise.all(
        selectedUsers.map((id) => API.delete(`/users/${id}`))
      );
    } else if (action === "disable") {
      request = Promise.all(
        selectedUsers.map((id) =>
          API.put(`/users/${id}`, { user_status: "Deshabilitado" })
        )
      );
    } else if (action === "enable") {
      request = Promise.all(
        selectedUsers.map((id) =>
          API.put(`/users/${id}`, { user_status: "Habilitado" })
        )
      );
    }

    if (request) {
      request.then(() => {
        setSelectedUsers([]);
        fetchUsuarios();
      });
    }
  };

  const filteredUsers = usuarios.filter(u =>
    u.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.user_cod.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.user_email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderRolBadge = (rol) => {
    const map = {
      A: { label: "Administrador", color: "primary" },
      R: { label: "Regular", color: "secondary" },
      S: { label: "Soporte", color: "info" },
      C: { label: "Cliente", color: "success" }
    };
    const item = map[rol] || { label: rol, color: "dark" };
    return (
      <span 
        className={`badge bg-${item.color} px-3 py-2 rounded-pill fw-normal`}
        style={{ fontSize: '0.875rem', letterSpacing: '0.5px' }}
      >
        {item.label}
      </span>
    );
  };

  const renderStatusBadge = (status) => {
    const color = status === "Habilitado" ? "success" : "danger";
    const icon = status === "Habilitado" ? "bi-check-circle" : "bi-x-circle";
    return (
      <span 
        className={`badge bg-${color} px-3 py-2 rounded-pill fw-normal d-flex align-items-center gap-1`}
        style={{ fontSize: '0.875rem', letterSpacing: '0.5px', width: 'fit-content' }}
      >
        <i className={`bi ${icon}`} style={{ fontSize: '0.8rem' }}></i>
        {status}
      </span>
    );
  };

  return (
    <div className="container-fluid py-4 px-4">
      {/* Header Section */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className={`mb-1 fw-bold ${darkMode ? 'text-white' : 'text-dark'}`}>
                Gestión de Usuarios
              </h2>
              <p className={`mb-0 ${darkMode ? 'text-muted' : 'text-secondary'}`}>
                Administra y controla el acceso de usuarios al sistema
              </p>
            </div>
            <button 
              className="btn btn-primary px-4 py-2 rounded-3 shadow-sm d-flex align-items-center gap-2"
              onClick={() => { setEditingUser(null); setShowModal(true); }}
              style={{ 
                fontWeight: '500',
                transition: 'all 0.3s ease',
                border: 'none'
              }}
            >
              <i className="bi bi-plus-lg"></i>
              Nuevo Usuario
            </button>
          </div>
        </div>
      </div>

      {/* Controls Section */}
      <div className="row mb-4">
        <div className="col-12">
          <div className={`card border-0 shadow-sm ${darkMode ? 'bg-dark' : 'bg-white'}`}>
            <div className="card-body py-3">
              <div className="row align-items-center">
                <div className="col-md-8">
                  <div className="d-flex gap-3 align-items-center">
                    {/* Bulk Actions Dropdown */}
                    <div className="dropdown">
                      <button 
                        className={`btn btn-outline-secondary dropdown-toggle px-3 py-2 rounded-3 ${
                          darkMode ? 'border-secondary text-light' : ''
                        }`}
                        type="button" 
                        data-bs-toggle="dropdown"
                        style={{ 
                          fontWeight: '500',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <i className="bi bi-three-dots me-2"></i>
                        Acciones
                      </button>
                      <ul className={`dropdown-menu shadow-lg border-0 ${darkMode ? 'dropdown-menu-dark' : ''}`}>
                        <li>
                          <button
                            className="dropdown-item py-2 px-3 d-flex align-items-center gap-2"
                            onClick={() => handleBulkAction("delete")}
                          >
                            <i className="bi bi-trash text-danger"></i>
                            Eliminar usuarios
                          </button>
                        </li>
                        <li><hr className="dropdown-divider" /></li>
                        <li>
                          <button
                            className="dropdown-item py-2 px-3 d-flex align-items-center gap-2"
                            onClick={() => handleBulkAction("disable")}
                          >
                            <i className="bi bi-x-circle text-warning"></i>
                            Deshabilitar usuarios
                          </button>
                        </li>
                        <li>
                          <button
                            className="dropdown-item py-2 px-3 d-flex align-items-center gap-2"
                            onClick={() => handleBulkAction("enable")}
                          >
                            <i className="bi bi-check-circle text-success"></i>
                            Habilitar usuarios
                          </button>
                        </li>
                      </ul>
                    </div>

                    {/* Selected Count */}
                    {selectedUsers.length > 0 && (
                      <div className={`badge bg-primary px-3 py-2 rounded-pill ${darkMode ? '' : ''}`}>
                        {selectedUsers.length} seleccionado{selectedUsers.length !== 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="col-md-4">
                  {/* Search Input */}
                  <div className="position-relative">
                    <i 
                      className={`bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 ${
                        darkMode ? 'text-muted' : 'text-secondary'
                      }`}
                      style={{ fontSize: '1rem' }}
                    ></i>
                    <input
                      type="text"
                      className={`form-control rounded-3 border-0 shadow-sm ps-5 py-2 ${
                        darkMode ? 'bg-secondary text-white' : 'bg-light'
                      }`}
                      placeholder="Buscar usuarios..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{ 
                        fontSize: '0.95rem',
                        transition: 'all 0.3s ease'
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
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
                          checked={filteredUsers.length > 0 && selectedUsers.length === filteredUsers.length}
                          onChange={toggleSelectAll}
                          style={{ transform: 'scale(1.1)' }}
                        />
                      </th>
                      <th className="py-3 border-0" style={{ width: "35%" }}>
                        <div className="d-flex align-items-center gap-2">
                          <i className="bi bi-person-circle"></i>
                          Usuario
                        </div>
                      </th>
                      <th className="py-3 border-0" style={{ width: "25%" }}>
                        <div className="d-flex align-items-center gap-2">
                          <i className="bi bi-briefcase"></i>
                          Cargo
                        </div>
                      </th>
                      <th className="py-3 border-0" style={{ width: "15%" }}>
                        <div className="d-flex align-items-center gap-2">
                          <i className="bi bi-shield-check"></i>
                          Rol
                        </div>
                      </th>
                      <th className="py-3 border-0" style={{ width: "15%" }}>
                        <div className="d-flex align-items-center gap-2">
                          <i className="bi bi-activity"></i>
                          Estado
                        </div>
                      </th>
                      <th className="py-3 border-0 text-center" style={{ width: "10%" }}>
                        <i className="bi bi-gear"></i>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user, index) => (
                      <tr 
                        key={user.id}
                        className={`${darkMode ? 'border-secondary' : ''}`}
                        style={{ 
                          transition: 'all 0.2s ease',
                          fontSize: '0.95rem'
                        }}
                      >
                        <td className="ps-4 py-3 border-0">
                          <input
                            type="checkbox"
                            className="form-check-input rounded"
                            checked={selectedUsers.includes(user.id)}
                            onChange={() => toggleSelectUser(user.id)}
                            style={{ transform: 'scale(1.1)' }}
                          />
                        </td>
                        <td className="py-3 border-0">
                          <div className="d-flex align-items-center gap-3">
                            <div className="position-relative">
                              <img
                                src={user.user_photo || "/avatar.png"}
                                alt=""
                                width={48}
                                height={48}
                                className="rounded-circle shadow-sm"
                                style={{ 
                                  objectFit: 'cover',
                                  border: '2px solid rgba(0,123,255,0.1)'
                                }}
                              />
                              <div 
                                className={`position-absolute bottom-0 end-0 rounded-circle border-2 ${
                                  darkMode ? 'border-dark' : 'border-white'
                                } ${user.user_status === 'Habilitado' ? 'bg-success' : 'bg-danger'}`}
                                style={{ 
                                  width: '12px', 
                                  height: '12px',
                                  right: '2px',
                                  bottom: '2px'
                                }}
                              ></div>
                            </div>
                            <div>
                              <div className={`fw-semibold mb-1 ${darkMode ? 'text-white' : 'text-dark'}`}>
                                {user.user_name} {user.last_name}
                              </div>
                              <div className={`small ${darkMode ? 'text-white' : 'text-dark'}`}>
                                {user.user_email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 border-0">
                          <div className={`fw-medium ${darkMode ? 'text-light' : 'text-dark'}`}>
                            {cargos.find((c) => c.id === user.user_position)?.Description || 
                             <span className="text-muted fst-italic">Sin asignar</span>}
                          </div>
                        </td>
                        <td className="py-3 border-0">
                          {renderRolBadge(user.user_role)}
                        </td>
                        <td className="py-3 border-0">
                          {renderStatusBadge(user.user_status)}
                        </td>
                        <td className="py-3 border-0 text-center">
                          <div className="d-flex justify-content-center gap-2">
                            <button
                              className="btn btn-sm btn-outline-primary rounded-circle p-2"
                              onClick={() => handleEdit(user)}
                              style={{ 
                                width: '36px', 
                                height: '36px',
                                transition: 'all 0.3s ease'
                              }}
                              title="Editar usuario"
                            >
                              <i className="bi bi-pencil-square" style={{ fontSize: '0.875rem' }}></i>
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger rounded-circle p-2"
                              onClick={() => handleDelete(user.id)}
                              style={{ 
                                width: '36px', 
                                height: '36px',
                                transition: 'all 0.3s ease'
                              }}
                              title="Eliminar usuario"
                            >
                              <i className="bi bi-trash" style={{ fontSize: '0.875rem' }}></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredUsers.length === 0 && (
                      <tr>
                        <td colSpan="6" className="text-center py-5">
                          <div className={`text-muted ${darkMode ? 'text-secondary' : ''}`}>
                            <i className="bi bi-search mb-3" style={{ fontSize: '2rem' }}></i>
                            <p className="mb-0">No se encontraron usuarios que coincidan con la búsqueda</p>
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

      {/* Modal */}
      {showModal && (
        <UsuarioModal
          user={editingUser}
          onClose={() => { setShowModal(false); fetchUsuarios(); }}
        />
      )}

      {/* Custom Styles */}
      <style jsx>{`
        .btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
        }
        
        .table tbody tr:hover {
          background-color: ${darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,123,255,0.05)'} !important;
        }
        
        .btn-outline-primary:hover {
          background-color: var(--bs-primary);
          border-color: var(--bs-primary);
          color: white;
        }
        
        .btn-outline-danger:hover {
          background-color: var(--bs-danger);
          border-color: var(--bs-danger);
          color: white;
        }
        
        .form-control:focus {
          border-color: var(--bs-primary);
          box-shadow: 0 0 0 0.2rem rgba(0,123,255,0.25);
        }
        
        .dropdown-item:hover {
          background-color: ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,123,255,0.1)'};
        }
      `}</style>
    </div>
  );
}