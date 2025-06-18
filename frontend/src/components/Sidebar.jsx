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
      <div className="sidebar-header d-flex justify-content-between align-items-center px-3 py-2 border-bottom">
        <div className="d-flex align-items-center">
          <img
            src={company?.CompanyLogo || "/logo.png"}
            alt="Logo"
            style={{ width: 36, height: 36, marginRight: 8 }}
          />
          <span className="fw-bold" style={{ fontSize: "1.1rem" }}>
            {company?.CompanyName || "HAGESA"}
          </span>
        </div>
        <button className="btn btn-sm btn-outline-light" onClick={toggleTheme}>
          <i className={`bi ${darkMode ? "bi-sun" : "bi-moon"}`}></i>
        </button>
      </div>

      <ul className="nav flex-column mt-3 px-2">
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
                <i className="bi bi-eye me-2"></i>Seguimiento
              </span>
            </div>
            {seguimientoOpen && (
              <ul className="nav flex-column ms-3 submenu">
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

      <div className="sidebar-footer px-3 mt-auto border-top py-3 position-relative">
        <div className="d-flex align-items-center justify-content-between">
          <div onClick={toggleMenu} style={{ cursor: "pointer" }} className="d-flex align-items-center">
            <img
              src={user.user_photo || "/avatar.png"}
              className="rounded-circle me-2"
              width={36}
              height={36}
              alt=""
            />
            <span>{user.user_cod}</span>
          </div>
        </div>

        {menuAbierto && (
          <div
            className="position-absolute shadow-lg rounded-2 py-2"
            style={{ 
              bottom: "65px", 
              right: "10px", 
              minWidth: "200px", 
              zIndex: 999,
              backgroundColor: "#2c2c2c",
              border: "1px solid #404040",
              backdropFilter: "blur(10px)"
            }}
          >
            <div 
              className="d-flex align-items-center px-3 py-2 border-bottom" 
              style={{ 
                borderColor: "#404040 !important",
                color: "#e0e0e0",
                fontSize: "0.9rem"
              }}
            >
              <i className="bi bi-person-circle me-2"></i>
              <span className="fw-medium">{user.user_name || user.user_cod}</span>
            </div>
            
            <div 
              className="d-flex align-items-center px-3 py-2 menu-item" 
              style={{ 
                cursor: "pointer",
                color: "#e0e0e0",
                fontSize: "0.9rem",
                transition: "all 0.2s ease"
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#404040";
                e.target.style.color = "#ffffff";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "transparent";
                e.target.style.color = "#e0e0e0";
              }}
            >
              <i className="bi bi-key me-2"></i>
              Cambiar contraseña
            </div>
            
            <div 
              className="d-flex align-items-center px-3 py-2 menu-item" 
              style={{ 
                cursor: "pointer",
                color: "#ff6b6b",
                fontSize: "0.9rem",
                transition: "all 0.2s ease"
              }}
              onClick={onLogout}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#ff6b6b";
                e.target.style.color = "#ffffff";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "transparent";
                e.target.style.color = "#ff6b6b";
              }}
            >
              <i className="bi bi-box-arrow-right me-2"></i>
              Cerrar sesión
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
