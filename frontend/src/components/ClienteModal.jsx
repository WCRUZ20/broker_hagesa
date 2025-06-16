import { useState, useEffect } from "react";
import API from "../services/api";

export default function ClienteModal({ cliente, onClose }) {
  const isEdit = !!cliente;

  const [form, setForm] = useState({
    nombre: "",
    apellidos: "",
    identificacion: "",
    telefono: "",
    email: "",
    direccion: "",
    id_pais: "",
    id_provincia: "",
    id_ciudad: "",
    id_parroquia: "",
  });

  const [paises, setPaises] = useState([]);
  const [provincias, setProvincias] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [parroquias, setParroquias] = useState([]);

  useEffect(() => {
    API.get("/paises").then(res => setPaises(res.data));
    API.get("/provincias").then(res => setProvincias(res.data));
    API.get("/ciudades").then(res => setCiudades(res.data));
    API.get("/parroquias").then(res => setParroquias(res.data));
    if (isEdit) {
      setForm({
        nombre: cliente.nombre || "",
        apellidos: cliente.apellidos || "",
        identificacion: cliente.identificacion || "",
        telefono: cliente.telefono || "",
        email: cliente.email || "",
        direccion: cliente.direccion || "",
        id_pais: cliente.id_pais || "",
        id_provincia: cliente.id_provincia || "",
        id_ciudad: cliente.id_ciudad || "",
        id_parroquia: cliente.id_parroquia || "",});
    }
  }, [cliente]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      ...form,
      id_pais: form.id_pais ? Number(form.id_pais) : null,
      id_provincia: form.id_provincia ? Number(form.id_provincia) : null,
      id_ciudad: form.id_ciudad ? Number(form.id_ciudad) : null,
      id_parroquia: form.id_parroquia ? Number(form.id_parroquia) : null,
    };
    try {
      if (isEdit) {
        await API.put(`/clientes/${cliente.id}`, data);
      } else {
        await API.post("/clientes", data);
      }
      onClose();
    } catch (err) {
      alert("Error al guardar cliente");
    }
  };

  return (
    <div className="modal show fade d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">{isEdit ? "Editar Cliente" : "Nuevo Cliente"}</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              <input
                name="nombre"
                className="form-control mb-2"
                placeholder="Nombres"
                value={form.nombre}
                onChange={handleChange}
                required
              />
              <input
                name="apellidos"
                className="form-control mb-2"
                placeholder="Apellidos"
                value={form.apellidos}
                onChange={handleChange}
                required
              />
              <input
                name="identificacion"
                className="form-control mb-2"
                placeholder="Identificación"
                value={form.identificacion}
                onChange={handleChange}
                required
              />
              <input
                name="telefono"
                className="form-control mb-2"
                placeholder="Teléfono"
                value={form.telefono}
                onChange={handleChange}
              />
              <input
                name="email"
                className="form-control mb-2"
                placeholder="Correo"
                type="email"
                value={form.email}
                onChange={handleChange}
              />
              <input
                name="direccion"
                className="form-control mb-2"
                placeholder="Dirección"
                value={form.direccion}
                onChange={handleChange}
              />

              <select
                name="id_pais"
                className="form-select mb-2"
                value={form.id_pais}
                onChange={handleChange}
              >
                <option value="">Seleccione país</option>
                {paises.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.Description}
                  </option>
                ))}
              </select>

              <select
                name="id_provincia"
                className="form-select mb-2"
                value={form.id_provincia}
                onChange={handleChange}
              >
                <option value="">Seleccione provincia</option>
                {provincias.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.Description}
                  </option>
                ))}
              </select>

              <select
                name="id_ciudad"
                className="form-select mb-2"
                value={form.id_ciudad}
                onChange={handleChange}
              >
                <option value="">Seleccione ciudad</option>
                {ciudades.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.Description}
                  </option>
                ))}
              </select>

              <select
                name="id_parroquia"
                className="form-select mb-2"
                value={form.id_parroquia}
                onChange={handleChange}
              >
                <option value="">Seleccione parroquia</option>
                {parroquias.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.Description}
                  </option>
                ))}
              </select>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
              <button className="btn btn-primary" type="submit">Guardar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
