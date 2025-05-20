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

function App() {
  const [user, setUser] = useState(null);

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
    <>
      <Sidebar user={user} onLogout={handleLogout} />
      <div style={{ marginLeft: "260px", padding: "2rem" }}>
        <Routes>
          <Route path="/" element={<Dashboard user={user} />} />
          <Route path="/clientes" element={<Clientes />} />
          {user.user_role === "A" && (
            <Route path="/usuarios" element={<Usuarios />} />
          )}
          <Route path="/vendedores" element={<Vendedores />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
