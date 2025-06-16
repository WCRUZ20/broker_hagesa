import Sidebar from "../components/Sidebar";
import HeatMap from "../components/HeatMap";

export default function Home({ user, onLogout }) {
  return (
    <div>
      <Sidebar user={user} onLogout={onLogout} />
      <div className="container mt-4" style={{ marginLeft: "260px" }}>
        <h2>Bienvenido, {user.user_name}</h2>
        <p>Rol: {user.user_role === "A" ? "Administrador" : "Usuario regular"}</p>
        <div className="mt-4">
          <HeatMap />
        </div>
      </div>
    </div>
  );
}
