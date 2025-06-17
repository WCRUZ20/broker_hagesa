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
    return <span className={`badge bg-${item.color}`}>{item.label}</span>;
  };

  const renderStatusBadge = (status) => {
    const color = status === "Habilitado" ? "success" : "danger";
    return <span className={`badge bg-${color}`}>{status}</span>;
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex gap-2">
          <div className="dropdown">
            <button className="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
              Acción
            </button>
            <ul className="dropdown-menu">
              <li>
                <button
                  className="dropdown-item"
                  onClick={() => handleBulkAction("delete")}
                >
                  Eliminar usuarios
                </button>
              </li>
              <li>
                <button
                  className="dropdown-item"
                  onClick={() => handleBulkAction("disable")}
                >
                  Deshabilitar usuarios
                </button>
              </li>
              <li>
                <button
                  className="dropdown-item"
                  onClick={() => handleBulkAction("enable")}
                >
                  Habilitar usuarios
                </button>
              </li>
            </ul>
          </div>
          <div className="input-group">
            <span
              className={`input-group-text ${
                darkMode ? "bg-dark text-white border-secondary" : "bg-white"
              }`}
            >
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className={`form-control ${
                darkMode ? "bg-dark text-white border-secondary" : ""
              }`}
              placeholder="Buscar usuarios"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditingUser(null); setShowModal(true); }}>
          Nuevo Usuario
        </button>
      </div>

      <div className={`card shadow-sm ${darkMode ? "bg-dark text-white" : ""}`}>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table
              className={`table table-hover align-middle mb-0 ${
                darkMode ? "table-dark" : "table-striped"
              }`}
            >
            <thead className={darkMode ? "" : "table-light"}>
              <tr>
                 <th>
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={filteredUsers.length > 0 && selectedUsers.length === filteredUsers.length}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th style={{ width: "35%" }}>Usuario</th>
                <th style={{ width: "25%" }}>Cargo</th>
                <th style={{ width: "15%" }}>Rol</th>
                <th style={{ width: "15%" }}>Estado</th>
                <th style={{ width: "10%" }}></th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id}>
                  <td>
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => toggleSelectUser(user.id)}
                    />
                  </td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <img
                        src={user.user_photo || "/avatar.png"}
                        alt=""
                        width={40}
                        height={40}
                        className="rounded-circle"
                      />
                      <div>
                        <div className="fw-bold">{user.user_name} {user.last_name}</div>
                        <small>{user.user_email}</small>
                      </div>
                    </div>
                  </td>
                  <td>
                    {cargos.find((c) => c.id === user.user_position)?.Description || ""}
                  </td>
                  <td>{renderRolBadge(user.user_role)}</td>
                  <td>{renderStatusBadge(user.user_status)}</td>
                  <td>
                    <i
                      className="bi bi-pencil-square text-warning me-3"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleEdit(user)}
                    ></i>
                    <i
                      className="bi bi-trash text-danger"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleDelete(user.id)}
                    ></i>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>
      </div>

      {showModal && (
        <UsuarioModal
          user={editingUser}
          onClose={() => { setShowModal(false); fetchUsuarios(); }}
        />
      )}
    </div>
  );
}