import { useEffect, useState } from "react";
import API from "../services/api";
import UsuarioModal from "../components/UsuarioModal";

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
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

  useEffect(() => {
    fetchUsuarios();
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

  const handleBulkAction = (action) => {
    if (selectedUsers.length === 0) return alert("Seleccione al menos un usuario");
    if (action === "delete") {
      if (confirm("¿Eliminar usuarios seleccionados?")) {
        Promise.all(selectedUsers.map(id => API.delete(`/users/${id}`))).then(fetchUsuarios);
      }
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
              <li><button className="dropdown-item" onClick={() => handleBulkAction("delete")}>Eliminar usuario</button></li>
            </ul>
          </div>
          <div className="input-group">
            <span className="input-group-text bg-white"><i className="bi bi-search"></i></span>
            <input
              type="text"
              className="form-control"
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

      <div className="card shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th><input type="checkbox" className="form-check-input" /></th>
                <th style={{ width: "25%" }}>NOMBRE</th>
                <th style={{ width: "20%" }}>POSICIÓN</th>
                <th style={{ width: "20%" }}>ROL</th>
                <th style={{ width: "20%" }}>ESTADO</th>
                <th style={{ width: "15%" }}>ACCIÓN</th>
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
                  <td>{user.user_position || ""}</td>
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