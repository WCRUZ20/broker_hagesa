export default function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <span className="navbar-brand">HAGESA Seguros</span>
      <div className="ms-auto d-flex align-items-center text-white">
        <span className="me-3">
          {user.user_name} ({user.user_role === "A" ? "Admin" : "Regular"})
        </span>
        <button onClick={onLogout} className="btn btn-outline-light btn-sm">
          Cerrar sesión
        </button>
      </div>
    </nav>
  );
}
