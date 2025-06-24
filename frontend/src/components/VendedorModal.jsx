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

  // Initialize form data
  useEffect(() => {
    if (isEdit && vendedor) {
      setForm(prevForm => ({ ...prevForm, ...vendedor }));
    } else {
      setForm(INITIAL_FORM_STATE);
    }
    setErrors({});
  }, [vendedor, isEdit]);

  // Focus management
  useEffect(() => {
    if (firstInputRef.current) {
      const timer = setTimeout(() => {
        firstInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, []);

  // Escape key handler
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && !loading && !showSuccess) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [loading, showSuccess, onClose]);

  // Handle form field changes with validation
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    
    setForm(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }

    // Real-time validation for better UX
    const error = validateField(name, value);
    if (error && value.length > 0) {
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  }, [errors, validateField]);

  // Handle form submission
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    if (!validateForm()) {
      // Focus first error field
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField) {
        const fieldElement = document.querySelector(`input[name="${firstErrorField}"]`);
        fieldElement?.focus();
      }
      return;
    }

    setIsSubmitting(true);
    setLoading(true);

    try {
      let response;
      if (isEdit) {
        response = await API.put(`/vendedores/${vendedor.id}`, form);
      } else {
        response = await API.post("/vendedores", form);
      }

      setShowSuccess(true);
      
      // Call onSave callback if provided
      if (onSave) {
        onSave(response.data);
      }

      // Auto close after success animation
      setTimeout(() => {
        onClose();
      }, 2500);
      
    } catch (err) {
      console.error('Error saving vendedor:', err);
      
      // Handle different error types
      if (err.response?.status === 422) {
        // Validation errors from backend
        const backendErrors = err.response.data.errors || {};
        setErrors(backendErrors);
      } else if (err.response?.status === 409) {
        // Conflict error (duplicate identification)
        setErrors({
          identificacion: "Esta identificación ya existe"
        });
      } else {
        // Generic error
        alert("Error al guardar vendedor. Por favor, intente nuevamente.");
      }
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  }, [form, errors, isEdit, vendedor, onSave, onClose, validateForm, isSubmitting]);

  // Handle backdrop click
  const handleBackdropClick = useCallback((e) => {
    if (e.target === e.currentTarget && !loading && !showSuccess) {
      onClose();
    }
  }, [loading, showSuccess, onClose]);

  // Memoized form fields configuration
  const formFields = useMemo(() => [
    {
      name: "nombre",
      label: "Nombre *",
      type: "text",
      required: true,
      autoComplete: "name",
      ref: firstInputRef
    },
    {
      name: "identificacion",
      label: "Identificación *",
      type: "text",
      required: true,
      autoComplete: "off"
    },
    {
      name: "telefono",
      label: "Teléfono",
      type: "tel",
      autoComplete: "tel"
    },
    {
      name: "email",
      label: "Correo",
      type: "email",
      autoComplete: "email"
    },
    {
      name: "direccion",
      label: "Dirección",
      type: "text",
      autoComplete: "street-address"
    }
  ], []);

  // Memoized success message
  const successMessage = useMemo(() => ({
    title: isEdit ? '¡Vendedor Actualizado!' : '¡Vendedor Creado!',
    message: 'La información se ha guardado correctamente'
  }), [isEdit]);

  return (
    <div 
      className="modal-backdrop" 
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="modal-container" ref={modalRef}>
        <div className="modal-content-custom">
          
          {showSuccess && (
            <div className="success-overlay" role="status" aria-live="polite">
              <div className="success-animation">
                <div className="checkmark-circle">
                  <svg className="checkmark" viewBox="0 0 52 52" aria-hidden="true">
                    <path d="M14 27 L22 35 L38 19" />
                  </svg>
                </div>
                <h3 className="success-title">
                  {successMessage.title}
                </h3>
                <p className="success-message">
                  {successMessage.message}
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="modal-header-custom">
              <div className="header-content">
                <div className="title-section">
                  <h2 id="modal-title" className="modal-title-custom">
                    {isEdit ? 'Editar Vendedor' : 'Nuevo Vendedor'}
                  </h2>
                </div>
                <button
                  type="button"
                  className="modal-close-btn"
                  onClick={onClose}
                  disabled={loading}
                  aria-label="Cerrar modal"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="modal-body-custom">
              {formFields.map((field) => (
                <div 
                  key={field.name}
                  className={`form-group-modern ${errors[field.name] ? 'error' : ''}`}
                >
                  <input
                    ref={field.ref}
                    name={field.name}
                    type={field.type}
                    className="form-input-modern"
                    placeholder=" "
                    value={form[field.name]}
                    onChange={handleChange}
                    required={field.required}
                    autoComplete={field.autoComplete}
                    disabled={loading}
                    aria-invalid={!!errors[field.name]}
                    aria-describedby={errors[field.name] ? `${field.name}-error` : undefined}
                  />
                  <label className="form-label-modern">
                    {field.label}
                  </label>
                  <div className="form-highlight"></div>
                  {errors[field.name] && (
                    <div 
                      id={`${field.name}-error`}
                      className="form-error"
                      role="alert"
                    >
                      {errors[field.name]}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="modal-footer-custom">
              <div className="footer-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={onClose}
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading || isSubmitting}
                >
                  {loading ? (
                    <>
                      <div className="spinner" aria-hidden="true"></div>
                      Guardando...
                    </>
                  ) : (
                    'Guardar'
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