import { useState, useEffect } from "react";
import API from "../services/api";
import ClientSelectModal from "./ClientSelectModal";
import "./ClienteModal.css"; // Reutilizamos los estilos del ClienteModal

export default function VehicleModal({ vehicle, onClose }) {
  const isEdit = !!vehicle;

  const [form, setForm] = useState({
    id_itm_type: "",
    Brand: "",
    Model: "",
    YearItem: "",
    Clasification: "",
    Plate: "",
    Motor: "",
    Chassis: "",
    Color: "",
    OriCountry: "",
    Propetary: "",
    id_use_item: "",
  });

  const [brands, setBrands] = useState([]);
  const [types, setTypes] = useState([]);
  const [uses, setUses] = useState([]);
  const [classifications, setClassifications] = useState([]);
  const [countries, setCountries] = useState([]);
  const [clients, setClients] = useState([]);
  const [showClientSelect, setShowClientSelect] = useState(false);
  const [selectedClientName, setSelectedClientName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [brandsRes, typesRes, usesRes, classRes, countriesRes, clientsRes] = await Promise.all([
          API.get("/marcas"),
          API.get("/tipos-vehiculo"),
          API.get("/usos-vehiculo"),
          API.get("/clasificaciones-vehiculo"),
          API.get("/paises"),
          API.get("/clientes"),
        ]);
        
        setBrands(brandsRes.data);
        setTypes(typesRes.data);
        setUses(usesRes.data);
        setClassifications(classRes.data);
        setCountries(countriesRes.data);
        setClients(clientsRes.data);
        
        if (isEdit) {
          setForm({
            id_itm_type: vehicle.id_itm_type || "",
            Brand: vehicle.Brand || "",
            Model: vehicle.Model || "",
            YearItem: vehicle.YearItem || "",
            Clasification: vehicle.Clasification || "",
            Plate: vehicle.Plate || "",
            Motor: vehicle.Motor || "",
            Chassis: vehicle.Chassis || "",
            Color: vehicle.Color || "",
            OriCountry: vehicle.OriCountry || "",
            Propetary: vehicle.Propetary || "",
            id_use_item: vehicle.id_use_item || "",
          });
        }
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };
    
    loadData();
  }, [vehicle, isEdit]);

  useEffect(() => {
    const cl = clients.find((c) => c.id === Number(form.Propetary));
    if (cl) {
      setSelectedClientName(`${cl.nombre} ${cl.apellidos || ""}`.trim());
    } else {
      setSelectedClientName("");
    }
  }, [clients, form.Propetary]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const data = {
      id_itm_type: Number(form.id_itm_type),
      Brand: Number(form.Brand),
      Model: form.Model,
      YearItem: Number(form.YearItem),
      Clasification: Number(form.Clasification),
      Plate: form.Plate,
      Motor: form.Motor || null,
      Chassis: form.Chassis || null,
      Color: form.Color || null,
      OriCountry: form.OriCountry ? Number(form.OriCountry) : null,
      Propetary: form.Propetary ? Number(form.Propetary) : null,
      id_use_item: Number(form.id_use_item),
    };
    
    try {
      if (isEdit) {
        await API.put(`/vehiculos/${vehicle.id}`, data);
      } else {
        await API.post("/vehiculos", data);
      }
      
      // Mostrar animación de éxito
      setShowSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2500);
      
    } catch (err) {
      console.error("Error saving vehicle:", err);
      const msg = err.response?.data?.detail || "Error al guardar vehículo";
      alert(msg);
      setLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !loading && !showSuccess) {
      onClose();
    }
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const goToStep = (step) => {
    if (!loading && !showSuccess) {
      if (step === 1 || (step === 2 && (isEdit || isStep1Valid)) || (step === 3 && (isEdit || isStep2Valid))) {
        setCurrentStep(step);
      }
    }
  };

  const isStep1Valid = form.Brand && form.Model && form.id_itm_type && form.id_use_item;
  const isStep2Valid = isStep1Valid && form.YearItem && form.Clasification && form.Plate;

  return (
    <>
      <div className="modal-backdrop" onClick={handleBackdropClick}>
        <div className="modal-container">
          <div className="modal-content-custom" style={{ 
            maxHeight: 'calc(100vh - 40px)',
            height: 'auto',
            display: 'flex',
            flexDirection: 'column'
          }}>
            
            {/* Success Animation Overlay */}
            {showSuccess && (
              <div className="success-overlay">
                <div className="success-animation">
                  <div className="checkmark-circle">
                    <svg className="checkmark" viewBox="0 0 52 52">
                      <path d="M14 27 L22 35 L38 19" />
                    </svg>
                  </div>
                  <h3 className="success-title">
                    {isEdit ? "¡Vehículo Actualizado!" : "¡Vehículo Creado!"}
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
                      {isEdit ? "Editar Vehículo" : "Nuevo Vehículo"}
                    </h2>
                    <div className="progress-indicators">
                      <div 
                        className={`progress-step ${currentStep >= 1 ? 'active' : ''}`}
                        onClick={() => goToStep(1)}
                        style={{ cursor: !loading && !showSuccess ? 'pointer' : 'default' }}
                      >
                        <span className="step-number">1</span>
                        <span className="step-label">Datos Básicos</span>
                      </div>
                      <div className="progress-line"></div>
                      <div 
                        className={`progress-step ${currentStep >= 2 ? 'active' : ''}`}
                        onClick={() => goToStep(2)}
                        style={{ 
                          cursor: !loading && !showSuccess && (isEdit || isStep1Valid) ? 'pointer' : 'default',
                          opacity: !isEdit && !isStep1Valid ? 0.5 : 1
                        }}
                      >
                        <span className="step-number">2</span>
                        <span className="step-label">Especificaciones</span>
                      </div>
                      <div className="progress-line"></div>
                      <div 
                        className={`progress-step ${currentStep >= 3 ? 'active' : ''}`}
                        onClick={() => goToStep(3)}
                        style={{ 
                          cursor: !loading && !showSuccess && (isEdit || isStep2Valid) ? 'pointer' : 'default',
                          opacity: !isEdit && !isStep2Valid ? 0.5 : 1
                        }}
                      >
                        <span className="step-number">3</span>
                        <span className="step-label">Detalles</span>
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
              <div className="modal-body-custom" style={{
                overflowY: 'auto',
                flex: '1',
                minHeight: '0',
                maxHeight: 'calc(100vh - 280px)'
              }}>
                
                {/* Step 1: Basic Information */}
                <div className={`form-step ${currentStep === 1 ? 'active' : ''}`}>
                  <div className="step-header">
                    <div className="step-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="step-title">Información Básica</h3>
                      <p className="step-description">Complete los datos fundamentales del vehículo</p>
                    </div>
                  </div>

                  <div className="form-grid">
                    <div className="form-group-modern">
                      <select
                        name="Brand"
                        className="form-select-modern"
                        value={form.Brand}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Seleccionar marca</option>
                        {brands.map(b => (
                          <option key={b.id} value={b.id}>{b.Description}</option>
                        ))}
                      </select>
                      <label className="form-label-modern">Marca *</label>
                      <div className="form-highlight"></div>
                    </div>

                    <div className="form-group-modern">
                      <input
                        name="Model"
                        className="form-input-modern"
                        placeholder=" "
                        value={form.Model}
                        onChange={handleChange}
                        required
                      />
                      <label className="form-label-modern">Modelo *</label>
                      <div className="form-highlight"></div>
                    </div>

                    <div className="form-group-modern">
                      <select
                        name="id_itm_type"
                        className="form-select-modern"
                        value={form.id_itm_type}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Seleccionar tipo</option>
                        {types.map(t => (
                          <option key={t.id} value={t.id}>{t.Description}</option>
                        ))}
                      </select>
                      <label className="form-label-modern">Tipo de Vehículo *</label>
                      <div className="form-highlight"></div>
                    </div>

                    <div className="form-group-modern">
                      <select
                        name="id_use_item"
                        className="form-select-modern"
                        value={form.id_use_item}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Seleccionar uso</option>
                        {uses.map(u => (
                          <option key={u.id} value={u.id}>{u.Description}</option>
                        ))}
                      </select>
                      <label className="form-label-modern">Uso del Vehículo *</label>
                      <div className="form-highlight"></div>
                    </div>
                  </div>
                </div>

                {/* Step 2: Specifications */}
                <div className={`form-step ${currentStep === 2 ? 'active' : ''}`}>
                  <div className="step-header">
                    <div className="step-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="step-title">Especificaciones</h3>
                      <p className="step-description">Detalles técnicos y clasificación</p>
                    </div>
                  </div>

                  <div className="form-grid">
                    <div className="form-group-modern">
                      <input
                        name="YearItem"
                        type="number"
                        className="form-input-modern"
                        placeholder=" "
                        value={form.YearItem}
                        onChange={handleChange}
                        required
                        min="1900"
                        max={new Date().getFullYear() + 1}
                      />
                      <label className="form-label-modern">Año *</label>
                      <div className="form-highlight"></div>
                    </div>

                    <div className="form-group-modern">
                      <select
                        name="Clasification"
                        className="form-select-modern"
                        value={form.Clasification}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Seleccionar clasificación</option>
                        {classifications.map(cs => (
                          <option key={cs.id} value={cs.id}>{cs.Description}</option>
                        ))}
                      </select>
                      <label className="form-label-modern">Clasificación *</label>
                      <div className="form-highlight"></div>
                    </div>

                    <div className="form-group-modern">
                      <input
                        name="Plate"
                        className="form-input-modern"
                        placeholder=" "
                        value={form.Plate}
                        onChange={handleChange}
                        required
                        style={{ textTransform: 'uppercase' }}
                      />
                      <label className="form-label-modern">Placa *</label>
                      <div className="form-highlight"></div>
                    </div>

                    <div className="form-group-modern">
                      <input
                        name="Color"
                        className="form-input-modern"
                        placeholder=" "
                        value={form.Color}
                        onChange={handleChange}
                      />
                      <label className="form-label-modern">Color</label>
                      <div className="form-highlight"></div>
                    </div>
                  </div>
                </div>

                {/* Step 3: Additional Details */}
                <div className={`form-step ${currentStep === 3 ? 'active' : ''}`}>
                  <div className="step-header">
                    <div className="step-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="step-title">Detalles Adicionales</h3>
                      <p className="step-description">Información complementaria y propietario</p>
                    </div>
                  </div>

                  <div className="form-grid">
                    <div className="form-group-modern">
                      <input
                        name="Motor"
                        className="form-input-modern"
                        placeholder=" "
                        value={form.Motor}
                        onChange={handleChange}
                      />
                      <label className="form-label-modern">Motor</label>
                      <div className="form-highlight"></div>
                    </div>

                    <div className="form-group-modern">
                      <input
                        name="Chassis"
                        className="form-input-modern"
                        placeholder=" "
                        value={form.Chassis}
                        onChange={handleChange}
                      />
                      <label className="form-label-modern">Chasis</label>
                      <div className="form-highlight"></div>
                    </div>

                    <div className="form-group-modern">
                      <select
                        name="OriCountry"
                        className="form-select-modern"
                        value={form.OriCountry}
                        onChange={handleChange}
                      >
                        <option value="">Seleccionar país</option>
                        {countries.map(c => (
                          <option key={c.id} value={c.id}>{c.Description}</option>
                        ))}
                      </select>
                      <label className="form-label-modern">País de Origen</label>
                      <div className="form-highlight"></div>
                    </div>

                    <div className="form-group-modern">
                      <input
                        name="Propetary"
                        className="form-input-modern"
                        placeholder=" "
                        value={selectedClientName}
                        onFocus={() => setShowClientSelect(true)}
                        readOnly
                        style={{ cursor: 'pointer' }}
                      />
                      <label className="form-label-modern">Propietario</label>
                      <div className="form-highlight"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer with Navigation */}
              <div className="modal-footer-custom" style={{
                flexShrink: 0,
                borderTop: '1px solid rgb(60, 50, 35)',
                background: 'linear-gradient(135deg, rgb(15, 15, 15) 0%, rgb(20, 20, 20) 100%)',
                position: 'sticky',
                bottom: 0,
                zIndex: 10
              }}>
                <div className="footer-actions" style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '1rem',
                  minHeight: '60px'
                }}>
                  <div style={{ flex: '0 0 auto' }}>
                    {currentStep > 1 && (
                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={prevStep}
                        disabled={loading}
                        style={{
                          padding: '0.75rem 1.25rem',
                          minWidth: '120px',
                          height: '36px'
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M15.41 16.58L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.42z"/>
                        </svg>
                        Anterior
                      </button>
                    )}
                  </div>
                  
                  <div style={{ display: 'flex', gap: '1rem', flex: '0 0 auto' }}>
                    {currentStep < 3 ? (
                      <button
                        type="button"
                        className="btn-next"
                        onClick={(e) => { e.preventDefault(); nextStep(); }}
                        disabled={loading || (!isEdit && currentStep === 1 && !isStep1Valid) || (!isEdit && currentStep === 2 && !isStep2Valid)}
                        style={{
                          padding: '0.75rem 1.25rem',
                          minWidth: '120px',
                          height: '36px'
                        }}
                      >
                        Siguiente
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M8.59 16.58L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.42z"/>
                        </svg>
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className="btn-primary"
                        disabled={loading || (!isEdit && !isStep2Valid)}
                        style={{
                          padding: '0.75rem 1.25rem',
                          minWidth: '140px',
                          height: '36px'
                        }}
                      >
                        {loading ? (
                          <>
                            <div className="spinner"></div>
                            Guardando...
                          </>
                        ) : (
                          <>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                            </svg>
                            {isEdit ? "Actualizar Vehículo" : "Crear Vehículo"}
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Client Select Modal */}
      {showClientSelect && (
        <ClientSelectModal
          clients={clients}
          onSelect={(c) => {
            setForm({ ...form, Propetary: c.id });
            setSelectedClientName(`${c.nombre} ${c.apellidos || ""}`.trim());
            setShowClientSelect(false);
          }}
          onClose={() => setShowClientSelect(false)}
        />
      )}
    </>
  );
}