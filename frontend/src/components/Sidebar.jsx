import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar({ user, onLogout }) {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    document.body.className = darkMode ? "bg-dark text-white" : "bg-light text-dark";
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const sidebarClass = darkMode ? "sidebar sidebar-dark" : "sidebar sidebar-light";

  return (
    <div className={sidebarClass}>
      <div className="sidebar-header d-flex justify-content-between align-items-center px-3 py-2 border-bottom">
        <span className="fw-bold"><i className="bi bi-bootstrap-fill me-2"></i>Sidebar</span>
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
      </ul>

      <div className="sidebar-footer px-3 mt-auto border-top py-2">
        <div className="d-flex justify-content-between align-items-center">
          <span className="small">{user.user_cod}</span>
          <button className="btn btn-sm btn-outline-secondary" onClick={onLogout}>
            Salir
          </button>
        </div>
      </div>
    </div>
  );
}
