import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import Sidebar from "./components/Sidebar";
import API from "./services/api";
import Home from "./pages/Home";
import Users from "./pages/Users";
import Customers from "./pages/Customers";
import Usuarios from "./pages/Usuarios";
import Clientes from "./pages/Clientes";
import Vendedores from "./pages/Vendedores";
import Compania from "./pages/Compania";
// import Paises from "./pages/Paises";
import DatosGeograficos from "./pages/DatosGeograficos";
import CargosUsuarios from "./pages/CargosUsuarios";
import DatosVehiculos from "./pages/DatosVehiculos";
import VehiculosRegistrados from "./pages/VehiculosRegistrados";
import DatosPersonas from "./pages/DatosPersonas";
import Aseguradoras from "./pages/Aseguradoras";

function App() {
  const [user, setUser] = useState(null);

   useEffect(() => {
    // Agrega el link a Google Fonts (Montserrat)
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    API.get("/users/me")
      .then(res => setUser(res.data))
      .catch(() => {
        localStorage.removeItem("token");
        setUser(null);
      });
  }, []);

  const handleLogin = () => {
    API.get("/users/me").then(res => setUser(res.data));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  if (!user) return <LoginForm onLogin={handleLogin} />;

  return (
    <div style={{ fontFamily: "'Montserrat', sans-serif" }}>
      <Sidebar user={user} onLogout={handleLogout} />
      <div style={{ marginLeft: "260px", padding: "2rem" }}>
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/clientes" element={<Clientes />} />
          {user.user_role === "A" && (
            <Route path="/usuarios" element={<Usuarios />} />
          )}
          <Route path="/vendedores" element={<Vendedores />} />
          <Route path="/compania" element={<Compania />} />
          <Route path="/aseguradoras" element={<Aseguradoras />} />
          {/* <Route path="/paises" element={<Paises />} /> */}
          <Route path="/datos-geograficos" element={<DatosGeograficos />} />
          <Route path="/datos-personas" element={<DatosPersonas />} />
          <Route path="/datos-vehiculos" element={<DatosVehiculos />} />
          <Route path="/vehiculos-registrados" element={<VehiculosRegistrados />} />
          <Route path="/cargos" element={<CargosUsuarios />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
