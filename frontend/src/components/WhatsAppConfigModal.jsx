import { useState, useEffect } from "react";
import API from "../services/api";
import "./WhatsAppConfigModal.css";

export default function WhatsAppConfigModal({ config, onClose }) {
  const isEdit = !!config;

  const [form, setForm] = useState({
    ACCOUNT_SID: "",
    AUTH_TOKEN: "",
    FROM_NUMBER: "",
    Estado: "A",
  });
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (isEdit) {
      setForm({
        ACCOUNT_SID: config.ACCOUNT_SID || "",
        AUTH_TOKEN: config.AUTH_TOKEN || "",
        FROM_NUMBER: config.FROM_NUMBER || "",
        Estado: config.Estado || "A",
      });
    }
  }, [config, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit) {
        await API.put(`/seguimiento/parametrizaciones-whatsapp/${config.id}`, form);
      } else {
        await API.post("/seguimiento/parametrizaciones-whatsapp", form);
      }
      setShowSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      const msg = err.response?.data?.detail || "Error al guardar";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-container">
        <div className="modal-content-custom">
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
                  La configuración de WhatsApp se ha {isEdit ? "actualizado" : "creado"} correctamente
                </p>
              </div>
            </div>
          )}

          <div className="modal-header-custom">
            <div className="header-content">
              <div className="title-section">
                <h2 className="modal-title-custom">
                  {isEdit ? "Editar Configuración WhatsApp" : "Nueva Configuración WhatsApp"}
                </h2>
                <div className="subtitle-section">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                  <span>Credenciales del servicio de WhatsApp</span>
                </div>
              </div>
              <button type="button" className="modal-close-btn" onClick={onClose} disabled={loading}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="modal-form">
            <div className="modal-body-custom">
              <div className="form-sections">
                <div className="form-section">
                  <div className="section-header">
                    <h4 className="section-title">Credenciales</h4>
                    <p className="section-subtitle">Datos de autenticación del servicio</p>
                  </div>
                  <div className="form-grid">
                    <div className="form-group">
                      <div className="form-input-container">
                        <input
                          name="ACCOUNT_SID"
                          type="text"
                          className="form-input-modern"
                          placeholder="SID"
                          value={form.ACCOUNT_SID}
                          onChange={handleChange}
                          required
                        />
                        <label className={`form-label-floating ${form.ACCOUNT_SID ? 'active' : ''}`}>SID</label>
                        <div className="form-highlight"></div>
                      </div>
                    </div>
                    <div className="form-group">
                      <div className="form-input-container">
                        <input
                          name="AUTH_TOKEN"
                          type="text"
                          className="form-input-modern"
                          placeholder="Token"
                          value={form.AUTH_TOKEN}
                          onChange={handleChange}
                          required
                        />
                        <label className={`form-label-floating ${form.AUTH_TOKEN ? 'active' : ''}`}>Token</label>
                        <div className="form-highlight"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <div className="section-header">
                    <h4 className="section-title">Número de Envío</h4>
                    <p className="section-subtitle">Teléfono configurado para los mensajes</p>
                  </div>
                  <div className="form-grid">
                    <div className="form-group">
                      <div className="form-input-container">
                        <input
                          name="FROM_NUMBER"
                          type="text"
                          className="form-input-modern"
                          placeholder="whatsapp:+123456789"
                          value={form.FROM_NUMBER}
                          onChange={handleChange}
                          required
                        />
                        <label className={`form-label-floating ${form.FROM_NUMBER ? 'active' : ''}`}>Número Remitente</label>
                        <div className="form-highlight"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <div className="section-header">
                    <h4 className="section-title">Estado</h4>
                    <p className="section-subtitle">Define si la configuración está activa</p>
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
              </div>
            </div>
            <div className="modal-footer-custom">
              <div className="footer-actions">
                <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary" disabled={loading}>
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