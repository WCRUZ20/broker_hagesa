import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import Sidebar from "./components/Sidebar";
import API from "./services/api";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Customers from "./pages/Customers";
import Usuarios from "./pages/Usuarios";
import Clientes from "./pages/Clientes";
import Vendedores from "./pages/Vendedores";
import Compania from "./pages/Compania";

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
          <Route path="/" element={<Dashboard user={user} />} />
          <Route path="/clientes" element={<Clientes />} />
          {user.user_role === "A" && (
            <Route path="/usuarios" element={<Usuarios />} />
          )}
          <Route path="/vendedores" element={<Vendedores />} />
          <Route path="/compania" element={<Compania />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
