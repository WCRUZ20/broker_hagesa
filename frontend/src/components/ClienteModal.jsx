import { useState, useEffect } from "react";
import API from "../services/api";
import "./ClienteModal.css";

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
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

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
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };
    
    loadData();
  }, [cliente, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
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
      
      // Mostrar animación de éxito
      setShowSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
      
    } catch (err) {
      console.error("Error saving client:", err);
      alert("Error al guardar cliente. Por favor, intente nuevamente.");
      setLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !loading && !showSuccess) {
      onClose();
    }
  };

  const nextStep = () => {
    if (currentStep < 2) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const isStep1Valid = form.nombre && form.apellidos && form.identificacion;

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-container">
        <div className="modal-content-custom">
          
          {/* Success Animation Overlay */}
          {showSuccess && (
            <div className="success-overlay">
              <div className="success-animation">
                <div className="checkmark-circle">
                  <div className="checkmark"></div>
                </div>
                <h3 className="success-title">
                  {isEdit ? "¡Cliente Actualizado!" : "¡Cliente Creado!"}
                </h3>
                <p className="success-message">
                  La información se ha guardado correctamente
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Header with Progress */}
            <div className="modal-header-custom">
              <div className="header-content">
                <div className="title-section">
                  <h2 className="modal-title-custom">
                    {isEdit ? "Editar Cliente" : "Nuevo Cliente"}
                  </h2>
                  <div className="progress-indicators">
                    <div className={`progress-step ${currentStep >= 1 ? 'active' : ''}`}>
                      <span className="step-number">1</span>
                      <span className="step-label">Datos Personales</span>
                    </div>
                    <div className="progress-line"></div>
                    <div className={`progress-step ${currentStep >= 2 ? 'active' : ''}`}>
                      <span className="step-number">2</span>
                      <span className="step-label">Ubicación</span>
                    </div>
                  </div>
                </div>
                <button 
                  type="button" 
                  className="modal-close-btn" 
                  onClick={onClose}
                  disabled={loading}
                >
                  ×
                </button>
              </div>
            </div>

            {/* Body with Steps */}
            <div className="modal-body-custom">
              
              {/* Step 1: Personal Information */}
              <div className={`form-step ${currentStep === 1 ? 'active' : ''}`}>
                <div className="step-header">
                  <div className="step-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="step-title">Información Personal</h3>
                    <p className="step-description">Complete los datos básicos del cliente</p>
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group-modern">
                    <input
                      name="nombre"
                      className="form-input-modern"
                      placeholder=" "
                      value={form.nombre}
                      onChange={handleChange}
                      required
                    />
                    <label className="form-label-modern">Nombres *</label>
                    <div className="form-highlight"></div>
                  </div>

                  <div className="form-group-modern">
                    <input
                      name="apellidos"
                      className="form-input-modern"
                      placeholder=" "
                      value={form.apellidos}
                      onChange={handleChange}
                      required
                    />
                    <label className="form-label-modern">Apellidos *</label>
                    <div className="form-highlight"></div>
                  </div>

                  <div className="form-group-modern">
                    <input
                      name="identificacion"
                      className="form-input-modern"
                      placeholder=" "
                      value={form.identificacion}
                      onChange={handleChange}
                      required
                    />
                    <label className="form-label-modern">Identificación *</label>
                    <div className="form-highlight"></div>
                  </div>

                  <div className="form-group-modern">
                    <input
                      name="telefono"
                      className="form-input-modern"
                      placeholder=" "
                      type="tel"
                      value={form.telefono}
                      onChange={handleChange}
                    />
                    <label className="form-label-modern">Teléfono</label>
                    <div className="form-highlight"></div>
                  </div>

                  <div className="form-group-modern full-width">
                    <input
                      name="email"
                      className="form-input-modern"
                      placeholder=" "
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                    />
                    <label className="form-label-modern">Correo Electrónico</label>
                    <div className="form-highlight"></div>
                  </div>

                  <div className="form-group-modern full-width">
                    <input
                      name="direccion"
                      className="form-input-modern"
                      placeholder=" "
                      value={form.direccion}
                      onChange={handleChange}
                    />
                    <label className="form-label-modern">Dirección</label>
                    <div className="form-highlight"></div>
                  </div>
                </div>
              </div>

              {/* Step 2: Location Information */}
              <div className={`form-step ${currentStep === 2 ? 'active' : ''}`}>
                <div className="step-header">
                  <div className="step-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="step-title">Ubicación Geográfica</h3>
                    <p className="step-description">Especifique la ubicación del cliente</p>
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group-modern">
                    <select
                      name="id_pais"
                      className="form-select-modern"
                      value={form.id_pais}
                      onChange={handleChange}
                    >
                      <option value="">Seleccione...</option>
                      {paises.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.Description}
                        </option>
                      ))}
                    </select>
                    <label className="form-label-modern">País</label>
                    <div className="form-highlight"></div>
                  </div>

                  <div className="form-group-modern">
                    <select
                      name="id_provincia"
                      className="form-select-modern"
                      value={form.id_provincia}
                      onChange={handleChange}
                    >
                      <option value="">Seleccione...</option>
                      {provincias.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.Description}
                        </option>
                      ))}
                    </select>
                    <label className="form-label-modern">Provincia</label>
                    <div className="form-highlight"></div>
                  </div>

                  <div className="form-group-modern">
                    <select
                      name="id_ciudad"
                      className="form-select-modern"
                      value={form.id_ciudad}
                      onChange={handleChange}
                    >
                      <option value="">Seleccione...</option>
                      {ciudades.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.Description}
                        </option>
                      ))}
                    </select>
                    <label className="form-label-modern">Ciudad</label>
                    <div className="form-highlight"></div>
                  </div>

                  <div className="form-group-modern">
                    <select
                      name="id_parroquia"
                      className="form-select-modern"
                      value={form.id_parroquia}
                      onChange={handleChange}
                    >
                      <option value="">Seleccione...</option>
                      {parroquias.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.Description}
                        </option>
                      ))}
                    </select>
                    <label className="form-label-modern">Parroquia</label>
                    <div className="form-highlight"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer with Navigation */}
            <div className="modal-footer-custom">
              <div className="footer-actions">
                {currentStep === 1 ? (
                  <>
                    <button 
                      type="button" 
                      className="btn-secondary" 
                      onClick={onClose}
                      disabled={loading}
                    >
                      Cancelar
                    </button>
                    <button 
                      type="button" 
                      className="btn-next" 
                      onClick={nextStep}
                      disabled={!isStep1Valid || loading}
                    >
                      Siguiente
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                      </svg>
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      type="button" 
                      className="btn-secondary" 
                      onClick={prevStep}
                      disabled={loading}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/>
                      </svg>
                      Anterior
                    </button>
                    <button 
                      type="submit" 
                      className="btn-primary" 
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner"></span>
                          {isEdit ? "Actualizando..." : "Guardando..."}
                        </>
                      ) : (
                        <>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                          </svg>
                          {isEdit ? "Actualizar Cliente" : "Crear Cliente"}
                        </>
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}