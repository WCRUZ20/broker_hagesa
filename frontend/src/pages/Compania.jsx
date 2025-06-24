import { useState, useEffect } from "react";
import API from "../services/api";
import "./Compania.css";

export default function Compania() {
  const [form, setForm] = useState({
    IdCompany: "",
    CompanyName: "",
    CompanyLogo: "",
  });
  const [isNew, setIsNew] = useState(true);
  const [originalId, setOriginalId] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await API.get("/company");
        if (Array.isArray(res.data) && res.data.length > 0) {
          setForm(res.data[0]);
          setOriginalId(res.data[0].IdCompany);
          setIsNew(false);
        } else {
          setIsNew(true);
        }
      } catch (err) {
        console.error("Error cargando compañía", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogoChange = (file) => {
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    const maxSize = 1024 * 1024; // 1MB

    if (!validTypes.includes(file.type)) {
      alert("Solo se permiten imágenes JPG, PNG o WebP.");
      return;
    }
    if (file.size > maxSize) {
      alert("La imagen no debe superar 1 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, CompanyLogo: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    handleLogoChange(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleLogoChange(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isNew) {
        await API.post("/company", form);
        setOriginalId(form.IdCompany);
        setIsNew(false);
      } else {
        await API.put(`/company/${originalId}`, form);
        setOriginalId(form.IdCompany);
      }
      
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (err) {
      console.error("Error al guardar:", err);
      alert("Error al guardar. Por favor, intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const resetLogo = () => {
    setForm((prev) => ({ ...prev, CompanyLogo: "" }));
  };

  return (
    <div className="compania-container">
      {/* Header con gradiente */}
      <div className="compania-header">
        <div className="header-content">
          <div className="header-text">
            <h1 className="page-title">
              <i className="bi bi-building me-3"></i>
              Configuración de Compañía
            </h1>
            <p className="page-subtitle">
              Gestiona la información principal de tu empresa
            </p>
          </div>
          <div className="header-decoration">
            <div className="decoration-circle"></div>
            <div className="decoration-line"></div>
          </div>
        </div>
      </div>

      {/* Notificación de éxito */}
      {showSuccess && (
        <div className="success-notification show">
          <div className="success-content">
            <div className="success-icon">
              <i className="bi bi-check-circle-fill"></i>
            </div>
            <div className="success-text">
              <h4>¡Datos guardados exitosamente!</h4>
              <p>La información de la compañía se ha actualizado correctamente.</p>
            </div>
          </div>
        </div>
      )}

      {/* Contenido principal */}
      <div className="compania-content">
        <div className="form-container">
          <form onSubmit={handleSubmit} className="compania-form">
            
            {/* Campo RUC */}
            <div className="form-group-modern">
              <input
                name="IdCompany"
                className="form-input-modern"
                placeholder=" "
                value={form.IdCompany}
                onChange={handleChange}
                required
                disabled={loading}
              />
              <label className="form-label-modern">
                <i className="bi bi-card-text me-2"></i>
                RUC / Identificación Fiscal *
              </label>
              <div className="form-highlight"></div>
            </div>

            {/* Campo Nombre */}
            <div className="form-group-modern">
              <input
                name="CompanyName"
                className="form-input-modern"
                placeholder=" "
                value={form.CompanyName}
                onChange={handleChange}
                required
                disabled={loading}
              />
              <label className="form-label-modern">
                <i className="bi bi-building me-2"></i>
                Nombre de la Compañía *
              </label>
              <div className="form-highlight"></div>
            </div>

            {/* Zona de carga de logo */}
            <div className="logo-section">
              <label className="logo-label">
                <i className="bi bi-image me-2"></i>
                Logo de la Empresa
              </label>
              
              <div 
                className={`logo-upload-zone ${dragOver ? 'drag-over' : ''} ${form.CompanyLogo ? 'has-image' : ''}`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                {form.CompanyLogo ? (
                  <div className="logo-preview">
                    <img 
                      src={form.CompanyLogo} 
                      alt="Logo de la empresa" 
                      className="company-logo"
                    />
                    <div className="logo-overlay">
                      <button
                        type="button"
                        className="btn-logo-action btn-change"
                        onClick={() => document.getElementById('logo-input').click()}
                      >
                        <i className="bi bi-pencil"></i>
                        Cambiar
                      </button>
                      <button
                        type="button"
                        className="btn-logo-action btn-remove"
                        onClick={resetLogo}
                      >
                        <i className="bi bi-trash"></i>
                        Eliminar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="upload-placeholder">
                    <div className="upload-icon">
                      <i className="bi bi-cloud-upload"></i>
                    </div>
                    <h4>Sube el logo de tu empresa</h4>
                    <p>Arrastra y suelta una imagen aquí, o haz clic para seleccionar</p>
                    <div className="upload-specs">
                      <span><i className="bi bi-info-circle me-1"></i>JPG, PNG, WebP</span>
                      <span><i className="bi bi-hdd me-1"></i>Máx. 1MB</span>
                    </div>
                    <button
                      type="button"
                      className="btn-upload"
                      onClick={() => document.getElementById('logo-input').click()}
                    >
                      <i className="bi bi-folder-plus me-2"></i>
                      Seleccionar Archivo
                    </button>
                  </div>
                )}
              </div>

              <input
                id="logo-input"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileInputChange}
                style={{ display: 'none' }}
                disabled={loading}
              />
            </div>

            {/* Botón de envío */}
            <div className="form-actions">
              <button 
                className={`btn-submit ${loading ? 'loading' : ''}`} 
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="spinner"></div>
                    Guardando...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-lg me-2"></i>
                    {isNew ? 'Crear Compañía' : 'Actualizar Datos'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Panel de información */}
        <div className="info-panel">
          <div className="info-header">
            <i className="bi bi-info-circle-fill"></i>
            <h3>Información Importante</h3>
          </div>
          <div className="info-content">
            <div className="info-item">
              <i className="bi bi-shield-check"></i>
              <div>
                <h4>Identificación Fiscal</h4>
                <p>El RUC debe ser válido y corresponder a tu empresa registrada.</p>
              </div>
            </div>
            <div className="info-item">
              <i className="bi bi-image"></i>
              <div>
                <h4>Logo de Empresa</h4>
                <p>Se recomienda usar imágenes cuadradas o con fondo transparente para mejor visualización.</p>
              </div>
            </div>
            <div className="info-item">
              <i className="bi bi-gear"></i>
              <div>
                <h4>Configuración Global</h4>
                <p>Estos datos se mostrarán en el sistema y en los documentos generados.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}