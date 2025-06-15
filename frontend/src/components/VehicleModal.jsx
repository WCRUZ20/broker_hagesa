import { useState, useEffect } from "react";
import API from "../services/api";

export default function VehicleModal({ vehicle, onClose }) {
  const isEdit = !!vehicle;

  const [form, setForm] = useState({
    id_itm_type: "",
    Brand: "",
    Model: "",
    YearItem: "",
    Clasification: "",
    Plate: "",
    Motor: "",
    Chassis: "",
    Color: "",
    OriCountry: "",
    Propetary: "",
    id_use_item: "",
  });

  const [brands, setBrands] = useState([]);
  const [types, setTypes] = useState([]);
  const [uses, setUses] = useState([]);
  const [classifications, setClassifications] = useState([]);
  const [countries, setCountries] = useState([]);
  const [clients, setClients] = useState([]);

  useEffect(() => {
    Promise.all([
      API.get("/marcas"),
      API.get("/tipos-vehiculo"),
      API.get("/usos-vehiculo"),
      API.get("/clasificaciones-vehiculo"),
      API.get("/paises"),
      API.get("/clientes"),
    ]).then(([b, t, u, clsf, c, cl]) => {
      setBrands(b.data);
      setTypes(t.data);
      setUses(u.data);
      setClassifications(clsf.data);
      setCountries(c.data);
      setClients(cl.data);
    });
    if (isEdit) {
      setForm({
        id_itm_type: vehicle.id_itm_type || "",
        Brand: vehicle.Brand || "",
        Model: vehicle.Model || "",
        YearItem: vehicle.YearItem || "",
        Clasification: vehicle.Clasification || "",
        Plate: vehicle.Plate || "",
        Motor: vehicle.Motor || "",
        Chassis: vehicle.Chassis || "",
        Color: vehicle.Color || "",
        OriCountry: vehicle.OriCountry || "",
        Propetary: vehicle.Propetary || "",
        id_use_item: vehicle.id_use_item || "",
      });
    }
  }, [vehicle]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      id_itm_type: Number(form.id_itm_type),
      Brand: Number(form.Brand),
      Model: form.Model,
      YearItem: Number(form.YearItem),
      Clasification: Number(form.Clasification),
      Plate: form.Plate,
      Motor: form.Motor || null,
      Chassis: form.Chassis || null,
      Color: form.Color || null,
      OriCountry: form.OriCountry ? Number(form.OriCountry) : null,
      Propetary: form.Propetary ? Number(form.Propetary) : null,
      id_use_item: Number(form.id_use_item),
    };
    try {
      if (isEdit) {
        await API.put(`/vehiculos/${vehicle.id}`, data);
      } else {
        await API.post("/vehiculos", data);
      }
      onClose();
    } catch (err) {
      const msg = err.response?.data?.detail || "Error al guardar vehículo";
      alert(msg);
    }
  };

  return (
    <div className="modal show fade d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">{isEdit ? "Editar Vehículo" : "Nuevo Vehículo"}</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-6 mb-2">
                  <select name="Brand" className="form-select" value={form.Brand} onChange={handleChange} required>
                    <option value="">Seleccione marca</option>
                    {brands.map(b => <option key={b.id} value={b.id}>{b.Description}</option>)}
                  </select>
                </div>
                <div className="col-md-6 mb-2">
                  <input name="Model" className="form-control" placeholder="Modelo" value={form.Model} onChange={handleChange} required />
                </div>
                <div className="col-md-6 mb-2">
                  <select name="id_itm_type" className="form-select" value={form.id_itm_type} onChange={handleChange} required>
                    <option value="">Seleccione tipo</option>
                    {types.map(t => <option key={t.id} value={t.id}>{t.Description}</option>)}
                  </select>
                </div>
                <div className="col-md-6 mb-2">
                  <select name="id_use_item" className="form-select" value={form.id_use_item} onChange={handleChange} required>
                    <option value="">Seleccione uso</option>
                    {uses.map(u => <option key={u.id} value={u.id}>{u.Description}</option>)}
                  </select>
                </div>
                <div className="col-md-6 mb-2">
                  <input name="YearItem" type="number" className="form-control" placeholder="Año" value={form.YearItem} onChange={handleChange} required />
                </div>
                <div className="col-md-6 mb-2">
                  <select name="Clasification" className="form-select" value={form.Clasification} onChange={handleChange} required>
                    <option value="">Seleccione clasificación</option>
                    {classifications.map(cs => (
                      <option key={cs.id} value={cs.id}>{cs.Description}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6 mb-2">
                  <input name="Plate" className="form-control" placeholder="Placa" value={form.Plate} onChange={handleChange} required />
                </div>
                <div className="col-md-6 mb-2">
                  <input name="Motor" className="form-control" placeholder="Motor" value={form.Motor} onChange={handleChange} />
                </div>
                <div className="col-md-6 mb-2">
                  <input name="Chassis" className="form-control" placeholder="Chasis" value={form.Chassis} onChange={handleChange} />
                </div>
                <div className="col-md-6 mb-2">
                  <input name="Color" className="form-control" placeholder="Color" value={form.Color} onChange={handleChange} />
                </div>
                <div className="col-md-6 mb-2">
                  <select name="OriCountry" className="form-select" value={form.OriCountry} onChange={handleChange}>
                    <option value="">País origen</option>
                    {countries.map(c => <option key={c.id} value={c.id}>{c.Description}</option>)}
                  </select>
                </div>
                <div className="col-md-6 mb-2">
                  <select name="Propetary" className="form-select" value={form.Propetary} onChange={handleChange}>
                    <option value="">Propietario</option>
                    {clients.map(cl => <option key={cl.id} value={cl.id}>{cl.nombre}</option>)}
                  </select>
                </div>
              </div>
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