import { useState, useEffect } from "react";
import API from "../services/api";

export default function AseguradoraModal({ aseguradora, onClose }) {
  const isEdit = !!aseguradora;

  const [form, setForm] = useState({
    IdentType: "",
    Identification: "",
    CompanyName: "",
    DirCompany: "",
    TelepCompany: "",
    ComiPrcnt: "",
  });

  const [types, setTypes] = useState([]);

  useEffect(() => {
    API.get("/tipos-identificacion").then(res => setTypes(res.data));
    if (isEdit) {
      setForm({
        IdentType: aseguradora.IdentType || "",
        Identification: aseguradora.Identification || "",
        CompanyName: aseguradora.CompanyName || "",
        DirCompany: aseguradora.DirCompany || "",
        TelepCompany: aseguradora.TelepCompany || "",
        ComiPrcnt: aseguradora.ComiPrcnt || "",
      });
    }
  }, [aseguradora]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const data = {
      ...form,
      ComiPrcnt: Number(form.ComiPrcnt),
    };
    try {
      if (isEdit) {
        await API.put(`/aseguradoras/${aseguradora.id}`, data);
      } else {
        await API.post("/aseguradoras", data);
      }
      onClose();
    } catch (err) {
      alert("Error al guardar aseguradora");
    }
  };

  return (
    <div className="modal show fade d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">{isEdit ? "Editar Aseguradora" : "Nueva Aseguradora"}</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              <select
                name="IdentType"
                className="form-select mb-2"
                value={form.IdentType}
                onChange={handleChange}
                required
              >
                <option value="">Tipo Identificación</option>
                {types.map(t => (
                  <option key={t.id} value={t.id}>{t.Description}</option>
                ))}
              </select>
              <input
                name="Identification"
                className="form-control mb-2"
                placeholder="Identificación"
                value={form.Identification}
                onChange={handleChange}
                required
              />
              <input
                name="CompanyName"
                className="form-control mb-2"
                placeholder="Nombre"
                value={form.CompanyName}
                onChange={handleChange}
                required
              />
              <input
                name="DirCompany"
                className="form-control mb-2"
                placeholder="Dirección"
                value={form.DirCompany}
                onChange={handleChange}
              />
              <input
                name="TelepCompany"
                className="form-control mb-2"
                placeholder="Teléfono"
                value={form.TelepCompany}
                onChange={handleChange}
              />
              <input
                name="ComiPrcnt"
                type="number"
                className="form-control mb-2"
                placeholder="Comisión %"
                value={form.ComiPrcnt}
                onChange={handleChange}
                required
              />
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
              <button className="btn btn-primary" type="submit">Guardar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}