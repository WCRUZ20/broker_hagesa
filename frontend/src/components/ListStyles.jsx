export default function ListStyles({ darkMode }) {
  return (
    <style jsx>{`
      .btn:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
      }

      .table tbody tr:hover {
        background-color: ${darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,123,255,0.05)'} !important;
      }

      .btn-outline-primary:hover {
        background-color: var(--bs-primary);
        border-color: var(--bs-primary);
        color: white;
      }

      .btn-outline-danger:hover {
        background-color: var(--bs-danger);
        border-color: var(--bs-danger);
        color: white;
      }

      .form-control:focus {
        border-color: var(--bs-primary);
        box-shadow: 0 0 0 0.2rem rgba(0,123,255,0.25);
      }

      .dropdown-item:hover {
        background-color: ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,123,255,0.1)'};
      }
    `}</style>
  );
}