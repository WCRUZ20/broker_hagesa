import { useEffect, useState } from "react";
import API from "../services/api";
import VendedorModal from "../components/VendedorModal";

export default function Vendedores() {
  const [vendedores, setVendedores] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const cargarVendedores = async () => {
    const res = await API.get("/vendedores");
    setVendedores(res.data);
  };

  useEffect(() => {
    cargarVendedores();
  }, []);

  const handleEditar = (vendedor) => {
    setEditing(vendedor);
    setShowModal(true);
  };

  const handleEliminar = async (id) => {
    if (confirm("¿Eliminar vendedor?")) {
      await API.delete(`/vendedores/${id}`);
      cargarVendedores();
    }
  };

  return (
    <div>
      <h3>Vendedores</h3>
      <button className="btn btn-primary mb-3" onClick={() => { setEditing(null); setShowModal(true); }}>
        Nuevo Vendedor
      </button>

      <table className="table table-bordered table-hover">
        <thead>
          <tr>
            <th>Nombre</th><th>Identificación</th><th>Email</th><th>Teléfono</th><th>Dirección</th><th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {vendedores.map(v => (
            <tr key={v.id}>
              <td>{v.nombre}</td>
              <td>{v.identificacion}</td>
              <td>{v.email}</td>
              <td>{v.telefono}</td>
              <td>{v.direccion}</td>
              <td>
                <button className="btn btn-sm btn-warning me-2" onClick={() => handleEditar(v)}>Editar</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleEliminar(v.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
          {vendedores.length === 0 && <tr><td colSpan="6" className="text-center">No hay vendedores registrados.</td></tr>}
        </tbody>
      </table>

      {showModal && (
        <VendedorModal
          vendedor={editing}
          onClose={() => { setShowModal(false); cargarVendedores(); }}
        />
      )}
    </div>
  );
}
