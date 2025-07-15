export default function ListStyles({ darkMode, accentColor = 'rgb(0,123,255)' }) {
  const toRgba = (color, alpha) => {
    if (color.startsWith('rgb(')) {
      return color.replace('rgb(', 'rgba(').replace(')', `,${alpha})`);
    }
    if (color.startsWith('#')) {
      const hex = color.slice(1);
      const bigint = parseInt(hex.length === 3 ? hex.replace(/(.)/g, '$1$1') : hex, 16);
      const r = (bigint >> 16) & 255;
      const g = (bigint >> 8) & 255;
      const b = bigint & 255;
      return `rgba(${r},${g},${b},${alpha})`;
    }
    return color;
  };

  return (
    <style jsx>{`
      .btn:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
      }
      .table tbody tr:hover {
        background-color: ${darkMode ? 'rgba(255,255,255,0.05)' : toRgba(accentColor, 0.05)} !important;
      }
      .btn-outline-primary {
        border-color: ${accentColor};
        color: ${accentColor};
      }
      .btn-outline-primary:hover {
        background-color: ${accentColor};
        border-color: ${accentColor};
        color: white;
      }
      .btn-outline-danger:hover {
        background-color: var(--bs-danger);
        border-color: var(--bs-danger);
        color: white;
      }
      .form-control:focus {
        border-color: ${accentColor};
        box-shadow: 0 0 0 0.2rem ${toRgba(accentColor, 0.25)};
      }
      .dropdown-item:hover {
        background-color: ${darkMode ? 'rgba(255,255,255,0.1)' : toRgba(accentColor, 0.1)};
      }
      .table td, .table th {
        padding-top: 0.33rem !important;
        padding-bottom: 0.15rem !important;
        vertical-align: middle !important;
        line-height: 1.08 !important;
      }
      .table tr {
        min-height: 0 !important;
      }
      .table {
        font-size: 0.88rem;
        border-collapse: separate !important;
        border-spacing: 0 !important;
        border-radius: 1rem !important;
        overflow: hidden !important;
        /* Para que el fondo de la tabla herede el border-radius */
        background: ${darkMode ? '#23272e' : '#fff'};
      }
      /* Redondea solo esquinas visibles: */
      .table thead tr:first-child th:first-child {
        border-top-left-radius: 1rem !important;
      }
      .table thead tr:first-child th:last-child {
        border-top-right-radius: 1rem !important;
      }
      .table tbody tr:last-child td:first-child {
        border-bottom-left-radius: 1rem !important;
      }
      .table tbody tr:last-child td:last-child {
        border-bottom-right-radius: 1rem !important;
      }
      /* Opcional: quita el borde para más suavidad visual */
      .table, .table th, .table td {
        border: none !important;
      }
      /* Acción: reducir botones de acciones y los iconos */
      .btn-table-action {
        width: 24px !important;
        height: 24px !important;
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
