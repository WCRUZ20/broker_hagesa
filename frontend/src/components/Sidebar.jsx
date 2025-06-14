import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar({ user, onLogout }) {
  const [darkMode, setDarkMode] = useState(true);
  const [menuAbierto, setMenuAbierto] = useState(false);

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

  const sidebarClass = "sidebar sidebar-dark"; // Siempre oscuro

  return (
    <div className={sidebarClass}>
      <div className="sidebar-header d-flex justify-content-between align-items-center px-3 py-2 border-bottom">
        <div className="d-flex align-items-center">
          <img src="/logo.png'" alt="Logo" style={{ width: 36, height: 36, marginRight: 8 }} />
          <span className="fw-bold" style={{ fontSize: "1.1rem" }}>HAGESA</span>
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
