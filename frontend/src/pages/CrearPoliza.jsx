import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import ClientSelectModal from "../components/ClientSelectModal";
import SellerSelectModal from "../components/SellerSelectModal";
import InsuranceSelectModal from "../components/InsuranceSelectModal";
import VehicleSelectModal from "../components/VehicleSelectModal";
import PolicySelectModal from "../components/PolicySelectModal";
import ListStyles from "../components/ListStyles";
import ToastNotification from "../components/ToastNotification";
import "./CrearPoliza.css";

export default function CrearPoliza() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );
  const accentColor = "rgb(200, 150, 82)";
  const [toast, setToast] = useState({ show: false, message: "" });
  const [form, setForm] = useState({
    DocType: "N",
    PolicyNum: "",
    InitDate: "",
    DueDate: "",
    ComiPrcnt: "",
    AscValue: "",
    id_slrs: "",
    id_ctms: "",
    id_insurance: "",
    id_poliza_rel: "",
    comentario: "",
    activo: "Y",
    aut_noti: "N",
  });
  const [lines, setLines] = useState([
    { id_itm: "", LineNum: 1, LineTotal: "", plate: "" },
  ]);
  const [sellers, setSellers] = useState([]);
  const [clients, setClients] = useState([]);
  const [insurances, setInsurances] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [showSellerSelect, setShowSellerSelect] = useState(false);
  const [showClientSelect, setShowClientSelect] = useState(false);
  const [showInsuranceSelect, setShowInsuranceSelect] = useState(false);
  const [showPolicySelect, setShowPolicySelect] = useState(false);
  const [vehicleIndex, setVehicleIndex] = useState(null);
  const [sellerName, setSellerName] = useState("");
  const [clientName, setClientName] = useState("");
  const [insuranceName, setInsuranceName] = useState("");
  const [policyRelName, setPolicyRelName] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  

  useEffect(() => {
    Promise.all([
      API.get("/vendedores"),
      API.get("/clientes"),
      API.get("/aseguradoras"),
      API.get("/vehiculos"),
      API.get("/polizas"),
    ]).then(async ([s, c, a, v, p0]) => {
      setSellers(s.data);
      setClients(c.data);
      setInsurances(a.data);
      setVehicles(v.data);
      setPolicies(p0.data);
        if (isEdit) {
          const res = await API.get(`/polizas/${id}`);
          const p = res.data;
          setForm({
            DocType: p.DocType,
            PolicyNum: p.PolicyNum,
            InitDate: p.InitDate,
            DueDate: p.DueDate,
            ComiPrcnt: p.ComiPrcnt,
            AscValue: p.AscValue,
            id_slrs: p.id_slrs,
            id_ctms: p.id_ctms,
            id_insurance: p.id_insurance,
            id_poliza_rel: p.id_poliza_rel || "",
            comentario: p.comentario || "",
            activo: p.activo,
            aut_noti: p.aut_noti,
          });
        const sell = s.data.find((s0) => s0.id === p.id_slrs);
        if (sell) setSellerName(sell.nombre);
        const cli = c.data.find((cl) => cl.id === p.id_ctms);
        if (cli) setClientName(`${cli.nombre} ${cli.apellidos || ""}`.trim());
        const ins = a.data.find((i) => i.id === p.id_insurance);
        if (ins) setInsuranceName(ins.CompanyName);
        const prel = p0.data.find((pl) => pl.id === p.id_poliza_rel);
        if (prel) setPolicyRelName(prel.PolicyNum);
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

  useEffect(() => {
    const handler = () => {
      setDarkMode(localStorage.getItem("darkMode") === "true");
    };
    window.addEventListener("darkModeChange", handler);
    return () => window.removeEventListener("darkModeChange", handler);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...form, [name]: value };
    if (name === "DocType" && value !== "R") {
      updated.id_poliza_rel = "";
      setPolicyRelName("");
    }
    setForm(updated);
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
      ComiPrcnt: Number(form.ComiPrcnt),
      AscValue: Number(form.AscValue),
      id_slrs: Number(form.id_slrs),
      id_ctms: Number(form.id_ctms),
      id_insurance: Number(form.id_insurance),
      id_poliza_rel: form.id_poliza_rel ? Number(form.id_poliza_rel) : null,
      comentario: form.comentario,
      activo: form.activo,
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
          ComiPrcnt: "",
          AscValue: "",
          id_slrs: "",
          id_ctms: "",
          id_insurance: "",
          id_poliza_rel: "",
          comentario: "",
          activo: "Y",
          aut_noti: "N",
        });
      setSellerName("");
      setClientName("");
      setInsuranceName("");
      setPolicyRelName("");
      setLines([{ id_itm: "", LineNum: 1, LineTotal: "", plate: "" }]);
    } catch (err) {
      const detail = err.response?.data?.detail;
      setToast({ show: true, message: detail || "Error al guardar póliza" });
    }
  };

  return (
    <div className="container-fluid py-4 px-4 crear-poliza-container">
      <ToastNotification
        show={toast.show}
        message={toast.message}
        onClose={() => setToast({ ...toast, show: false })}
      />
      <h2 className={`mb-4 fw-bold ${darkMode ? 'text-white' : 'text-dark'}`}>{isEdit ? "Editar Póliza" : "Crear Póliza"}</h2>
      <form onSubmit={handleSubmit} className={`card p-4 border-0 shadow-sm crear-poliza-card ${darkMode ? 'bg-dark text-light' : 'bg-white'}`}>
        <div className="d-flex justify-content-center mb-4 steps-container">
          <button
            type="button"
            className={`step-btn ${currentStep === 1 ? 'active' : ''}`}
            onClick={() => setCurrentStep(1)}
          >
            Cabecera
          </button>
          <div className="progress-line mx-2"></div>
          <button
            type="button"
            className={`step-btn ${currentStep === 2 ? 'active' : ''}`}
            onClick={() => setCurrentStep(2)}
          >
            Detalle
          </button>
        </div>
        {currentStep === 1 && (
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Tipo póliza</label>
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
            <label className="form-label">Número de póliza</label>
            <input
              name="PolicyNum"
              className="form-control"
              // placeholder="Número de póliza"
              value={form.PolicyNum}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Fecha Inicio</label>
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
            <label className="form-label">Fecha Vencimiento</label>
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
            <label className="form-label">% Comisión</label>
            <input
              name="ComiPrcnt"
              type="number"
              className="form-control"
              // placeholder="% Comisión"
              value={form.ComiPrcnt}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Valor asegurado</label>
            <input
              name="AscValue"
              type="number"
              step="0.01"
              className="form-control"
              // placeholder="Valor asegurado"
              value={form.AscValue}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Vendedor</label>
            <input
              name="id_slrs"
              className="form-control"
              // placeholder="Vendedor"
              value={sellerName}
              onFocus={() => setShowSellerSelect(true)}
              readOnly
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Cliente</label>
            <input
              name="id_ctms"
              className="form-control"
              // placeholder="Cliente"
              value={clientName}
              onFocus={() => setShowClientSelect(true)}
              readOnly
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Aseguradora</label>
            <input
              name="id_insurance"
              className="form-control"
              // placeholder="Aseguradora"
              value={insuranceName}
              onFocus={() => setShowInsuranceSelect(true)}
              readOnly
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Póliza relacionada</label>
            <input
              name="id_poliza_rel"
              className="form-control"
              // placeholder="Póliza relacionada"
              value={policyRelName}
              onFocus={() => setShowPolicySelect(true)}
              readOnly
              disabled={form.DocType !== "R"}
            />
          </div>
          <div className="col-md-6 mb-3 d-flex align-items-center">
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                id="activo-switch"
                checked={form.activo === "Y"}
                onChange={() =>
                  setForm({ ...form, activo: form.activo === "Y" ? "N" : "Y" })
                }
              />
              <label className="form-check-label ms-2" htmlFor="activo-switch">
                Activo
              </label>
            </div>
          </div>
          <div className="col-md-6 mb-3 d-flex align-items-center">
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                id="aut-noti-switch"
                checked={form.aut_noti === "Y"}
                onChange={() =>
                  setForm({ ...form, aut_noti: form.aut_noti === "Y" ? "N" : "Y" })
                }
              />
              <label className="form-check-label ms-2" htmlFor="aut-noti-switch">
                Notificación automática
              </label>
            </div>
          </div>
          <div className="col-md-12 mb-3">
            <label className="form-label">Comentario</label>
            <textarea
              name="comentario"
              className="form-control"
              // placeholder="Comentario"
              value={form.comentario}
              onChange={handleChange}
            />
          </div>
        </div>) }
        {currentStep === 2 && (<>
        <hr />
        <h5>Vehículos</h5>
        {lines.map((line, idx) => (
          <div className="row align-items-end" key={idx}>
            <div className="col-md-1 mb-3">
              <input
                name="LineNum"
                // type="number"
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
          {currentStep === 1 ? (
            <button
              type="button"
              className="btn px-4 py-2 rounded-3"
              style={{
                fontWeight: '500',
                transition: 'all 0.3s ease',
                backgroundColor: accentColor,
                borderColor: accentColor,
                color: '#fff',
                width: '200px',
                width: '200px'
              }}
          onClick={() => setCurrentStep(2)}
            >
              Siguiente
            </button>
          ) : (
            <>
              <button
                type="button"
                className="btn btn-secondary me-2"
                onClick={() => setCurrentStep(1)}
              >
                Anterior
              </button>
              <button
                className="btn px-4 py-2 rounded-3"
                style={{
                  fontWeight: '500',
                  transition: 'all 0.3s ease',
                  backgroundColor: accentColor,
                  borderColor: accentColor,
                  color: '#fff',
                  width: '200px'
                }}
              >
                {isEdit ? 'Actualizar' : 'Guardar'}
              </button>
            </>
          )}
        </div>
        </>)}
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
            setLines([{ id_itm: "", LineNum: 1, LineTotal: "", plate: "" }]);
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
      {showPolicySelect && (
        <PolicySelectModal
          policies={policies}
          onSelect={(p) => {
            setForm({ ...form, id_poliza_rel: p.id });
            setPolicyRelName(p.PolicyNum);
            setShowPolicySelect(false);
          }}
          onClose={() => setShowPolicySelect(false)}
        />
      )}
      {vehicleIndex !== null && (
        <VehicleSelectModal
          vehicles={vehicles.filter((v) => v.Propetary === Number(form.id_ctms))}
          onSelect={(v) => {
            const newLines = [...lines];
            newLines[vehicleIndex] = { ...newLines[vehicleIndex], id_itm: v.id, plate: v.Plate };
            setLines(newLines);
            setVehicleIndex(null);
          }}
          onClose={() => setVehicleIndex(null)}
        />
      )}
      <ListStyles darkMode={darkMode} accentColor={accentColor} />
    </div>
  );
}