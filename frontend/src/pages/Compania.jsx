import { useState, useEffect } from "react";
import API from "../services/api";
import ToastNotification from "../components/ToastNotification";
import "./Compania.css";

export default function Compania() {
  const [form, setForm] = useState({
    IdCompany: "",
    CompanyName: "",
    CompanyLogo: "",
    AdressCompany: "",
    PhoneCompany: "",
    FundationDate: "",
    IdDocType: "",
    idLegalRep: "",
    FnameLegalRep: "",
    LnameLegalRep: "",
  });
  const [isNew, setIsNew] = useState(true);
  const [originalId, setOriginalId] = useState("");
  const [types, setTypes] = useState([]);
  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "true");
  const [toast, setToast] = useState({ show: false, message: "", variant: "success" });
  const accentColor = "rgb(200, 150, 82)";


  useEffect(() => {
    const load = async () => {
      try {
        const [compRes, typeRes] = await Promise.all([
          API.get("/company"),
          API.get("/tipos-identificacion"),
        ]);
        setTypes(typeRes.data || []);
        if (Array.isArray(compRes.data) && compRes.data.length > 0) {
          setForm((prev) => ({ ...prev, ...compRes.data[0], FundationDate: compRes.data[0].FundationDate || "" }));
          setOriginalId(compRes.data[0].IdCompany);
          setIsNew(false);
        } else {
          setIsNew(true);
        }
      } catch (err) {
        console.error("Error cargando compañía", err);
      }
    };
    load();

    const handler = () => setDarkMode(localStorage.getItem("darkMode") === "true");
    window.addEventListener("darkModeChange", handler);
    return () => window.removeEventListener("darkModeChange", handler);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/png"];
      const maxSize = 500 * 1024;
      if (!validTypes.includes(file.type)) {
        alert("Solo se permiten imágenes JPG o PNG.");
        return;
      }
      if (file.size > maxSize) {
        alert("La imagen no debe superar los 500 KB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({ ...prev, CompanyLogo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form };
    if (!payload.FundationDate) delete payload.FundationDate;
    try {
      if (isNew) {
        await API.post("/company", payload);
        setOriginalId(payload.IdCompany);
        setIsNew(false);
      } else {
        await API.put(`/company/${originalId}`, payload);
        setOriginalId(payload.IdCompany);
      }
      setToast({ show: true, message: "Datos guardados", variant: "success" });
    } catch (err) {
      setToast({ show: true, message: "Error al guardar", variant: "danger" });
    }
  };

  return (
    <div
      className={`company-page container my-4 p-4 rounded-3 ${darkMode ? 'bg-dark text-white' : 'bg-white'}`}
    >
      <ToastNotification
        show={toast.show}
        message={toast.message}
        variant={toast.variant}
        onClose={() => setToast({ ...toast, show: false })}
      />
      <h3 className="mb-3" style={{ color: accentColor }}>Compañía</h3>
      <form onSubmit={handleSubmit} className="row g-3 company-form">
        <div className="col-md-6 pe-md-4">
          <h5 style={{ color: accentColor }}>Datos de la compañía</h5>
          <div className="row g-3">
            <div className="col-12">
              <label className="form-label">RUC</label>
              <input
                name="IdCompany"
                className="form-control"
                placeholder="RUC"
                value={form.IdCompany}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-12">
              <label className="form-label">Tipo Documento</label>
              <select
                name="IdDocType"
                className="form-select"
                value={form.IdDocType}
                onChange={handleChange}
              >
                <option value="">Seleccionar...</option>
                {types.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.Description}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-12">
              <label className="form-label">Nombre Compañía</label>
              <input
                name="CompanyName"
                className="form-control"
                placeholder="Nombre"
                value={form.CompanyName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-12">
              <label className="form-label">Dirección</label>
              <input
                name="AdressCompany"
                className="form-control"
                value={form.AdressCompany}
                onChange={handleChange}
              />
            </div>
            <div className="col-12">
              <label className="form-label">Teléfono</label>
              <input
                name="PhoneCompany"
                className="form-control"
                value={form.PhoneCompany}
                onChange={handleChange}
              />
            </div>
            <div className="col-12">
              <label className="form-label">Fecha Fundación</label>
              <input
                type="date"
                name="FundationDate"
                className="form-control"
                value={form.FundationDate || ""}
                onChange={handleChange}
              />
            </div>
            <div className="col-12">
              <label className="form-label">Logo</label>
              <input type="file" className="form-control" onChange={handleLogoChange} />
            </div>
            {form.CompanyLogo && (
              <div className="col-12 logo-preview text-center">
                <img src={form.CompanyLogo} alt="logo" />
              </div>
            )}
          </div>
        </div>
        <div className="col-md-6 ps-md-4 legal-section">
          <h5 style={{ color: accentColor }}>Datos del representante legal</h5>
          <div className="row g-3">
            <div className="col-12">
              <label className="form-label">ID Representante Legal</label>
              <input
                name="idLegalRep"
                className="form-control"
                value={form.idLegalRep}
                onChange={handleChange}
              />
            </div>
            <div className="col-12">
              <label className="form-label">Nombres Representante</label>
              <input
                name="FnameLegalRep"
                className="form-control"
                value={form.FnameLegalRep}
                onChange={handleChange}
              />
            </div>
            <div className="col-12">
              <label className="form-label">Apellidos Representante</label>
              <input
                name="LnameLegalRep"
                className="form-control"
                value={form.LnameLegalRep}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
        <div className="col-12 text-end mt-3">
          <button className="btn btn-primary" type="submit" style={{ backgroundColor: accentColor, borderColor: accentColor }}>
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
}