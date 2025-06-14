import { useEffect, useState } from "react";
import API from "../services/api";
import PaisModal from "../components/PaisModal";

export default function Paises() {
  const [paises, setPaises] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const cargarPaises = async () => {
    const res = await API.get("/paises");
    setPaises(res.data);
  };

  useEffect(() => {
    cargarPaises();
  }, []);

  const handleEditar = (pais) => {
    setEditing(pais);
    setShowModal(true);
  };

  const handleEliminar = async (id) => {
    if (confirm("¿Eliminar país?")) {
      await API.delete(`/paises/${id}`);
      cargarPaises();
    }
  };

  return (
    <div>
      <h3>Países</h3>
      <button className="btn btn-primary mb-3" onClick={() => { setEditing(null); setShowModal(true); }}>
        Nuevo País
      </button>

      <table className="table table-bordered table-hover">
        <thead>
          <tr>
            <th>ID</th><th>Descripción</th><th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {paises.map(p => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.Description}</td>
              <td>
                <button className="btn btn-sm btn-warning me-2" onClick={() => handleEditar(p)}>Editar</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleEliminar(p.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
          {paises.length === 0 && <tr><td colSpan="3" className="text-center">No hay países registrados.</td></tr>}
        </tbody>
      </table>

      {showModal && (
        <PaisModal
          pais={editing}
          onClose={() => { setShowModal(false); cargarPaises(); }}
        />
      )}
    </div>
  );
}