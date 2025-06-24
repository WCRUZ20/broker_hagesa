import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import API from "../services/api";
import "./VendedorModal.css";

const INITIAL_FORM_STATE = {
  nombre: "",
  identificacion: "",
  telefono: "",
  email: "",
  direccion: "",
};

const VALIDATION_RULES = {
  nombre: {
    required: true,
    minLength: 2,
    pattern: /^[a-zA-ZÀ-ÿ\s]+$/,
    message: "El nombre debe contener solo letras y espacios"
  },
  identificacion: {
    required: true,
    minLength: 6,
    pattern: /^[0-9A-Za-z-]+$/,
    message: "Formato de identificación inválido"
  },
  email: {
    required: false,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Formato de email inválido"
  },
  telefono: {
    required: false,
    pattern: /^[\d\s\-\+\(\)]+$/,
    message: "Formato de teléfono inválido"
  }
};

export default function VendedorModal({ vendedor, onClose, onSave }) {
  const isEdit = !!vendedor;
  const modalRef = useRef(null);
  const firstInputRef = useRef(null);

  const [form, setForm] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // Memoized validation function
  const validateField = useCallback((name, value) => {
    const rule = VALIDATION_RULES[name];
    if (!rule) return null;

    if (rule.required && !value.trim()) {
      return "Este campo es requerido";
    }

    if (value && rule.minLength && value.length < rule.minLength) {
      return `Mínimo ${rule.minLength} caracteres`;
    }

    if (value && rule.pattern && !rule.pattern.test(value)) {
      return rule.message;
    }

    return null;
  }, []);

  // Validate entire form
  const validateForm = useCallback(() => {
    const newErrors = {};
    let isValid = true;

    Object.keys(VALIDATION_RULES).forEach(field => {
      const error = validateField(field, form[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [form, validateField]);

  // Check if step 1 is valid (basic required fields)
  const isStep1Valid = useMemo(() => {
    return form.nombre.trim() && form.identificacion.trim() &&
           !validateField('nombre', form.nombre) &&
           !validateField('identificacion', form.identificacion);
  }, [form.nombre, form.identificacion, validateField]);

  // Initialize form data
  useEffect(() => {
    if (isEdit && vendedor) {
      setForm(prevForm => ({ ...prevForm, ...vendedor }));
    }
  }, [isEdit, vendedor]);

  // Focus first input on mount
  useEffect(() => {
    if (firstInputRef.current && !loading && !showSuccess) {
      setTimeout(() => {
        firstInputRef.current.focus();
      }, 100);
    }
  }, [loading, showSuccess]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (showSuccess || loading) return;
      
      if (e.key === 'Escape') {
        onClose();
      }
      
      if (e.key === 'Enter' && e.ctrlKey) {
        handleSubmit(e);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showSuccess, loading, onClose]);

  // Handle backdrop click
  const handleBackdropClick = useCallback((e) => {
    if (e.target === e.currentTarget && !loading && !showSuccess) {
      onClose();
    }
  }, [loading, showSuccess, onClose]);

  // Handle input changes with real-time validation
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    
    setForm(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
    
    // Real-time validation for immediate feedback
    const error = validateField(name, value);
    if (error) {
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  }, [errors, validateField]);

  // Navigation between steps
  const goToStep = useCallback((step) => {
    if (loading || showSuccess) return;
    
    if (step === 2 && !isEdit && !isStep1Valid) {
      return; // Prevent navigation if step 1 is invalid
    }
    
    setCurrentStep(step);
  }, [loading, showSuccess, isEdit, isStep1Valid]);

  // Handle next step
  const handleNextStep = useCallback(() => {
    if (currentStep === 1 && isStep1Valid) {
      setCurrentStep(2);
    }
  }, [currentStep, isStep1Valid]);

  // Handle previous step
  const handlePreviousStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting || loading || showSuccess) return;
    
    if (!validateForm()) {
      // If there are validation errors, go to step 1
      setCurrentStep(1);
      return;
    }
    
    setIsSubmitting(true);
    setLoading(true);
    
    try {
      const dataToSend = { ...form };
      
      if (isEdit) {
        await API.put(`/vendedores/${vendedor.id}`, dataToSend);
      } else {
        await API.post("/vendedores", dataToSend);
      }
      
      // Show success animation
      setShowSuccess(true);
      
      // Call onSave callback if provided
      if (onSave) {
        onSave();
      }
      
      // Close modal after animation
      setTimeout(() => {
        onClose();
      }, 2500);
      
    } catch (error) {
      console.error("Error saving vendedor:", error);
      
      // Show user-friendly error message
      const errorMessage = error.response?.data?.message || 
                          "Error al guardar el vendedor. Por favor, intente nuevamente.";
      alert(errorMessage);
      
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  // Success Animation Component
  const SuccessAnimation = () => (
    <div className="success-overlay">
      <div className="success-animation">
        <div className="checkmark-circle">
          <svg className="checkmark" viewBox="0 0 52 52">
            <path d="M14 27l8 8L38 19" />
          </svg>
        </div>
        <h3 className="success-title">
          ¡{isEdit ? 'Actualizado' : 'Registrado'} Exitosamente!
        </h3>
        <p className="success-message">
          El vendedor ha sido {isEdit ? 'actualizado' : 'registrado'} correctamente
        </p>
      </div>
    </div>
  );

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick} ref={modalRef}>
      <div className="modal-container">
        <div className="modal-content-custom">
          
          {/* Success Overlay */}
          {showSuccess && <SuccessAnimation />}
          
          {/* Header */}
          <div className="modal-header-custom">
            <div className="header-content">
              <div className="title-section">
                <h2 className="modal-title-custom">
                  {isEdit ? "✏️ Editar Vendedor" : "👤 Nuevo Vendedor"}
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
                    <span className="step-label">Contacto</span>
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
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="step-title">Información Básica</h3>
                  <p className="step-description">Complete los datos fundamentales del vendedor</p>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  <div className={`form-group-modern ${errors.nombre ? 'error' : ''}`}>
                    <input
                      ref={firstInputRef}
                      name="nombre"
                      className="form-input-modern"
                      placeholder=" "
                      value={form.nombre}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    />
                    <label className="form-label-modern">Nombre Completo *</label>
                    <div className="form-highlight"></div>
                    {errors.nombre && <div className="form-error">{errors.nombre}</div>}
                  </div>

                  <div className={`form-group-modern ${errors.identificacion ? 'error' : ''}`}>
                    <input
                      name="identificacion"
                      className="form-input-modern"
                      placeholder=" "
                      value={form.identificacion}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    />
                    <label className="form-label-modern">Identificación *</label>
                    <div className="form-highlight"></div>
                    {errors.identificacion && <div className="form-error">{errors.identificacion}</div>}
                  </div>
                </div>
              </form>
            </div>

            {/* Step 2: Contact Information */}
            <div className={`form-step ${currentStep === 2 ? 'active' : ''}`}>
              <div className="step-header">
                <div className="step-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="step-title">Información de Contacto</h3>
                  <p className="step-description">Complete los datos de contacto (opcional)</p>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  <div className={`form-group-modern ${errors.telefono ? 'error' : ''}`}>
                    <input
                      name="telefono"
                      className="form-input-modern"
                      placeholder=" "
                      type="tel"
                      value={form.telefono}
                      onChange={handleChange}
                      disabled={loading}
                    />
                    <label className="form-label-modern">Teléfono</label>
                    <div className="form-highlight"></div>
                    {errors.telefono && <div className="form-error">{errors.telefono}</div>}
                  </div>

                  <div className={`form-group-modern ${errors.email ? 'error' : ''}`}>
                    <input
                      name="email"
                      className="form-input-modern"
                      placeholder=" "
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      disabled={loading}
                    />
                    <label className="form-label-modern">Correo Electrónico</label>
                    <div className="form-highlight"></div>
                    {errors.email && <div className="form-error">{errors.email}</div>}
                  </div>

                  <div className="form-group-modern full-width">
                    <input
                      name="direccion"
                      className="form-input-modern"
                      placeholder=" "
                      value={form.direccion}
                      onChange={handleChange}
                      disabled={loading}
                    />
                    <label className="form-label-modern">Dirección</label>
                    <div className="form-highlight"></div>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer-custom">
            <div className="footer-actions">
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                color: 'rgb(150, 146, 138)',
                fontSize: '0.75rem'
              }}>
                {currentStep === 1 && (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                    </svg>
                    Complete los campos obligatorios (*)
                  </>
                )}
                {currentStep === 2 && (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    Información adicional de contacto
                  </>
                )}
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
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
                      onClick={handleNextStep}
                      disabled={loading || !isStep1Valid}
                    >
                      {loading ? (
                        <>
                          <div className="spinner"></div>
                          Procesando...
                        </>
                      ) : (
                        <>
                          Siguiente
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                          </svg>
                        </>
                      )}
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      type="button" 
                      className="btn-secondary"
                      onClick={handlePreviousStep}
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
                      onClick={handleSubmit}
                      disabled={loading || isSubmitting}
                    >
                      {loading ? (
                        <>
                          <div className="spinner"></div>
                          {isEdit ? 'Actualizando...' : 'Guardando...'}
                        </>
                      ) : (
                        <>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/>
                          </svg>
                          {isEdit ? 'Actualizar' : 'Guardar'} Vendedor
                        </>
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}