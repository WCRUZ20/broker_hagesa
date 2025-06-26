import { useState, useEffect } from "react";
import API from "../services/api";
import "./MailConfigModal.css";

export default function MailConfigModal({ config, onClose }) {
  const isEdit = !!config;

  const [form, setForm] = useState({
    USER_SMTP: "",
    PASS_SMTP: "",
    HOST_SMTP: "",
    PORT_SMTP: "",
    Estado: "A",
  });

  const [testEmail, setTestEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showTestSuccess, setShowTestSuccess] = useState(false);
  const [showTestError, setShowTestError] = useState(false);
  const [testSuccessEmail, setTestSuccessEmail] = useState("");
  const [testErrorMessage, setTestErrorMessage] = useState("");
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    if (isEdit) {
      setForm({
        USER_SMTP: config.USER_SMTP || "",
        PASS_SMTP: config.PASS_SMTP || "",
        HOST_SMTP: config.HOST_SMTP || "",
        PORT_SMTP: config.PORT_SMTP || "",
        Estado: config.Estado || "A",
      });
      setTestEmail(config.USER_SMTP || "");
    } else {
      setTestEmail(form.USER_SMTP);
    }
  }, [config, isEdit]);

  // Actualizar el email de prueba cuando cambie el USER_SMTP
  useEffect(() => {
    if (!testEmail || testEmail === form.USER_SMTP) {
      setTestEmail(form.USER_SMTP);
    }
  }, [form.USER_SMTP]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleTestEmailChange = (e) => {
    setTestEmail(e.target.value);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleTest = async () => {
    // Validar que todos los campos requeridos estén completos
    if (!form.USER_SMTP || !form.PASS_SMTP || !form.HOST_SMTP || !form.PORT_SMTP) {
      alert("Por favor completa todos los campos antes de validar.");
      return;
    }

    if (!testEmail) {
      alert("Por favor ingresa un correo electrónico para la prueba.");
      return;
    }

    setIsValidating(true);
    
    try {
      const testData = {
        ...form,
        test_email: testEmail
      };
      
      const response = await API.post("/seguimiento/parametrizaciones-mail/test-config", testData);
      
      // Mostrar animación de éxito específica para el test
      setTestSuccessEmail(testEmail);
      setShowTestSuccess(true);
      setTimeout(() => {
        setShowTestSuccess(false);
      }, 3000);
      
    } catch (error) {
      const errorMsg = error.response?.data?.detail || "Error al validar configuración";
      
      // Mostrar animación de error
      setTestErrorMessage(errorMsg);
      setShowTestError(true);
      setTimeout(() => {
        setShowTestError(false);
      }, 4000);
      
    } finally {
      setIsValidating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isEdit) {
        await API.put(`/seguimiento/parametrizaciones-mail/${config.id}`, form);
      } else {
        await API.post("/seguimiento/parametrizaciones-mail", form);
      }
      
      // Mostrar animación de éxito
      setShowSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2500);
      
    } catch (err) {
      console.error("Error saving mail config:", err);
      const msg = err.response?.data?.detail || "Error al guardar configuración";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-container">
        <div className="modal-content-custom">
          
          {/* Error Animation Overlay for Test Email */}
          {showTestError && (
            <div className="success-overlay">
              <div className="success-animation">
                <div className="error-circle">
                  <svg className="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line className="error-line-1" x1="15" y1="9" x2="9" y2="15"/>
                    <line className="error-line-2" x1="9" y1="9" x2="15" y2="15"/>
                  </svg>
                </div>
                <h3 className="error-title">Error en la validación</h3>
                <p className="error-message">
                  {testErrorMessage}
                </p>
                <p className="error-suggestion">
                  Verifica la configuración SMTP e intenta nuevamente
                </p>
              </div>
            </div>
          )}

          {/* Success Animation Overlay for Test Email */}
          {showTestSuccess && (
            <div className="success-overlay">
              <div className="success-animation">
                <div className="email-success-circle">
                  <svg className="email-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                    <path className="check-path" d="M9 11l3 3L22 4" strokeDasharray="20" strokeDashoffset="20"/>
                  </svg>
                </div>
                <h3 className="success-title">¡Correo enviado con éxito!</h3>
                <p className="success-message">
                  Correo de prueba enviado exitosamente a:<br/>
                  <span className="email-highlight">{testSuccessEmail}</span>
                </p>
              </div>
            </div>
          )}

          {/* Success Animation Overlay for Save */}
          {showSuccess && (
            <div className="success-overlay">
              <div className="success-animation">
                <div className="checkmark-circle">
                  <svg className="checkmark" viewBox="0 0 52 52">
                    <path d="M14,27 L22,35 L38,19" />
                  </svg>
                </div>
                <h3 className="success-title">¡Configuración guardada!</h3>
                <p className="success-message">
                  La configuración de correo se ha {isEdit ? 'actualizado' : 'creado'} correctamente
                </p>
              </div>
            </div>
          )}

          {/* Header */}
          <div className="modal-header-custom">
            <div className="header-content">
              <div className="title-section">
                <h2 className="modal-title-custom">
                  {isEdit ? "Editar Configuración SMTP" : "Nueva Configuración SMTP"}
                </h2>
                <div className="subtitle-section">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                  <span>Configuración del servidor de correo</span>
                </div>
              </div>
              <button 
                type="button" 
                className="modal-close-btn" 
                onClick={onClose}
                disabled={loading}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit} className="modal-form">
            <div className="modal-body-custom">
              <div className="form-sections">
                
                {/* Sección de Credenciales */}
                <div className="form-section">
                  <div className="section-header">
                    <h4 className="section-title">Credenciales de Acceso</h4>
                    <p className="section-subtitle">Información de autenticación del servidor</p>
                  </div>
                  
                  <div className="form-grid">
                    <div className="form-group">
                      <div className="form-input-container">
                        <input
                          name="USER_SMTP"
                          type="email"
                          className="form-input-modern"
                          placeholder="usuario@ejemplo.com"
                          value={form.USER_SMTP}
                          onChange={handleChange}
                          required
                        />
                        <label className={`form-label-floating ${form.USER_SMTP ? 'active' : ''}`}>
                          Usuario SMTP
                        </label>
                        <div className="form-highlight"></div>
                      </div>
                    </div>

                    <div className="form-group">
                      <div className="form-input-container">
                        <input
                          name="PASS_SMTP"
                          type="password"
                          className="form-input-modern"
                          placeholder="••••••••"
                          value={form.PASS_SMTP}
                          onChange={handleChange}
                          required
                        />
                        <label className={`form-label-floating ${form.PASS_SMTP ? 'active' : ''}`}>
                          Contraseña SMTP
                        </label>
                        <div className="form-highlight"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sección de Servidor */}
                <div className="form-section">
                  <div className="section-header">
                    <h4 className="section-title">Configuración del Servidor</h4>
                    <p className="section-subtitle">Información de conexión al servidor SMTP</p>
                  </div>
                  
                  <div className="form-grid">
                    <div className="form-group">
                      <div className="form-input-container">
                        <input
                          name="HOST_SMTP"
                          type="text"
                          className="form-input-modern"
                          placeholder="smtp.ejemplo.com"
                          value={form.HOST_SMTP}
                          onChange={handleChange}
                          required
                        />
                        <label className={`form-label-floating ${form.HOST_SMTP ? 'active' : ''}`}>
                          Servidor SMTP
                        </label>
                        <div className="form-highlight"></div>
                      </div>
                    </div>

                    <div className="form-group">
                      <div className="form-input-container">
                        <input
                          name="PORT_SMTP"
                          type="number"
                          className="form-input-modern"
                          placeholder="587"
                          value={form.PORT_SMTP}
                          onChange={handleChange}
                          required
                        />
                        <label className={`form-label-floating ${form.PORT_SMTP ? 'active' : ''}`}>
                          Puerto SMTP
                        </label>
                        <div className="form-highlight"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sección de Estado */}
                <div className="form-section">
                  <div className="section-header">
                    <h4 className="section-title">Estado de la Configuración</h4>
                    <p className="section-subtitle">Define si la configuración está activa o desactivada</p>
                  </div>
                  
                  <div className="form-grid">
                    <div className="form-group">
                      <div className="form-input-container">
                        <select
                          name="Estado"
                          className="form-select-modern"
                          value={form.Estado}
                          onChange={handleChange}
                          required
                        >
                          <option value="A">Activo</option>
                          <option value="D">Desactivado</option>
                        </select>
                        <label className="form-label-floating active">Estado</label>
                        <div className="form-highlight"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sección de Validación */}
                <div className="form-section">
                  <div className="section-header">
                    <h4 className="section-title">Validación de Configuración</h4>
                    <p className="section-subtitle">Prueba la configuración SMTP antes de guardar</p>
                  </div>
                  
                  <div className="form-grid">
                    <div className="form-group">
                      <div className="form-input-container">
                        <input
                          type="email"
                          className="form-input-modern"
                          placeholder="destinatario@ejemplo.com"
                          value={testEmail}
                          onChange={handleTestEmailChange}
                          disabled={loading || isValidating}
                        />
                        <label className={`form-label-floating ${testEmail ? 'active' : ''}`}>
                          Correo de Prueba
                        </label>
                        <div className="form-highlight"></div>
                      </div>
                      <p className="form-help-text">
                        Ingresa el correo donde se enviará el mensaje de prueba para validar la configuración
                      </p>
                    </div>

                    <div className="form-group validate-button-group">
                      <button
                        type="button"
                        className={`btn-validate ${isValidating ? 'validating' : ''}`}
                        onClick={handleTest}
                        disabled={loading || isValidating}
                      >
                        {isValidating ? (
                          <>
                            <div className="spinner"></div>
                            Validando...
                          </>
                        ) : (
                          <>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M9 11l3 3L22 4" />
                            </svg>
                            Validar Configuración
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="modal-footer-custom">
              <div className="footer-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={onClose}
                  disabled={loading}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="spinner"></div>
                      {isEdit ? 'Actualizando...' : 'Guardando...'}
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
                        <polyline points="17,21 17,13 7,13 7,21" />
                        <polyline points="7,3 7,8 15,8" />
                      </svg>
                      {isEdit ? 'Actualizar' : 'Guardar'}
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