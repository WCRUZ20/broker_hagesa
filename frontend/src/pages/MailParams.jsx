import { useEffect, useState } from "react";
import API from "../services/api";

export default function MailParams() {
  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "true");
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
  const [id, setId] = useState(null);

  useEffect(() => {
    API.get("/seguimiento/parametros-envio").then((res) => {
      if (res.data && res.data.length > 0) {
        const p = res.data[0];
        setForm({
          manualsending: p.manualsending || "Y",
          daystodue: p.daystodue ?? "",
          monday: p.monday || "N",
          tuesday: p.tuesday || "N",
          wednesday: p.wednesday || "N",
          thursday: p.thursday || "N",
          friday: p.friday || "N",
          saturday: p.saturday || "N",
          sunday: p.sunday || "N",
          hoursending: p.hoursending || "",
          maxdaysallow: p.maxdaysallow ?? "",
        });
        setId(p.id);
      }
    });
  }, []);

  useEffect(() => {
    const handler = () => setDarkMode(localStorage.getItem("darkMode") === "true");
    window.addEventListener("darkModeChange", handler);
    return () => window.removeEventListener("darkModeChange", handler);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const toggleDay = (field) => {
    setForm({ ...form, [field]: form[field] === "Y" ? "N" : "Y" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await API.put(`/seguimiento/parametros-envio/${id}`, form);
      } else {
        const res = await API.post("/seguimiento/parametros-envio", form);
        setId(res.data.id);
      }
      alert("Parámetros guardados");
    } catch (err) {
      const msg = err.response?.data?.detail || "Error al guardar";
      alert(msg);
    }
  };

  const days = [
    ["monday", "Lun"],
    ["tuesday", "Mar"],
    ["wednesday", "Mié"],
    ["thursday", "Jue"],
    ["friday", "Vie"],
    ["saturday", "Sáb"],
    ["sunday", "Dom"],
  ];

  return (
    <div className="container" style={{ maxWidth: 500 }}>
      <h2 className={`mb-3 fw-bold ${darkMode ? "text-white" : "text-dark"}`}>Parámetros para envíos de correos</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-check form-switch mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            id="manual-switch"
            checked={form.manualsending === "Y"}
            onChange={() =>
              setForm({ ...form, manualsending: form.manualsending === "Y" ? "N" : "Y" })
            }
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
          {days.map(([field, label]) => (
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
        <button className="btn btn-primary mt-2" type="submit">
          Guardar
        </button>
      </form>
    </div>
  );
}