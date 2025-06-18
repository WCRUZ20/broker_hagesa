import { useState, useEffect } from "react";
import API from "../services/api";

export default function MailParamsModal({ param, onClose }) {
  const isEdit = !!param;
  const [form, setForm] = useState({
    manualsending: "Y",
    daystodue: "",
    monday: "N",
    tuesday: "N",
    wednesday: "N",
    thursday: "N",
    friday: "N",
    saturday: "N",
    sunday: "N",
    hoursending: "",
    maxdaysallow: "",
  });

  useEffect(() => {
    if (isEdit) {
      setForm({
        manualsending: param.manualsending || "Y",
        daystodue: param.daystodue ?? "",
        monday: param.monday || "N",
        tuesday: param.tuesday || "N",
        wednesday: param.wednesday || "N",
        thursday: param.thursday || "N",
        friday: param.friday || "N",
        saturday: param.saturday || "N",
        sunday: param.sunday || "N",
        hoursending: param.hoursending || "",
        maxdaysallow: param.maxdaysallow ?? "",
      });
    }
  }, [param]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const toggleDay = (field) => {
    setForm({ ...form, [field]: form[field] === "Y" ? "N" : "Y" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await API.put(`/seguimiento/parametros-envio/${param.id}`, form);
      } else {
        await API.post("/seguimiento/parametros-envio", form);
      }
      onClose();
    } catch (err) {
      const msg = err.response?.data?.detail || "Error al guardar";
      alert(msg);
    }
  };

  return (
    <div className="modal show fade d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">{isEdit ? "Editar" : "Nuevo"} parámetro</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              <div className="form-check form-switch mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="manual-switch"
                  checked={form.manualsending === "Y"}
                  onChange={() => setForm({ ...form, manualsending: form.manualsending === "Y" ? "N" : "Y" })}
                />
                <label className="form-check-label ms-2" htmlFor="manual-switch">
                  Envío manual
                </label>
              </div>
              <input
                name="daystodue"
                type="number"
                className="form-control mb-2"
                placeholder="Días antes de vencer"
                value={form.daystodue}
                onChange={handleChange}
              />
              <div className="d-flex flex-wrap gap-2 mb-2">
                {[
                  ["monday", "Lun"],
                  ["tuesday", "Mar"],
                  ["wednesday", "Mié"],
                  ["thursday", "Jue"],
                  ["friday", "Vie"],
                  ["saturday", "Sáb"],
                  ["sunday", "Dom"],
                ].map(([field, label]) => (
                  <button
                    type="button"
                    key={field}
                    className={`btn btn-sm ${form[field] === "Y" ? "btn-primary" : "btn-outline-secondary"}`}
                    onClick={() => toggleDay(field)}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <input
                name="hoursending"
                type="time"
                className="form-control mb-2"
                value={form.hoursending}
                onChange={handleChange}
              />
              <input
                name="maxdaysallow"
                type="number"
                className="form-control mb-2"
                placeholder="Máx. días posteriores"
                value={form.maxdaysallow}
                onChange={handleChange}
              />
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