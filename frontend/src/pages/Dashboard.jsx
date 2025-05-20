export default function Dashboard({ user }) {
  return (
    <>
      <h2>Dashboard</h2>
      <p>Bienvenido, {user.user_name}</p>
    </>
  );
}
