import { useEffect, useState } from "react";
import API from "../services/api";

export default function MailParams() {
  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "true");
  const [form, setForm] = useState({
    manualsending: "Y",
    daystodue: "",
    daystodueSeller: "",
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
  const [clientes, setClientes] = useState([]);
  const [polizas, setPolizas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");


  useEffect(() => {
    API.get("/seguimiento/parametros-envio").then((res) => {
      if (res.data && res.data.length > 0) {
        const p = res.data[0];
        setForm({
          manualsending: p.manualsending || "Y",
          daystodue: p.daystodue ?? "",
          daystodueSeller: p.daystodueSeller ?? "",
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
    API.get("/clientes").then((res) => setClientes(res.data));
  }, []);

  useEffect(() => {
    API.get("/polizas").then((res) => setPolizas(res.data));
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

  const clientesMap = clientes.reduce((acc, c) => {
    acc[c.id] = c;
    return acc;
  }, {});

  const shouldSend = (p) => {
    if (p.activo !== "Y") return false;
    const due = new Date(p.DueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diff = Math.floor((due - today) / 86400000); // days until due
    const beforeDue = diff >= 0 && diff <= parseInt(form.daystodue || 0, 10);
    const afterDue = diff < 0 && Math.abs(diff) <= parseInt(form.maxdaysallow || 0, 10);
    return beforeDue || afterDue;
  };

  const basePolicies = polizas.filter(shouldSend);

  const filteredPolicies = basePolicies.filter((p) => {
    const c = clientesMap[p.id_ctms] || {};
    const term = searchTerm.toLowerCase();
    return (
      p.PolicyNum.toLowerCase().includes(term) ||
      (c.identificacion || "").toLowerCase().includes(term) ||
      (c.nombre || "").toLowerCase().includes(term) ||
      (c.apellidos || "").toLowerCase().includes(term) ||
      (c.email || "").toLowerCase().includes(term)
    );
  });

  return (
    <div className="container" style={{ maxWidth: 900 }}>
      <h2 className={`mb-3 fw-bold ${darkMode ? "text-white" : "text-dark"}`}>Parámetros para envíos de correos</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="row g-2 align-items-end">
          <div className="col-auto form-check form-switch">
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
          <div className="col">
            <label className="form-label">Días aviso antes de vencer cliente</label>
            <input
              name="daystodue"
              type="number"
              className="form-control"
              value={form.daystodue}
              onChange={handleChange}
            />
          </div>
          <div className="col">
            <label className="form-label">Días aviso antes de vencer vendedor</label>
            <input
              name="daystodueSeller"
              type="number"
              className="form-control"
              value={form.daystodueSeller}
              onChange={handleChange}
            />
          </div>
          <div className="col">
            <label className="form-label">Hora de envío</label>
            <input
              name="hoursending"
              type="time"
              className="form-control"
              value={form.hoursending}
              onChange={handleChange}
            />
          </div>
          <div className="col">
            <label className="form-label">Máx. días envíos posteriores al vencimiento</label>
            <input
              name="maxdaysallow"
              type="number"
              className="form-control"
              value={form.maxdaysallow}
              onChange={handleChange}
            />
          </div>
          <div className="col-auto">
            <button className="btn btn-primary" type="submit">
              Guardar
            </button>
          </div>
        </div>
        <label className="form-label d-block mt-3">Frecuencia de envío a la semana</label>
        <div className="d-flex flex-wrap gap-2">
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
      </form>

      <div className="mb-3">
        <label className="form-label">Buscar póliza o cliente</label>
        <input
          type="text"
          className="form-control"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="table-responsive">
        <table className={`table table-hover ${darkMode ? "table-dark" : ""}`}>
          <thead>
            <tr>
              <th>Nro. Póliza</th>
              <th>Identificación</th>
              <th>Nombre</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {filteredPolicies.map((p) => {
              const c = clientesMap[p.id_ctms] || {};
              return (
                <tr key={p.id}>
                  <td>{p.PolicyNum}</td>
                  <td>{c.identificacion}</td>
                  <td>{`${c.nombre || ""} ${c.apellidos || ""}`}</td>
                  <td>{c.email}</td>
                </tr>
              );
            })}
            {filteredPolicies.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center">
                  No hay pólizas
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}