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
    
      
      .table td, .table th {
        padding-top: 0.25rem !important;
        padding-bottom: 0.25rem !important;
        vertical-align: middle !important;
        line-height: 1.08 !important;
      }
      .table tr {
        min-height: 0 !important;
      }
      /* Reduce el font-size general para hacerlo más compacto aún */
      .table {
        font-size: 0.80rem;
      }
      /* Acción: reducir botones de acciones y los iconos */
      .btn-table-action {
        width: 10px !important;
        height: 10px !important;
        padding: 0 !important;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .btn-table-action i {
        font-size: 1rem !important;
      }
    `}</style>
  );
}