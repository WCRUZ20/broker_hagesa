import { useState, useEffect } from "react";
import API from "../services/api";
import "./UsuarioModal.css";

export default function UsuarioModal({ user, onClose }) {
  const isEdit = !!user;

  const [form, setForm] = useState({
    user_name: "",
    last_name: "",
    user_role: "R",
    user_cod: "",
    user_email: "",
    user_password: "",
    user_photo: "",
    user_position: "",
    user_status: "Habilitado"
  });
  
  const [cargos, setCargos] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await API.get("/cargos");
        setCargos(res.data);
        
        if (isEdit) {
          setForm({ 
            ...user, 
            user_password: "", 
            user_position: user.user_position ?? "" 
          });
          setShowPassword(false);
        }
      } catch (error) {
        console.error("Error loading data:", error);
        setCargos([]);
      }
    };
    
    loadData();
  }, [user, isEdit]);

  const handleChange = (e) => {
    const value =
      e.target.name === "user_position"
        ? e.target.value === "" ? "" : Number(e.target.value)
        : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const validTypes = ["image/jpeg", "image/png"];
      const maxSize = 500 * 1024;

      if (!validTypes.includes(file.type)) {
        alert("Solo se permiten imágenes JPG o PNG.");
        return;
      }

      if (file.size > maxSize) {
        alert("La imagen no debe superar los 500 KB.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prevForm) => ({
          ...prevForm,
          user_photo: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      let payload = { ...form };
      if (payload.user_position === "") {
        payload.user_position = null;
      }
      if (isEdit && !payload.user_password.trim()) {
        delete payload.user_password;
      }
      
      if (isEdit) {
        await API.put(`/users/${user.id}`, payload);
      } else {
        await API.post("/users/create", payload);
      }
      
      // Mostrar animación de éxito
      setShowSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2500);
      
    } catch (err) {
      console.error("Error saving user:", err);
      alert("Error al guardar el usuario. Por favor, intente nuevamente.");
      setLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !loading && !showSuccess) {
      onClose();
    }
  };

  const nextStep = () => {
    if (currentStep < 2) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const goToStep = (step) => {
    if (!loading && !showSuccess) {
      if (step === 1 || (step === 2 && (isEdit || isStep1Valid))) {
        setCurrentStep(step);
      }
    }
  };

  const isStep1Valid = form.user_name && form.last_name && form.user_cod && form.user_email;

  return (
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
                  {isEdit ? "¡Usuario Actualizado!" : "¡Usuario Creado!"}
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
                    {isEdit ? "Editar Usuario" : "Nuevo Usuario"}
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
                      <span className="step-label">Configuración</span>
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
                    <p className="step-description">Complete los datos personales del usuario</p>
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group-modern">
                    <input
                      name="user_name"
                      className="form-input-modern"
                      placeholder=" "
                      value={form.user_name}
                      onChange={handleChange}
                      required
                    />
                    <label className="form-label-modern">Nombre *</label>
                    <div className="form-highlight"></div>
                  </div>

                  <div className="form-group-modern">
                    <input
                      name="last_name"
                      className="form-input-modern"
                      placeholder=" "
                      value={form.last_name}
                      onChange={handleChange}
                      required
                    />
                    <label className="form-label-modern">Apellido *</label>
                    <div className="form-highlight"></div>
                  </div>

                  <div className="form-group-modern">
                    <input
                      name="user_cod"
                      className="form-input-modern"
                      placeholder=" "
                      value={form.user_cod}
                      onChange={handleChange}
                      required
                    />
                    <label className="form-label-modern">Código Usuario *</label>
                    <div className="form-highlight"></div>
                  </div>

                  <div className="form-group-modern">
                    <input
                      name="user_email"
                      className="form-input-modern"
                      placeholder=" "
                      type="email"
                      value={form.user_email}
                      onChange={handleChange}
                      required
                    />
                    <label className="form-label-modern">Correo Electrónico *</label>
                    <div className="form-highlight"></div>
                  </div>

                  <div className="form-group-modern">
                    <select
                      name="user_position"
                      className="form-select-modern"
                      value={form.user_position}
                      onChange={handleChange}
                    >
                      <option value="">Seleccionar cargo</option>
                      {cargos.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.Description}
                        </option>
                      ))}
                    </select>
                    <label className="form-label-modern">Cargo</label>
                    <div className="form-highlight"></div>
                  </div>

                  <div className="form-group-modern">
                    <input
                      type="file"
                      accept="image/*"
                      className="form-input-modern"
                      onChange={handlePhotoChange}
                    />
                    <label className="form-label-modern">Foto de Perfil</label>
                    <div className="form-highlight"></div>
                  </div>

                  {form.user_photo && (
                    <div className="form-group-modern full-width">
                      <div className="photo-preview-container">
                        <img
                          src={form.user_photo}
                          alt="Vista previa"
                          className="photo-preview"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Step 2: Configuration */}
              <div className={`form-step ${currentStep === 2 ? 'active' : ''}`}>
                <div className="step-header">
                  <div className="step-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="step-title">Configuración de Acceso</h3>
                    <p className="step-description">Configure la contraseña y permisos del usuario</p>
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group-modern">
                    <div className="input-group-modern">
                      <input
                        name="user_password"
                        className="form-input-modern"
                        placeholder=" "
                        type={showPassword ? "text" : "password"}
                        value={form.user_password}
                        onChange={handleChange}
                        {...(!isEdit && { required: true })}
                      />
                      <label className="form-label-modern">
                        {isEdit ? "Nueva Contraseña (opcional)" : "Contraseña *"}
                      </label>
                      <button
                        type="button"
                        className="password-toggle-btn"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          {showPassword ? (
                            <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
                          ) : (
                            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                          )}
                        </svg>
                      </button>
                      <div className="form-highlight"></div>
                    </div>
                  </div>

                  <div className="form-group-modern">
                    <select
                      name="user_role"
                      className="form-select-modern"
                      value={form.user_role}
                      onChange={handleChange}
                    >
                      <option value="A">Administrador</option>
                      <option value="R">Regular</option>
                    </select>
                    <label className="form-label-modern">Rol de Usuario</label>
                    <div className="form-highlight"></div>
                  </div>

                  <div className="form-group-modern">
                    <select
                      name="user_status"
                      className="form-select-modern"
                      value={form.user_status}
                      onChange={handleChange}
                      required
                    >
                      <option value="Habilitado">Habilitado</option>
                      <option value="Deshabilitado">Deshabilitado</option>
                    </select>
                    <label className="form-label-modern">Estado del Usuario</label>
                    <div className="form-highlight"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer with Navigation */}
            <div className="modal-footer-custom">
              <div className="footer-actions">
                <div>
                  {currentStep === 2 && (
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={prevStep}
                      disabled={loading}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
                      </svg>
                      Anterior
                    </button>
                  )}
                </div>
                
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={onClose}
                    disabled={loading}
                  >
                    Cancelar
                  </button>
                  
                  {currentStep === 1 ? (
                    <button
                      type="button"
                      className="btn-next"
                      onClick={nextStep}
                      disabled={!isStep1Valid || loading}
                    >
                      Siguiente
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M4 11h12.17l-5.59-5.59L12 4l8 8-8 8-1.41-1.41L16.17 13H4v-2z"/>
                      </svg>
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="btn-primary"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <div className="spinner"></div>
                          Guardando...
                        </>
                      ) : (
                        <>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/>
                          </svg>
                          {isEdit ? "Actualizar Usuario" : "Crear Usuario"}
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
  );
}