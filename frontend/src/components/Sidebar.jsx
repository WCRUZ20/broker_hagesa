import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";
import API from "../services/api";

export default function Sidebar({ user, onLogout }) {
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem("darkMode");
    return stored ? stored === "true" : true;
  });
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [complementosOpen, setComplementosOpen] = useState(false);
  const [vehiculosOpen, setVehiculosOpen] = useState(false);
  const [polizasOpen, setPolizasOpen] = useState(false);
  const [seguimientoOpen, setSeguimientoOpen] = useState(false);
  const [company, setCompany] = useState(null);
  const [cargos, setCargos] = useState([]);

  useEffect(() => {
    const loadCompany = async () => {
      try {
        const res = await API.get("/company");
        if (Array.isArray(res.data) && res.data.length > 0) {
          setCompany(res.data[0]);
        }
      } catch (err) {
        console.error("Error cargando compañía", err);
      }
    };
    loadCompany();
  }, []);

  useEffect(() => {
    const loadCargos = async () => {
      try {
        const res = await API.get("/cargos");
        setCargos(res.data);
      } catch (err) {
        console.error("Error cargando cargos", err);
        setCargos([]);
      }
    };
    loadCargos();
  }, []);

  useEffect(() => {
     localStorage.setItem("darkMode", darkMode);
    // Aplicar clase al body solo si está en modo oscuro
    if (darkMode) {
      document.body.classList.add("dark-mode");
      document.body.classList.remove("light-mode");
      document.body.style.backgroundColor = "#3a3a3a"; // gris oscuro claro
      document.body.style.color = "#fff";
    } else {
      document.body.classList.remove("dark-mode");
      document.body.classList.add("light-mode");
      document.body.style.backgroundColor = "#ffffff";
      document.body.style.color = "#000";
    }
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const toggleMenu = () => {
    setMenuAbierto(!menuAbierto);
  };

  const toggleComplementos = () => {
    setComplementosOpen(prev => {
      const newState = !prev;
      if (newState) {
        setVehiculosOpen(false);
        setSeguimientoOpen(false);
        setPolizasOpen(false);
      }
      return newState;
    });
  };

   const toggleVehiculos = () => {
    setVehiculosOpen(prev => {
      const newState = !prev;
      if (newState) {
        setComplementosOpen(false);
        setPolizasOpen(false);
        setSeguimientoOpen(false);
      }
      return newState;
    });
  };

  const togglePolizas = () => {
    setPolizasOpen(prev => {
      const newState = !prev;
      if (newState) {
        setComplementosOpen(false);
        setVehiculosOpen(false);
        setSeguimientoOpen(false);
      }
      return newState;
    });
  };

  const toggleSeguimiento = () => {
    setSeguimientoOpen(prev => {
      const newState = !prev;
      if (newState) {
        setComplementosOpen(false);
        setVehiculosOpen(false);
        setPolizasOpen(false);
      }
      return newState;
    });
  };

  const closeSubmenus = () => {
    setComplementosOpen(false);
    setVehiculosOpen(false);
    setPolizasOpen(false);
    setSeguimientoOpen(false);
  };
  
  const sidebarClass = "sidebar sidebar-dark"; // Siempre oscuro

  return (
    <div className={sidebarClass}>
       <div className="sidebar-header d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <div 
            className="d-flex align-items-center justify-content-center me-3"
            style={{
              width: 42,
              height: 42,
              borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(200, 150, 82, 0.2) 0%, rgba(200, 150, 82, 0.05) 100%)',
              border: '1px solid rgba(200, 150, 82, 0.3)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <img
              src={company?.CompanyLogo || "/logo.png"}
              alt="Logo"
              style={{ 
                width: 32, 
                height: 32, 
                borderRadius: '8px',
                objectFit: 'contain'
              }}
            />
          </div>
          <div>
            <div className="fw-bold" style={{ fontSize: "1.1rem", lineHeight: '1.2' }}>
              {company?.CompanyName || "HAGESA"}
            </div>
            <div style={{ 
              fontSize: "0.55rem", 
              opacity: 0.7,
              color: 'rgba(212, 176, 131, 0.8)',
              fontWeight: '400'
            }}>
              Sistema de Seguimiento
            </div>
          </div>
        </div>
        <button 
          className="btn btn-sm btn-outline-light" 
          onClick={toggleTheme}
          title={darkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
        >
          <i className={`bi ${darkMode ? "bi-sun" : "bi-moon"}`}></i>
        </button>
      </div>
      <nav className="flex-grow-1 overflow-auto">
        <ul className="nav flex-column px-2">
          <li className="nav-item">
            <NavLink className="nav-link" to="/" onClick={closeSubmenus}>
              <i className="bi bi-house me-2"></i>Inicio
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/clientes" onClick={closeSubmenus}>
              <i className="bi bi-person-lines-fill me-2"></i>Clientes
            </NavLink>
          </li>
          <li className="nav-item">
              <div
                onClick={toggleVehiculos}
                className="nav-link d-flex justify-content-between align-items-center"
                style={{ cursor: "pointer" }}
              >
                <span>
                  <i className="bi bi-truck me-2"></i>Vehículos
                </span>
              </div>
              {vehiculosOpen && (
                <ul className="nav flex-column ms-3 submenu">
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/vehiculos-registrados">
                      <i className="bi bi-truck-front me-2"></i>Vehículos registrados
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/datos-vehiculos">
                      <i className="bi bi-card-list me-2"></i>Datos Generales
                    </NavLink>
                  </li>
                </ul>
              )}
            </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/vendedores" onClick={closeSubmenus}>
              <i className="bi bi-person-lines-fill me-2"></i>Vendedores
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/aseguradoras" onClick={closeSubmenus}>
              <i className="bi bi-shield-check me-2"></i>Aseguradoras
            </NavLink>
          </li>
          <li className="nav-item">
              <div
                onClick={togglePolizas}
                className="nav-link d-flex justify-content-between align-items-center"
                style={{ cursor: "pointer" }}
              >
                <span>
                  <i className="bi bi-file-earmark-text me-2"></i>Pólizas
                </span>
              </div>
              {polizasOpen && (
                <ul className="nav flex-column ms-3 submenu">
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/crear-poliza">
                      <i className="bi bi-plus-circle me-2"></i>Crear Póliza
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/polizas">
                      <i className="bi bi-list-ul me-2"></i>Listado de pólizas
                    </NavLink>
                  </li>
                </ul>
              )}
            </li>
          <li className="nav-item">
              <div
                onClick={toggleSeguimiento}
                className="nav-link d-flex justify-content-between align-items-center"
                style={{ cursor: "pointer" }}
              >
                <span>
                  <i className="bi bi-eye me-2"></i>Seguimiento por Correo
                </span>
              </div>
              {seguimientoOpen && (
                <ul className="nav flex-column ms-3 submenu">
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/seguimiento/clientes">
                      <i className="bi bi-people me-2"></i>Clientes
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/seguimiento/vendedores">
                      <i className="bi bi-person-lines-fill me-2"></i>Vendedores
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/seguimiento/parametros-envio">
                      <i className="bi bi-gear me-2"></i>Parámetros envío
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/seguimiento/parametrizaciones-mail">
                      <i className="bi bi-envelope me-2"></i>Config. Correo
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/seguimiento/plantillas-mail">
                      <i className="bi bi-file-text me-2"></i>Plantilla Correo
                    </NavLink>
                  </li>
                </ul>
              )}
            </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/compania" onClick={closeSubmenus}>
              <i className="bi bi-building me-2"></i>Compañía
            </NavLink>
          </li>
          {user.user_role === "A" && (
            <li className="nav-item">
              <NavLink className="nav-link" to="/usuarios" onClick={closeSubmenus}>
                <i className="bi bi-people me-2"></i>Usuarios
              </NavLink>
            </li>
          )}
          <li className="nav-item">
              <div
                onClick={toggleComplementos}
                className="nav-link d-flex justify-content-between align-items-center"
                style={{ cursor: "pointer" }}
              >
                <span>
                  <i className="bi bi-puzzle me-2"></i>Complementos
                </span>
                {/* <i
                  className={`bi ${complementosOpen ? "bi-chevron-up" : "bi-chevron-down"}`}
                ></i> */}
              </div>
              {complementosOpen && (
                <ul className="nav flex-column ms-3 submenu">
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/datos-geograficos">
                      <i className="bi bi-flag me-2"></i>Datos Geográficos
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/datos-personas">
                      <i className="bi bi-person-vcard me-2"></i>Datos Personas
                    </NavLink>
                  </li>
                  <li className="nav-item">
                      <NavLink className="nav-link" to="/cargos">
                      <i className="bi bi-diagram-3 me-2"></i>Cargos usuarios
                    </NavLink>
                  </li>
                </ul>
              )}
            </li>
        </ul>
      </nav>

      <div className="sidebar-footer">
        <div className="position-relative">
          <div
            className="d-flex align-items-center justify-content-between"
            style={{ cursor: "pointer" }}
            onClick={toggleMenu}
          >
            <div className="d-flex align-items-center">
              <img
                src={user?.user_photo || "/default-avatar.png"}
                alt="Avatar"
                className="rounded-circle me-3"
                style={{ width: 40, height: 40, objectFit: 'cover' }}
              />
              <div>
                <div className="fw-semibold" style={{ fontSize: "0.9rem" }}>
                  {user?.user_cod || "Usuario"}
                </div>
                {/* <div style={{ fontSize: "0.75rem", opacity: 0.7 }}>
                  {user?.user_role === "A" ? "Administrador" : "Usuario"}
                </div> */}
                <div style={{ fontSize: "0.75rem", opacity: 0.7 }}>
                  {cargos.find(c => c.id === user?.user_position)?.Description || "Usuario"}
                </div>
              </div>
            </div>
            <i className={`bi ${menuAbierto ? "bi-chevron-up" : "bi-chevron-down"}`}></i>
          </div>

          {menuAbierto && (
            <div
              className="position-absolute bottom-100 start-0 w-100 mb-2 py-2"
              style={{
                background: 'linear-gradient(135deg, rgba(25, 25, 25, 0.98) 0%, rgba(35, 35, 35, 0.95) 100%)',
                border: '1px solid rgba(200, 150, 82, 0.2)',
                borderRadius: '12px',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.4)',
                backdropFilter: 'blur(20px)',
                zIndex: 1050
              }}
            >
              <div className="border-bottom px-3 py-2" style={{ borderColor: 'rgba(200, 150, 82, 0.2)' }}>
                <div className="fw-semibold">{user?.user_name || "Usuario"}</div>
                <div style={{ fontSize: "0.70rem", opacity: 0.7 }}>
                  {user?.user_email || "usuario@ejemplo.com"}
                </div>
              </div>
              
              <div className="py-1">
                {/* <div 
                  className="menu-item d-flex align-items-center" 
                  style={{ cursor: "pointer", padding: "0.75rem 1.25rem" }}
                  onClick={() => {
                    setMenuAbierto(false);
                    // Aquí puedes agregar la lógica para ir al perfil
                  }}
                >
                  <i className="bi bi-person-circle"></i>
                  <span>Mi Perfil</span>
                </div>
                
                <div 
                  className="menu-item d-flex align-items-center" 
                  style={{ cursor: "pointer", padding: "0.75rem 1.25rem" }}
                  onClick={() => {
                    setMenuAbierto(false);
                    // Aquí puedes agregar la lógica para configuración
                  }}
                >
                  <i className="bi bi-gear"></i>
                  <span>Configuración</span>
                </div> */}
                
                <div 
                  className="menu-item d-flex align-items-center" 
                  style={{ cursor: "pointer", padding: "0.75rem 1.25rem" }}
                  onClick={() => {
                    setMenuAbierto(false);
                    onLogout();
                  }}
                >
                  <i className="bi bi-box-arrow-right"></i>
                  <span>Cerrar Sesión</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
