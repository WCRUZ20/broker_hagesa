import { useState } from "react";
import "./ClienteModal.css"; // Reutilizamos los estilos del ClienteModal

export default function ClientSelectModal({ clients = [], onSelect, onClose }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = clients.filter(
    (c) =>
      c.identificacion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.apellidos || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleClientSelect = (client) => {
    onSelect(client);
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick} style={{ zIndex: 1060 }}>
      <div className="modal-container" style={{ maxWidth: '750px' }}>
        <div className="modal-content-custom">
          
          {/* Header */}
          <div className="modal-header-custom">
            <div className="header-content">
              <div className="title-section">
                <h2 className="modal-title-custom">
                  Seleccionar Cliente
                </h2>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  color: 'rgb(212, 176, 131)',
                  fontSize: '0.85rem'
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                  {filtered.length} cliente{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
                </div>
              </div>
              <button 
                type="button" 
                className="modal-close-btn" 
                onClick={onClose}
              >
                ×
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="modal-body-custom" style={{
            padding: '1.5rem',
            maxHeight: '60vh',
            overflowY: 'auto'
          }}>
            
            {/* Search Input */}
            <div className="form-group-modern" style={{ marginBottom: '1.5rem' }}>
              <input
                type="text"
                className="form-input-modern"
                placeholder=" "
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
              />
              <label className="form-label-modern">Buscar cliente</label>
              <div className="form-highlight"></div>
            </div>

            {/* Client List */}
            <div style={{
              border: '2px solid rgb(45, 45, 45)',
              borderRadius: '12px',
              overflow: 'hidden',
              background: 'rgb(25, 25, 25)'
            }}>
              
              {/* Table Header */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1.2fr 1.2fr',
                gap: '1rem',
                padding: '1rem',
                background: 'linear-gradient(135deg, rgb(30, 30, 30) 0%, rgb(35, 35, 35) 100%)',
                borderBottom: '1px solid rgb(45, 45, 45)',
                fontWeight: '600',
                fontSize: '0.85rem',
                color: 'rgb(200, 150, 82)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                <div>Identificación</div>
                <div>Nombre</div>
                <div>Apellidos</div>
              </div>

              {/* Client Rows */}
              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {filtered.length === 0 ? (
                  <div style={{
                    padding: '2rem',
                    textAlign: 'center',
                    color: 'rgb(150, 146, 138)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1rem'
                  }}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" style={{ opacity: 0.5 }}>
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                    </svg>
                    <div>
                      <div style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>
                        No se encontraron clientes
                      </div>
                      <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>
                        Intente con un término de búsqueda diferente
                      </div>
                    </div>
                  </div>
                ) : (
                  filtered.map((client, index) => (
                    <div
                      key={client.id}
                      onClick={() => handleClientSelect(client)}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1.2fr 1.2fr',
                        gap: '1rem',
                        padding: '1rem',
                        cursor: 'pointer',
                        borderBottom: index < filtered.length - 1 ? '1px solid rgb(35, 35, 35)' : 'none',
                        color: 'rgb(240, 230, 215)',
                        fontSize: '0.9rem',
                        transition: 'all 0.2s ease',
                        background: 'transparent'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = 'linear-gradient(135deg, rgb(35, 35, 35) 0%, rgb(40, 40, 40) 100%)';
                        e.target.style.color = 'rgb(255, 245, 225)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'transparent';
                        e.target.style.color = 'rgb(240, 230, 215)';
                      }}
                    >
                      <div style={{ 
                        fontWeight: '500',
                        color: 'rgb(212, 176, 131)',
                        fontFamily: 'monospace'
                      }}>
                        {client.identificacion}
                      </div>
                      <div style={{ fontWeight: '500' }}>
                        {client.nombre}
                      </div>
                      <div style={{ opacity: 0.9 }}>
                        {client.apellidos || '-'}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer-custom" style={{
            borderTop: '1px solid rgb(60, 50, 35)',
            background: 'linear-gradient(135deg, rgb(15, 15, 15) 0%, rgb(20, 20, 20) 100%)',
            padding: '1rem 1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'rgb(150, 146, 138)',
              fontSize: '0.85rem'
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              Haga clic en un cliente para seleccionarlo
            </div>
            <button 
              type="button" 
              className="btn-secondary"
              onClick={onClose}
              style={{
                padding: '0.5rem 1rem',
                fontSize: '0.9rem'
              }}
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}