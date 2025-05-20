import { useEffect, useState } from "react";
import API from "../services/api";
import UsuarioModal from "../components/UsuarioModal";

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const fetchUsuarios = async () => {
  try {
    const res = await API.get("/users");
    console.log("Usuarios obtenidos:", res.data);  // ← Agrega esto
    setUsuarios(res.data);
    } catch (err) {
    console.error("Error cargando usuarios:", err);  // ← Y esto
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

  return (
    <div>
      <h3>Usuarios</h3>
      <button className="btn btn-primary mb-3" onClick={() => { setEditingUser(null); setShowModal(true); }}>
        Nuevo Usuario
      </button>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Cod</th><th>Nombre</th><th>Correo</th><th>Rol</th><th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map(user => (
            <tr key={user.id}>
              <td>{user.user_cod}</td>
              <td>{user.user_name} {user.last_name}</td>
              <td>{user.user_email}</td>
              <td>{user.user_role}</td>
              <td>
                <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(user)}>Editar</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(user.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <UsuarioModal
          user={editingUser}
          onClose={() => { setShowModal(false); fetchUsuarios(); }}
        />
      )}
    </div>
  );
}
