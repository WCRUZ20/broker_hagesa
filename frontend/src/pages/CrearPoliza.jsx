import { useEffect, useState } from "react";
import API from "../services/api";

export default function CrearPoliza() {
  const [form, setForm] = useState({
    DocType: "N",
    PolicyNum: "",
    InitDate: "",
    DueDate: "",
    AscValue: "",
    id_slrs: "",
    id_ctms: "",
    id_insurance: "",
  });
  const [lines, setLines] = useState([{ id_itm: "", LineNum: 1, LineTotal: "" }]);
  const [sellers, setSellers] = useState([]);
  const [clients, setClients] = useState([]);
  const [insurances, setInsurances] = useState([]);
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    Promise.all([
      API.get("/vendedores"),
      API.get("/clientes"),
      API.get("/aseguradoras"),
      API.get("/vehiculos"),
    ]).then(([s, c, a, v]) => {
      setSellers(s.data);
      setClients(c.data);
      setInsurances(a.data);
      setVehicles(v.data);
    });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLineChange = (idx, e) => {
    const newLines = [...lines];
    newLines[idx] = { ...newLines[idx], [e.target.name]: e.target.value };
    setLines(newLines);
  };

  const addLine = () => {
    setLines([...lines, { id_itm: "", LineNum: lines.length + 1, LineTotal: "" }]);
  };

  const removeLine = (idx) => {
    setLines(lines.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      AscValue: Number(form.AscValue),
      id_slrs: Number(form.id_slrs),
      id_ctms: Number(form.id_ctms),
      id_insurance: Number(form.id_insurance),
      lines: lines.map((l) => ({
        id_itm: Number(l.id_itm),
        LineNum: Number(l.LineNum),
        LineTotal: Number(l.LineTotal),
      })),
    };
    try {
      await API.post("/polizas", payload);
      alert("Póliza creada");
      setForm({
        DocType: "N",
        PolicyNum: "",
        InitDate: "",
        DueDate: "",
        AscValue: "",
        id_slrs: "",
        id_ctms: "",
        id_insurance: "",
      });
      setLines([{ id_itm: "", LineNum: 1, LineTotal: "" }]);
    } catch (err) {
      alert("Error al crear póliza");
    }
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Crear Póliza</h2>
      <form onSubmit={handleSubmit} className="card p-3 shadow-sm">
        <div className="row">
          <div className="col-md-6 mb-3">
            <select
              name="DocType"
              className="form-select"
              value={form.DocType}
              onChange={handleChange}
              required
            >
              <option value="N">Nueva</option>
              <option value="R">Renovación</option>
            </select>
          </div>
          <div className="col-md-6 mb-3">
            <input
              name="PolicyNum"
              className="form-control"
              placeholder="Número de póliza"
              value={form.PolicyNum}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <input
              type="date"
              name="InitDate"
              className="form-control"
              value={form.InitDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <input
              type="date"
              name="DueDate"
              className="form-control"
              value={form.DueDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <input
              name="AscValue"
              type="number"
              step="0.01"
              className="form-control"
              placeholder="Valor asegurado"
              value={form.AscValue}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <select
              name="id_slrs"
              className="form-select"
              value={form.id_slrs}
              onChange={handleChange}
              required
            >
              <option value="">Vendedor</option>
              {sellers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nombre}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-6 mb-3">
            <select
              name="id_ctms"
              className="form-select"
              value={form.id_ctms}
              onChange={handleChange}
              required
            >
              <option value="">Cliente</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-6 mb-3">
            <select
              name="id_insurance"
              className="form-select"
              value={form.id_insurance}
              onChange={handleChange}
              required
            >
              <option value="">Aseguradora</option>
              {insurances.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.CompanyName}
                </option>
              ))}
            </select>
          </div>
        </div>
        <hr />
        <h5>Vehículos</h5>
        {lines.map((line, idx) => (
          <div className="row align-items-end" key={idx}>
            <div className="col-md-5 mb-3">
              <select
                name="id_itm"
                className="form-select"
                value={line.id_itm}
                onChange={(e) => handleLineChange(idx, e)}
                required
              >
                <option value="">Vehículo</option>
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.Plate}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-3 mb-3">
              <input
                name="LineNum"
                type="number"
                className="form-control"
                value={line.LineNum}
                onChange={(e) => handleLineChange(idx, e)}
                required
              />
            </div>
            <div className="col-md-3 mb-3">
              <input
                name="LineTotal"
                type="number"
                className="form-control"
                value={line.LineTotal}
                onChange={(e) => handleLineChange(idx, e)}
                required
              />
            </div>
            <div className="col-md-1 mb-3">
              {lines.length > 1 && (
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={() => removeLine(idx)}
                >
                  <i className="bi bi-trash"></i>
                </button>
              )}
            </div>
          </div>
        ))}
        <div className="mb-3">
          <button type="button" className="btn btn-outline-primary btn-sm" onClick={addLine}>
            <i className="bi bi-plus-circle me-1"></i>Agregar Vehículo
          </button>
        </div>
        <div className="text-end">
          <button className="btn btn-primary">Guardar</button>
        </div>
      </form>
    </div>
  );
}