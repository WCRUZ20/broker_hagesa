import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import ClientSelectModal from "../components/ClientSelectModal";
import SellerSelectModal from "../components/SellerSelectModal";
import InsuranceSelectModal from "../components/InsuranceSelectModal";
import VehicleSelectModal from "../components/VehicleSelectModal";

export default function CrearPoliza() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
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
  const [lines, setLines] = useState([
    { id_itm: "", LineNum: 1, LineTotal: "", plate: "" },
  ]);
  const [sellers, setSellers] = useState([]);
  const [clients, setClients] = useState([]);
  const [insurances, setInsurances] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [showSellerSelect, setShowSellerSelect] = useState(false);
  const [showClientSelect, setShowClientSelect] = useState(false);
  const [showInsuranceSelect, setShowInsuranceSelect] = useState(false);
  const [vehicleIndex, setVehicleIndex] = useState(null);
  const [sellerName, setSellerName] = useState("");
  const [clientName, setClientName] = useState("");
  const [insuranceName, setInsuranceName] = useState("");
  

  useEffect(() => {
    Promise.all([
      API.get("/vendedores"),
      API.get("/clientes"),
      API.get("/aseguradoras"),
      API.get("/vehiculos"),
    ]).then(async ([s, c, a, v]) => {
      setSellers(s.data);
      setClients(c.data);
      setInsurances(a.data);
      setVehicles(v.data);
    if (isEdit) {
        const res = await API.get(`/polizas/${id}`);
        const p = res.data;
        setForm({
          DocType: p.DocType,
          PolicyNum: p.PolicyNum,
          InitDate: p.InitDate,
          DueDate: p.DueDate,
          AscValue: p.AscValue,
          id_slrs: p.id_slrs,
          id_ctms: p.id_ctms,
          id_insurance: p.id_insurance,
        });
        const sell = s.data.find((s0) => s0.id === p.id_slrs);
        if (sell) setSellerName(sell.nombre);
        const cli = c.data.find((cl) => cl.id === p.id_ctms);
        if (cli) setClientName(`${cli.nombre} ${cli.apellidos || ""}`.trim());
        const ins = a.data.find((i) => i.id === p.id_insurance);
        if (ins) setInsuranceName(ins.CompanyName);
        setLines(
          p.lines.map((l) => ({
            id_itm: l.id_itm,
            LineNum: l.LineNum,
            LineTotal: l.LineTotal,
            plate: v.data.find((veh) => veh.id === l.id_itm)?.Plate || "",
          }))
        );
      }
    });
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLineChange = (idx, e) => {
    const newLines = [...lines];
    newLines[idx] = { ...newLines[idx], [e.target.name]: e.target.value };
    setLines(newLines);
  };

  const addLine = () => {
    setLines([
      ...lines,
      { id_itm: "", LineNum: lines.length + 1, LineTotal: "", plate: "" },
    ]);
  };

  const removeLine = (idx) => {
    const remaining = lines.filter((_, i) => i !== idx);
    setLines(remaining.map((l, i) => ({ ...l, LineNum: i + 1 })));
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
      if (isEdit) {
        await API.put(`/polizas/${id}`, payload);
        alert("Póliza actualizada");
      } else {
        await API.post("/polizas", payload);
        alert("Póliza creada");
      }
      navigate("/polizas");
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
      setSellerName("");
      setClientName("");
      setInsuranceName("");
      setLines([{ id_itm: "", LineNum: 1, LineTotal: "", plate: "" }]);
    } catch (err) {
      alert("Error al guardar póliza");
    }
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">{isEdit ? "Editar Póliza" : "Crear Póliza"}</h2>
      <form onSubmit={handleSubmit} className="card p-3 shadow-sm">
        <div className="row">
          <div className="col-md-6 mb-3">
            {/* <h6>Tipo póliza</h6> */}
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
            <h6>Fecha Inicio</h6>
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
            <h6>Fecha Vencimiento</h6>
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
            <input
              name="id_slrs"
              className="form-control"
              placeholder="Vendedor"
              value={sellerName}
              onFocus={() => setShowSellerSelect(true)}
              readOnly
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <input
              name="id_ctms"
              className="form-control"
              placeholder="Cliente"
              value={clientName}
              onFocus={() => setShowClientSelect(true)}
              readOnly
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <input
              name="id_insurance"
              className="form-control"
              placeholder="Aseguradora"
              value={insuranceName}
              onFocus={() => setShowInsuranceSelect(true)}
              readOnly
              required
            />
          </div>
        </div>
        <hr />
        <h5>Vehículos</h5>
        {lines.map((line, idx) => (
          <div className="row align-items-end" key={idx}>
            <div className="col-md-3 mb-3">
              <input
                name="LineNum"
                type="number"
                className="form-control"
                value={line.LineNum}
                disabled
              />
            </div>
            <div className="col-md-5 mb-3">
              <input
                name="id_itm"
                className="form-control"
                placeholder="Vehículo"
                value={line.plate}
                onFocus={() => setVehicleIndex(idx)}
                readOnly
                required
              />
            </div>
            <div className="col-md-3 mb-3">
              <input
                name="LineTotal"
                type="number"
                className="form-control"
                placeholder="Valor"
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
      {showSellerSelect && (
        <SellerSelectModal
          sellers={sellers}
          onSelect={(s) => {
            setForm({ ...form, id_slrs: s.id });
            setSellerName(s.nombre);
            setShowSellerSelect(false);
          }}
          onClose={() => setShowSellerSelect(false)}
        />
      )}
      {showClientSelect && (
        <ClientSelectModal
          clients={clients}
          onSelect={(c) => {
            setForm({ ...form, id_ctms: c.id });
            setClientName(`${c.nombre} ${c.apellidos || ""}`.trim());
            setShowClientSelect(false);
          }}
          onClose={() => setShowClientSelect(false)}
        />
      )}
      {showInsuranceSelect && (
        <InsuranceSelectModal
          insurances={insurances}
          onSelect={(i) => {
            setForm({ ...form, id_insurance: i.id });
            setInsuranceName(i.CompanyName);
            setShowInsuranceSelect(false);
          }}
          onClose={() => setShowInsuranceSelect(false)}
        />
      )}
      {vehicleIndex !== null && (
        <VehicleSelectModal
          vehicles={vehicles}
          onSelect={(v) => {
            const newLines = [...lines];
            newLines[vehicleIndex] = { ...newLines[vehicleIndex], id_itm: v.id, plate: v.Plate };
            setLines(newLines);
            setVehicleIndex(null);
          }}
          onClose={() => setVehicleIndex(null)}
        />
      )}
    </div>
  );
}