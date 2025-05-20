import { useEffect, useState } from "react";
import API from "../services/api";
import ClienteModal from "../components/ClienteModal";

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const cargarClientes = async () => {
    const res = await API.get("/clientes");
    setClientes(res.data);
  };

  useEffect(() => {
    cargarClientes();
  }, []);

  const handleEditar = (cliente) => {
    setEditing(cliente);
    setShowModal(true);
  };

  const handleEliminar = async (id) => {
    if (confirm("¿Eliminar cliente?")) {
      await API.delete(`/clientes/${id}`);
      cargarClientes();
    }
  };

  return (
    <div>
      <h3>Clientes</h3>
      <button className="btn btn-primary mb-3" onClick={() => { setEditing(null); setShowModal(true); }}>
        Nuevo Cliente
      </button>

      <table className="table table-bordered table-hover">
        <thead>
          <tr>
            <th>Nombre</th><th>Identificación</th><th>Email</th><th>Teléfono</th><th>Dirección</th><th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map(cliente => (
            <tr key={cliente.id}>
              <td>{cliente.nombre}</td>
              <td>{cliente.identificacion}</td>
              <td>{cliente.email}</td>
              <td>{cliente.telefono}</td>
              <td>{cliente.direccion}</td>
              <td>
                <button className="btn btn-sm btn-warning me-2" onClick={() => handleEditar(cliente)}>Editar</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleEliminar(cliente.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
          {clientes.length === 0 && <tr><td colSpan="6" className="text-center">No hay clientes registrados.</td></tr>}
        </tbody>
      </table>

      {showModal && (
        <ClienteModal
          cliente={editing}
          onClose={() => { setShowModal(false); cargarClientes(); }}
        />
      )}
    </div>
  );
}
