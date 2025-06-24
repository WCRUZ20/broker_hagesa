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

  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
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
    }
  }, [config, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleTest = async () => {
    setIsValidating(true);
    try {
      await API.post("/seguimiento/parametrizaciones-mail/test-config", form);
      alert("Configuración SMTP válida");
    } catch (error) {
      const msg = error.response?.data?.detail || "Error al validar configuración";
      alert(msg);
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
          
          {/* Success Animation Overlay */}
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
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                  <span>Configuración del servidor de correo</span>
                </div>
              </div>
              <button 
                type="button" 
                className="close-button" 
                onClick={onClose}
                disabled={loading}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
                      <label className="form-label-modern">Usuario SMTP</label>
                      <div className="input-container">
                        <input
                          name="USER_SMTP"
                          type="email"
                          className="form-input-modern"
                          placeholder="usuario@dominio.com"
                          value={form.USER_SMTP}
                          onChange={handleChange}
                          required
                          disabled={loading}
                        />
                        <div className="form-highlight"></div>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label-modern">Contraseña SMTP</label>
                      <div className="input-container">
                        <input
                          name="PASS_SMTP"
                          type="password"
                          className="form-input-modern"
                          placeholder="••••••••••••"
                          value={form.PASS_SMTP}
                          onChange={handleChange}
                          required
                          disabled={loading}
                        />
                        <div className="form-highlight"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sección de Configuración del Servidor */}
                <div className="form-section">
                  <div className="section-header">
                    <h4 className="section-title">Configuración del Servidor</h4>
                    <p className="section-subtitle">Parámetros de conexión SMTP</p>
                  </div>
                  
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label-modern">Host SMTP</label>
                      <div className="input-container">
                        <input
                          name="HOST_SMTP"
                          type="text"
                          className="form-input-modern"
                          placeholder="smtp.gmail.com"
                          value={form.HOST_SMTP}
                          onChange={handleChange}
                          required
                          disabled={loading}
                        />
                        <div className="form-highlight"></div>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label-modern">Puerto SMTP</label>
                      <div className="input-container">
                        <input
                          name="PORT_SMTP"
                          type="number"
                          className="form-input-modern"
                          placeholder="587"
                          value={form.PORT_SMTP}
                          onChange={handleChange}
                          required
                          disabled={loading}
                        />
                        <div className="form-highlight"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sección de Estado */}
                <div className="form-section">
                  <div className="section-header">
                    <h4 className="section-title">Estado de la Configuración</h4>
                    <p className="section-subtitle">Activar o desactivar la configuración</p>
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label-modern">Estado</label>
                    <div className="input-container">
                      <select
                        name="Estado"
                        className="form-select-modern"
                        value={form.Estado}
                        onChange={handleChange}
                        disabled={loading}
                      >
                        <option value="A">Activo</option>
                        <option value="D">Desactivado</option>
                      </select>
                      <div className="form-highlight"></div>
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
                    <path d="M18 6L6 18M6 6l12 12"/>
                  </svg>
                  Cancelar
                </button>
                
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button 
                    type="button" 
                    className="btn-next" 
                    onClick={handleTest}
                    disabled={loading || isValidating}
                  >
                    {isValidating ? (
                      <>
                        <div className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></div>
                        Validando...
                      </>
                    ) : (
                      <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M9 12l2 2 4-4"/>
                          <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c1.68 0 3.25.46 4.6 1.27"/>
                        </svg>
                        Validar
                      </>
                    )}
                  </button>
                  
                  <button 
                    type="submit" 
                    className="btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></div>
                        Guardando...
                      </>
                    ) : (
                      <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                          <polyline points="17,21 17,13 7,13 7,21"/>
                          <polyline points="7,3 7,8 15,8"/>
                        </svg>
                        {isEdit ? 'Actualizar' : 'Guardar'}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}