import { useState, useEffect, useRef } from "react";
import API from "../services/api";
import RichTextEditor from "./RichTextEditor";

function stripHtml(html) {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
}

const VARIABLES = [
  "{NOMBRE_CLIENTE}",
  "{IDENTIFICACION_CLIENTE}",
  "{NOMBRE_VENDEDOR}",
  "{VEH_MARCA}",
  "{VEH_MODELO}",
  "{VEH_PLACA}",
  "{VEH_COLOR}",
  "{NUMERO_POLIZA}",
  "{FECHA_INICIO}",
  "{FECHA_VENCIMIENTO}",
  "{VALOR_ASEGURADO}",
  "{LISTA_DETALLES}"
];

export default function WhatsAppTemplateModal({ template, onClose }) {
  const isEdit = !!template;
  const [form, setForm] = useState({
    Name: "",
    Subject: "",
    Body: "",
    Destination: "C",
    Estado: "A",
  });
  const bodyRef = useRef(null);

  useEffect(() => {
    if (isEdit) {
      setForm({
        Name: template.Name || "",
        Subject: template.Subject || "",
        Body: template.Body || "",
        Destination: template.Destination || "C",
        Estado: template.Estado || "A",
      });
    }
  }, [template]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const insertVar = (value) => {
    const el = bodyRef.current;
    if (!el) return;
    el.focus();
    document.execCommand("insertText", false, value);
    setForm({ ...form, Body: el.innerHTML });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { ...form };
    try {
      if (isEdit) {
        await API.put(`/seguimiento/plantillas-whatsapp/${template.id}`, data);
      } else {
        await API.post(`/seguimiento/plantillas-whatsapp`, data);
      }
      onClose();
    } catch (err) {
      const msg = err.response?.data?.detail || "Error al guardar plantilla";
      alert(msg);
    }
  };

  return (
    <div className="modal show fade d-block" tabIndex="-1" style={{ backgroundColor: "rgba(211,211,211,0.5)" }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content" style={{ backgroundColor: "rgb(48, 48, 48)" }}>
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">{isEdit ? "Editar Plantilla" : "Nueva Plantilla"}</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              <input
                name="Name"
                className="form-control mb-2"
                placeholder="Nombre"
                value={form.Name}
                onChange={handleChange}
                required
              />

              <input
                name="Subject"
                className="form-control mb-2"
                placeholder="Asunto"
                value={form.Subject}
                onChange={handleChange}
                required
              />

              <div className="mb-2">
                {VARIABLES.map((v) => (
                  <button
                    type="button"
                    key={v}
                    className="btn btn-sm btn-outline-secondary me-1 mb-1"
                    onClick={() => insertVar(v)}
                  >
                    {v}
                  </button>
                ))}
                <RichTextEditor
                  ref={bodyRef}
                  value={form.Body}
                  onChange={(val) => setForm({ ...form, Body: val })}
                  placeholder="Cuerpo del correo"
                />
              </div>

               <select
                name="Destination"
                className="form-select mb-2"
                value={form.Destination}
                onChange={handleChange}
              >
                <option value="C">Cliente</option>
                <option value="S">Vendedor</option>
              </select>

              <select
                name="Estado"
                className="form-select"
                value={form.Estado}
                onChange={handleChange}
              >
                <option value="A">Activo</option>
                <option value="D">Desactivado</option>
              </select>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" type="button" onClick={onClose}>Cancelar</button>
              <button className="btn btn-primary" type="submit">Guardar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}