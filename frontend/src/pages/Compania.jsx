import { useState, useEffect } from "react";
import API from "../services/api";

export default function Compania() {
  const [form, setForm] = useState({
    IdCompany: "",
    CompanyName: "",
    CompanyLogo: "",
  });
  const [isNew, setIsNew] = useState(true);
  const [originalId, setOriginalId] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await API.get("/company");
        if (Array.isArray(res.data) && res.data.length > 0) {
          setForm(res.data[0]);
          setOriginalId(res.data[0].IdCompany);
          setIsNew(false);
        } else {
          setIsNew(true);
        }
      } catch (err) {
        console.error("Error cargando compañía", err);
      }
    };
    load();
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
    try {
      if (isNew) {
        await API.post("/company", form);
        setOriginalId(form.IdCompany);
        setIsNew(false);
      } else {
        await API.put(`/company/${originalId}`, form);
        setOriginalId(form.IdCompany);
      }
      alert("Datos guardados");
    } catch (err) {
      alert("Error al guardar");
    }
  };

  return (
    <div className="container">
      <h3>Compañía</h3>
      <form onSubmit={handleSubmit} className="mt-3" style={{ maxWidth: 400 }}>
        <input
          name="IdCompany"
          className="form-control mb-2"
          placeholder="RUC"
          value={form.IdCompany}
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
        <input type="file" className="form-control mb-2" onChange={handleLogoChange} />
        {form.CompanyLogo && (
          <div className="mb-2">
            <img src={form.CompanyLogo} alt="logo" style={{ maxHeight: 100 }} />
          </div>
        )}
        <button className="btn btn-primary" type="submit">
          Guardar
        </button>
      </form>
    </div>
  );
}