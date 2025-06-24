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
    if (e.target === e.currentTarget && !loading) {
      onClose();
    }
  };

  const handleTest = async () => {
    setIsValidating(true);
    try {
      await API.post("/seguimiento/parametrizaciones-mail/test-config", form);
      alert("✅ Configuración SMTP válida");
    } catch (error) {
      const msg = error.response?.data?.detail || "❌ Error al validar configuración";
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
      alert(`❌ ${msg}`);
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
                  {isEdit ? "Editar SMTP" : "Nueva Configuración SMTP"}
                </h2>
                <div className="subtitle-section">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                  <span>Servidor de correo</span>
                </div>
              </div>
              <button 
                type="button" 
                className="modal-close-btn" 
                onClick={onClose}
                disabled={loading}
                title="Cerrar"
              >
                ×
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
                      <div className="form-input-container">
                        <input
                          type="email"
                          name="USER_SMTP"
                          value={form.USER_SMTP}
                          onChange={handleChange}
                          className="form-input-modern"
                          placeholder="usuario@dominio.com"
                          required
                          disabled={loading}
                        />
                        <div className="form-highlight"></div>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label-modern">Contraseña</label>
                      <div className="form-input-container">
                        <input
                          type="password"
                          name="PASS_SMTP"
                          value={form.PASS_SMTP}
                          onChange={handleChange}
                          className="form-input-modern"
                          placeholder="••••••••"
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
                    <p className="section-subtitle">Datos de conexión al servidor SMTP</p>
                  </div>
                  
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label-modern">Host SMTP</label>
                      <div className="form-input-container">
                        <input
                          type="text"
                          name="HOST_SMTP"
                          value={form.HOST_SMTP}
                          onChange={handleChange}
                          className="form-input-modern"
                          placeholder="smtp.gmail.com"
                          required
                          disabled={loading}
                        />
                        <div className="form-highlight"></div>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label-modern">Puerto</label>
                      <div className="form-input-container">
                        <input
                          type="number"
                          name="PORT_SMTP"
                          value={form.PORT_SMTP}
                          onChange={handleChange}
                          className="form-input-modern"
                          placeholder="587"
                          min="1"
                          max="65535"
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
                    <h4 className="section-title">Estado</h4>
                    <p className="section-subtitle">Estado de la configuración</p>
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label-modern">Estado</label>
                    <div className="form-input-container">
                      <select
                        name="Estado"
                        value={form.Estado}
                        onChange={handleChange}
                        className="form-select-modern"
                        disabled={loading}
                      >
                        <option value="A">Activo</option>
                        <option value="I">Inactivo</option>
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
                    <path d="m15 18-6-6 6-6"/>
                  </svg>
                  Cancelar
                </button>

                <div style={{ display: 'flex', gap: '0.8rem' }}>
                  <button
                    type="button"
                    className="btn-next"
                    onClick={handleTest}
                    disabled={loading || isValidating || !form.USER_SMTP || !form.PASS_SMTP || !form.HOST_SMTP || !form.PORT_SMTP}
                  >
                    {isValidating ? (
                      <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
                          <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                          <path d="M3 3v5h5"/>
                          <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/>
                          <path d="M21 21v-5h-5"/>
                        </svg>
                        Validando...
                      </>
                    ) : (
                      <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                          <polyline points="22,4 12,14.01 9,11.01"/>
                        </svg>
                        Probar
                      </>
                    )}
                  </button>

                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={loading || !form.USER_SMTP || !form.PASS_SMTP || !form.HOST_SMTP || !form.PORT_SMTP}
                  >
                    {loading ? (
                      <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
                          <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                          <path d="M3 3v5h5"/>
                          <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/>
                          <path d="M21 21v-5h-5"/>
                        </svg>
                        Guardando...
                      </>
                    ) : (
                      <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
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

      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}