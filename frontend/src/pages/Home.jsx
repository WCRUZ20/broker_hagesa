import HeatMap from "../components/HeatMap";

export default function Home({ user }) {
  return (
    <div className="container py-4">
      <h2>Bienvenido, {user.user_name}</h2>
      <p>Rol: {user.user_role === "A" ? "Administrador" : "Usuario regular"}</p>
      <div className="mt-4">
        <h> Mapa de calor clientes</h>
        <HeatMap />
      </div>
    </div>
  );
}
