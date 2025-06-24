import { useState, useEffect } from "react";
import API from "../services/api";
import "./ClienteModal.css"; // Estilos base
import "./AseguradoraModal.css"; // Estilos específicos

export default function AseguradoraModal({ aseguradora, onClose }) {
  const isEdit = !!aseguradora;

  const [form, setForm] = useState({
    IdentType: "",
    Identification: "",
    CompanyName: "",
    DirCompany: "",
    TelepCompany: "",
    ComiPrcnt: "",
  });

  const [types, setTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    API.get("/tipos-identificacion").then(res => setTypes(res.data));
    if (isEdit) {
      setForm({
        IdentType: aseguradora.IdentType || "",
        Identification: aseguradora.Identification || "",
        CompanyName: aseguradora.CompanyName || "",
        DirCompany: aseguradora.DirCompany || "",
        TelepCompany: aseguradora.TelepCompany || "",
        ComiPrcnt: aseguradora.ComiPrcnt || "",
      });
    }
  }, [aseguradora]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);
    
    const data = {
      ...form,
      ComiPrcnt: Number(form.ComiPrcnt),
    };
    
    try {
      if (isEdit) {
        await API.put(`/aseguradoras/${aseguradora.id}`, data);
      } else {
        await API.post("/aseguradoras", data);
      }
      
      // Mostrar animación de éxito
      setShowSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
      
    } catch (err) {
      console.error("Error al guardar aseguradora:", err);
      alert("Error al guardar aseguradora");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const isFormValid = form.IdentType && form.Identification && form.CompanyName && form.ComiPrcnt;

  return (
    <div className="modal-backdrop aseguradora-modal" onClick={handleBackdropClick}>
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
                <h3 className="success-title">¡Éxito!</h3>
                <p className="success-message">
                  La aseguradora se {isEdit ? 'actualizó' : 'creó'} correctamente
                </p>
              </div>
            </div>
          )}

          {/* Header */}
          <div className="modal-header-custom">
            <div className="header-content">
              <div className="title-section">
                <h2 className="modal-title-custom">
                  {isEdit ? 'Editar Aseguradora' : 'Nueva Aseguradora'}
                </h2>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  color: 'rgb(212, 176, 131)',
                  fontSize: '0.85rem',
                  marginTop: '0.5rem'
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
                    <path d="M19 15L20.09 17.26L23 18L20.09 18.74L19 21L17.91 18.74L15 18L17.91 17.26L19 15Z"/>
                    <path d="M5 15L6.09 17.26L9 18L6.09 18.74L5 21L3.91 18.74L1 18L3.91 17.26L5 15Z"/>
                  </svg>
                  {isEdit ? 'Modificar información de la aseguradora' : 'Registrar nueva aseguradora en el sistema'}
                </div>
              </div>
              <button 
                className="modal-close-btn" 
                onClick={onClose}
                disabled={isLoading}
                type="button"
              >
                ×
              </button>
            </div>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit}>
            <div className="modal-body-custom">
              <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                
                {/* Tipo de Identificación */}
                <div className="form-group-modern">
                  <select
                    name="IdentType"
                    className="form-select-modern"
                    value={form.IdentType}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                  >
                    <option value="">Seleccionar tipo...</option>
                    {types.map(t => (
                      <option key={t.id} value={t.id}>{t.Description}</option>
                    ))}
                  </select>
                  <label className="form-label-modern">Tipo de Identificación *</label>
                  <div className="form-highlight"></div>
                </div>

                {/* Identificación */}
                <div className="form-group-modern">
                  <input
                    name="Identification"
                    className="form-input-modern"
                    placeholder=" "
                    value={form.Identification}
                    onChange={handleChange}
                    disabled={isLoading}
                    required
                  />
                  <label className="form-label-modern">Número de Identificación *</label>
                  <div className="form-highlight"></div>
                </div>

                {/* Nombre de la Empresa */}
                <div className="form-group-modern full-width">
                  <input
                    name="CompanyName"
                    className="form-input-modern"
                    placeholder=" "
                    value={form.CompanyName}
                    onChange={handleChange}
                    disabled={isLoading}
                    required
                  />
                  <label className="form-label-modern">Nombre de la Empresa *</label>
                  <div className="form-highlight"></div>
                </div>

                {/* Dirección */}
                <div className="form-group-modern">
                  <input
                    name="DirCompany"
                    className="form-input-modern"
                    placeholder=" "
                    value={form.DirCompany}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                  <label className="form-label-modern">Dirección</label>
                  <div className="form-highlight"></div>
                </div>

                {/* Teléfono */}
                <div className="form-group-modern">
                  <input
                    name="TelepCompany"
                    className="form-input-modern"
                    placeholder=" "
                    value={form.TelepCompany}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                  <label className="form-label-modern">Teléfono</label>
                  <div className="form-highlight"></div>
                </div>

                {/* Comisión Porcentaje */}
                <div className="form-group-modern">
                  <input
                    name="ComiPrcnt"
                    type="number"
                    className="form-input-modern"
                    placeholder=" "
                    value={form.ComiPrcnt}
                    onChange={handleChange}
                    disabled={isLoading}
                    min="0"
                    max="100"
                    step="0.01"
                    required
                  />
                  <label className="form-label-modern">Comisión (%) *</label>
                  <div className="form-highlight"></div>
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
                  disabled={isLoading}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
                  </svg>
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="btn-primary" 
                  disabled={isLoading || !isFormValid}
                >
                  {isLoading ? (
                    <>
                      <div className="spinner"></div>
                      Guardando...
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M15,9H5V5H15M12,19A3,3 0 0,1 9,16A3,3 0 0,1 12,13A3,3 0 0,1 15,16A3,3 0 0,1 12,19M17,3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V7L17,3Z"/>
                      </svg>
                      {isEdit ? 'Actualizar' : 'Guardar'} Aseguradora
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