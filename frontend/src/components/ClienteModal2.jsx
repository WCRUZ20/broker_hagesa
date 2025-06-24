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
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [paisesRes, provinciasRes, ciudadesRes, parroquiasRes] = await Promise.all([
          API.get("/paises"),
          API.get("/provincias"),
          API.get("/ciudades"),
          API.get("/parroquias")
        ]);
        
        setPaises(paisesRes.data);
        setProvincias(provinciasRes.data);
        setCiudades(ciudadesRes.data);
        setParroquias(parroquiasRes.data);
      } catch (error) {
        console.error("Error cargando datos:", error);
      }
    };

    loadData();

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
        id_parroquia: cliente.id_parroquia || "",
      });
    }
  }, [cliente, isEdit]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
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
      console.error("Error al guardar cliente:", err);
      alert("Error al guardar cliente. Por favor, intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="modal show fade d-block" 
      tabIndex="-1" 
      style={{ 
        backgroundColor: "rgba(35, 42, 55, 0.93)",
        backdropFilter: "blur(8px)"
      }}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div 
          className="modal-content border-0"
          style={{
            borderRadius: '16px',
            overflow: 'hidden',
            backgroundColor: '#232a37'
          }}
        >
          <form onSubmit={handleSubmit}>
            {/* Header Profesional */}
            <div 
              className="modal-header border-0 py-4 px-4"
              style={{
                background: '#232a37',
                color: '#e2e8f0',
                borderBottom: '2px solid #b8860b'
              }}
            >
              <div>
                <h4 className="modal-title mb-1 fw-bold" style={{ color: '#e2e8f0' }}>
                  {isEdit ? "✏️ Editar Cliente" : "👤 Nuevo Cliente"}
                </h4>
                <p className="mb-0 small" style={{ color: '#a0aec0' }}>
                  {isEdit 
                    ? "Actualiza la información del cliente seleccionado" 
                    : "Completa todos los campos para registrar el nuevo cliente"
                  }
                </p>
              </div>
              <button 
                type="button" 
                className="btn-close" 
                onClick={onClose}
                style={{ 
                  filter: 'brightness(0) invert(1)',
                  fontSize: '1.1rem',
                  opacity: 0.85
                }}
              />
            </div>

            {/* Body */}
            <div 
              className="modal-body px-4 py-4"
              style={{ backgroundColor: '#232a37' }}
            >
              {/* Información Personal */}
              <div className="mb-4">
                <div className="d-flex align-items-center mb-3">
                  <div 
                    className="rounded-circle me-2 d-flex align-items-center justify-content-center"
                    style={{
                      width: '32px',
                      height: '32px',
                      backgroundColor: '#b8860b',
                      color: 'white'
                    }}
                  >
                    <span style={{ fontSize: '0.8rem' }}>👤</span>
                  </div>
                  <h6 className="mb-0 fw-semibold text-uppercase" 
                      style={{ 
                        fontSize: '0.75rem', 
                        letterSpacing: '0.5px',
                        color: '#e2e8f0'
                      }}>
                    Información Personal
                  </h6>
                </div>
                
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input
                        name="nombre"
                        className="form-control border-0 shadow-sm"
                        placeholder="Nombres"
                        value={form.nombre}
                        onChange={handleChange}
                        required
                        style={{ 
                          borderRadius: '12px',
                          backgroundColor: '#323b4b',
                          color: '#f7fafc',
                          fontSize: '0.95rem',
                          border: '1px solid #3c4657'
                        }}
                      />
                      <label style={{ color: '#a0aec0' }}>Nombres *</label>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input
                        name="apellidos"
                        className="form-control border-0 shadow-sm"
                        placeholder="Apellidos"
                        value={form.apellidos}
                        onChange={handleChange}
                        required
                        style={{ 
                          borderRadius: '12px',
                          backgroundColor: '#323b4b',
                          color: '#f7fafc',
                          fontSize: '0.95rem',
                          border: '1px solid #3c4657'
                        }}
                      />
                      <label style={{ color: '#a0aec0' }}>Apellidos *</label>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input
                        name="identificacion"
                        className="form-control border-0 shadow-sm"
                        placeholder="Identificación"
                        value={form.identificacion}
                        onChange={handleChange}
                        required
                        style={{ 
                          borderRadius: '12px',
                          backgroundColor: '#323b4b',
                          color: '#f7fafc',
                          fontSize: '0.95rem',
                          border: '1px solid #3c4657'
                        }}
                      />
                      <label style={{ color: '#a0aec0' }}>Identificación *</label>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input
                        name="telefono"
                        className="form-control border-0 shadow-sm"
                        placeholder="Teléfono"
                        value={form.telefono}
                        onChange={handleChange}
                        style={{ 
                          borderRadius: '12px',
                          backgroundColor: '#323b4b',
                          color: '#f7fafc',
                          fontSize: '0.95rem',
                          border: '1px solid #3c4657'
                        }}
                      />
                      <label style={{ color: '#a0aec0' }}>Teléfono</label>
                    </div>
                  </div>
                  
                  <div className="col-12">
                    <div className="form-floating">
                      <input
                        name="email"
                        className="form-control border-0 shadow-sm"
                        placeholder="Correo"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        style={{ 
                          borderRadius: '12px',
                          backgroundColor: '#323b4b',
                          color: '#f7fafc',
                          fontSize: '0.95rem',
                          border: '1px solid #3c4657'
                        }}
                      />
                      <label style={{ color: '#a0aec0' }}>Correo Electrónico</label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ubicación */}
              <div className="mb-0">
                <div className="d-flex align-items-center mb-3">
                  <div 
                    className="rounded-circle me-2 d-flex align-items-center justify-content-center"
                    style={{
                      width: '32px',
                      height: '32px',
                      backgroundColor: '#b8860b',
                      color: 'white'
                    }}
                  >
                    <span style={{ fontSize: '0.8rem' }}>📍</span>
                  </div>
                  <h6 className="mb-0 fw-semibold text-uppercase" 
                      style={{ 
                        fontSize: '0.75rem', 
                        letterSpacing: '0.5px',
                        color: '#e2e8f0'
                      }}>
                    Ubicación
                  </h6>
                </div>
                
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="form-floating">
                      <select
                        name="id_pais"
                        className="form-select border-0 shadow-sm"
                        value={form.id_pais}
                        onChange={handleChange}
                        style={{ 
                          borderRadius: '12px',
                          backgroundColor: '#323b4b',
                          color: '#f7fafc',
                          fontSize: '0.95rem',
                          border: '1px solid #3c4657'
                        }}
                      >
                        <option value="">Seleccione país</option>
                        {paises.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.Description}
                          </option>
                        ))}
                      </select>
                      <label style={{ color: '#a0aec0' }}>País</label>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="form-floating">
                      <select
                        name="id_provincia"
                        className="form-select border-0 shadow-sm"
                        value={form.id_provincia}
                        onChange={handleChange}
                        style={{ 
                          borderRadius: '12px',
                          backgroundColor: '#323b4b',
                          color: '#f7fafc',
                          fontSize: '0.95rem',
                          border: '1px solid #3c4657'
                        }}
                      >
                        <option value="">Seleccione provincia</option>
                        {provincias.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.Description}
                          </option>
                        ))}
                      </select>
                      <label style={{ color: '#a0aec0' }}>Provincia</label>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="form-floating">
                      <select
                        name="id_ciudad"
                        className="form-select border-0 shadow-sm"
                        value={form.id_ciudad}
                        onChange={handleChange}
                        style={{ 
                          borderRadius: '12px',
                          backgroundColor: '#323b4b',
                          color: '#f7fafc',
                          fontSize: '0.95rem',
                          border: '1px solid #3c4657'
                        }}
                      >
                        <option value="">Seleccione ciudad</option>
                        {ciudades.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.Description}
                          </option>
                        ))}
                      </select>
                      <label style={{ color: '#a0aec0' }}>Ciudad</label>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="form-floating">
                      <select
                        name="id_parroquia"
                        className="form-select border-0 shadow-sm"
                        value={form.id_parroquia}
                        onChange={handleChange}
                        style={{ 
                          borderRadius: '12px',
                          backgroundColor: '#323b4b',
                          color: '#f7fafc',
                          fontSize: '0.95rem',
                          border: '1px solid #3c4657'
                        }}
                      >
                        <option value="">Seleccione parroquia</option>
                        {parroquias.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.Description}
                          </option>
                        ))}
                      </select>
                      <label style={{ color: '#a0aec0' }}>Parroquia</label>
                    </div>
                  </div>
                  
                  <div className="col-12">
                    <div className="form-floating">
                      <input
                        name="direccion"
                        className="form-control border-0 shadow-sm"
                        placeholder="Dirección completa"
                        value={form.direccion}
                        onChange={handleChange}
                        style={{ 
                          borderRadius: '12px',
                          backgroundColor: '#323b4b',
                          color: '#f7fafc',
                          fontSize: '0.95rem',
                          border: '1px solid #3c4657'
                        }}
                      />
                      <label style={{ color: '#a0aec0' }}>Dirección Completa</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div 
              className="modal-footer border-0 px-4 py-4" 
              style={{ 
                backgroundColor: '#232a37',
                borderTop: '1px solid #3c4657'
              }}
            >
              <div className="d-flex gap-3 w-100 justify-content-end">
                <button 
                  type="button"
                  className="btn border-0 px-4 py-2 fw-medium"
                  onClick={onClose}
                  disabled={isLoading}
                  style={{
                    borderRadius: '12px',
                    backgroundColor: '#323b4b',
                    color: '#e2e8f0',
                    border: '1px solid #3c4657',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={e => {
                    if (!isLoading) e.target.style.backgroundColor = '#232a37';
                  }}
                  onMouseOut={e => {
                    e.target.style.backgroundColor = '#323b4b';
                  }}
                >
                  Cancelar
                </button>
                
                <button 
                  type="submit"
                  className="btn border-0 px-4 py-2 fw-medium text-white d-flex align-items-center"
                  disabled={isLoading}
                  style={{
                    borderRadius: '12px',
                    backgroundColor: isLoading ? '#8b7355' : '#b8860b',
                    minWidth: '140px',
                    justifyContent: 'center',
                    border: `1px solid ${isLoading ? '#8b7355' : '#b8860b'}`,
                    boxShadow: isLoading ? 'none' : '0 4px 15px rgba(184,134,11,0.18)',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={e => {
                    if (!isLoading) e.target.style.backgroundColor = '#daa520';
                  }}
                  onMouseOut={e => {
                    if (!isLoading) e.target.style.backgroundColor = '#b8860b';
                  }}
                >
                  {isLoading ? (
                    <>
                      <div 
                        className="spinner-border spinner-border-sm me-2" 
                        role="status"
                        style={{ width: '1rem', height: '1rem' }}
                      />
                      Guardando...
                    </>
                  ) : (
                    <>
                      {isEdit ? "💾 Actualizar" : "✅ Guardar"} Cliente
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
