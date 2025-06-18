import { useState, useEffect, useRef } from "react";
import API from "../services/api";
import RichTextEditor from "./RichTextEditor";

const VARIABLES = [
  "{NOMBRE_CLIENTE}",
  "{IDENTIFICACION_CLIENTE}",
  "{VEH_MARCA}",
  "{VEH_MODELO}",
  "{VEH_PLACA}",
  "{VEH_COLOR}",
  "{NUMERO_POLIZA}",
  "{FECHA_INICIO}",
  "{FECHA_VENCIMIENTO}",
  "{VALOR_ASEGURADO}"
];

export default function MailTemplateModal({ template, onClose }) {
  const isEdit = !!template;
  const [form, setForm] = useState({
    Name: "",
    Subject: "",
    Body: "",
    Estado: "A",
  });
  const subjRef = useRef(null);
  const bodyRef = useRef(null);

  useEffect(() => {
    if (isEdit) {
      setForm({
        Name: template.Name || "",
        Subject: template.Subject || "",
        Body: template.Body || "",
        Estado: template.Estado || "A",
      });
    }
  }, [template]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const insertVar = (field, value) => {
    if (field === "Subject") {
      const el = subjRef.current;
      if (!el) return;
      const start = el.selectionStart;
      const end = el.selectionEnd;
      const text = el.value;
      const newText = text.slice(0, start) + value + text.slice(end);
      el.value = newText;
      setForm({ ...form, Subject: newText });
    } else {
      const el = bodyRef.current;
      if (!el) return;
      el.focus();
      document.execCommand("insertText", false, value);
      setForm({ ...form, Body: el.innerHTML });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await API.put(`/seguimiento/plantillas-mail/${template.id}`, form);
      } else {
        await API.post(`/seguimiento/plantillas-mail`, form);
      }
      onClose();
    } catch (err) {
      const msg = err.response?.data?.detail || "Error al guardar plantilla";
      alert(msg);
    }
  };

  return (
    <div className="modal show fade d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
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

              <div className="mb-2">
                {VARIABLES.map((v) => (
                  <button
                    type="button"
                    key={v}
                    className="btn btn-sm btn-outline-secondary me-1 mb-1"
                    onClick={() => insertVar("Subject", v)}
                  >
                    {v}
                  </button>
                ))}
                {/* <textarea
                  ref={subjRef}
                  name="Subject"
                  className="form-control mt-1"
                  placeholder="Asunto"
                  value={form.Subject}
                  onChange={handleChange}
                  rows="2"
                  required
                /> */}
                <RichTextEditor
                  ref={subjRef}
                  value={form.Subject}
                  onChange={(val) => setForm({ ...form, Subject: val })}
                  placeholder="Asunto"
                />
              </div>

              <div className="mb-2">
                {VARIABLES.map((v) => (
                  <button
                    type="button"
                    key={v}
                    className="btn btn-sm btn-outline-secondary me-1 mb-1"
                    onClick={() => insertVar("Body", v)}
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