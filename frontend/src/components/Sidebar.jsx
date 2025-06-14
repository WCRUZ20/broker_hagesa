import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";
import API from "../services/api";

export default function Sidebar({ user, onLogout }) {
  const [darkMode, setDarkMode] = useState(true);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [complementosOpen, setComplementosOpen] = useState(false);
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
    // Aplicar clase al body solo si está en modo oscuro
    if (darkMode) {
      document.body.style.backgroundColor = "#3a3a3a"; // gris oscuro claro
      document.body.style.color = "#fff";
    } else {
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
    setComplementosOpen(!complementosOpen);
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
          <NavLink className="nav-link" to="/">
            <i className="bi bi-house me-2"></i>Inicio
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/clientes">
            <i className="bi bi-person-lines-fill me-2"></i>Clientes
          </NavLink>
        </li>
        {user.user_role === "A" && (
          <li className="nav-item">
            <NavLink className="nav-link" to="/usuarios">
              <i className="bi bi-people me-2"></i>Usuarios
            </NavLink>
          </li>
        )}
        <li className="nav-item">
          <NavLink className="nav-link" to="/vendedores">
            <i className="bi bi-person-lines-fill me-2"></i>Vendedores
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/compania">
            <i className="bi bi-building me-2"></i>Compañía
          </NavLink>
        </li>
        <li className="nav-item mt-3">
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
                  <NavLink className="nav-link" to="/paises">
                    <i className="bi bi-flag me-2"></i>Países
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
            className="position-absolute bg-white text-dark shadow-sm rounded py-2 px-3"
            style={{ bottom: "55px", right: "10px", minWidth: "180px", zIndex: 999 }}
          >
            <div className="dropdown-item py-1" style={{ cursor: "pointer" }}>
              Cambiar contraseña
            </div>
            <div className="dropdown-item py-1 text-danger" style={{ cursor: "pointer" }} onClick={onLogout}>
              Cerrar sesión
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
