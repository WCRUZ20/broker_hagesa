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
      
      // Mostrar mensaje de éxito
      alert(`✅ ${response.data.msg}\n\nDetalles:\n• Servidor: ${response.data.details?.servidor}\n• Puerto: ${response.data.details?.puerto}\n• Usuario: ${response.data.details?.usuario}\n• Correo de prueba enviado a: ${response.data.details?.destino}`);
      
    } catch (error) {
      const errorMsg = error.response?.data?.detail || "Error al validar configuración";
      
      // Mostrar mensaje de error detallado
      let alertMessage = `❌ Error en la validación SMTP:\n\n${errorMsg}`;
      
      if (error.response?.status === 401) {
        alertMessage += "\n\n💡 Sugerencias:\n• Verifica que el usuario y contraseña sean correctos\n• Para Gmail, usa una contraseña de aplicación en lugar de tu contraseña normal\n• Asegúrate de que la autenticación de dos factores esté configurada si es necesaria";
      } else if (error.response?.status === 500) {
        alertMessage += "\n\n💡 Sugerencias:\n• Verifica que el servidor SMTP y puerto sean correctos\n• Asegúrate de que tu firewall permita la conexión\n• Algunos proveedores requieren configuraciones específicas";
      }
      
      alert(alertMessage);
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
                    <p className="section-subtitle">Define si esta configuración estará activa</p>
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label-modern">Estado</label>
                    <div className="input-container">
                      <select
                        name="Estado"
                        className="form-select-modern"
                        value={form.Estado}
                        onChange={handleChange}
                        required
                        disabled={loading}
                      >
                        <option value="A">Activo</option>
                        <option value="D">Desactivado</option>
                      </select>
                      <div className="form-highlight"></div>
                    </div>
                  </div>
                </div>

                {/* Nueva Sección de Validación - Usando el mismo estilo */}
                <div className="form-section">
                  <div className="section-header">
                    <h4 className="section-title">Validación de Configuración</h4>
                    <p className="section-subtitle">Prueba la configuración SMTP antes de guardar</p>
                  </div>
                  
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label-modern">Correo de Prueba</label>
                      <div className="input-container">
                        <input
                          type="email"
                          className="form-input-modern"
                          placeholder="destinatario@ejemplo.com"
                          value={testEmail}
                          onChange={handleTestEmailChange}
                          disabled={loading || isValidating}
                        />
                        <div className="form-highlight"></div>
                      </div>
                      <p style={{ 
                        color: 'rgb(150, 146, 138)', 
                        fontSize: '0.75rem', 
                        marginTop: '0.5rem',
                        lineHeight: '1.4'
                      }}>
                        Ingresa el correo donde se enviará el mensaje de prueba para validar la configuración
                      </p>
                    </div>

                    <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
                      <button
                        type="button"
                        className={`btn-next ${isValidating ? 'validating' : ''}`}
                        onClick={handleTest}
                        disabled={loading || isValidating}
                        style={{ width: '100%', margin: 0 }}
                      >
                        {isValidating ? (
                          <>
                            <div className="spinner" style={{
                              width: '16px',
                              height: '16px',
                              border: '2px solid rgba(20, 20, 20, 0.3)',
                              borderRadius: '50%',
                              borderTopColor: 'rgb(20, 20, 20)',
                              animation: 'spin 0.8s linear infinite'
                            }}></div>
                            Validando...
                          </>
                        ) : (
                          <>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M9 12l2 2 4-4"></path>
                              <circle cx="12" cy="12" r="10"></circle>
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
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="spinner" style={{
                        width: '16px',
                        height: '16px',
                        border: '2px solid rgba(255, 255, 255, 0.3)',
                        borderRadius: '50%',
                        borderTopColor: 'white',
                        animation: 'spin 0.8s linear infinite'
                      }}></div>
                      {isEdit ? 'Actualizando...' : 'Guardando...'}
                    </>
                  ) : (
                    <>
                      {isEdit ? 'Actualizar' : 'Guardar'} Configuración
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