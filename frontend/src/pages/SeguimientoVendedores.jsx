import { useEffect, useState } from "react";
import API from "../services/api";
import ListStyles from "../components/ListStyles";

export default function SeguimientoVendedores() {
  const [polizas, setPolizas] = useState([]);
  const [vendedores, setVendedores] = useState([]);
  const [params, setParams] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [selected, setSelected] = useState([]);
  const [searchPol, setSearchPol] = useState("");
  const [searchHist, setSearchHist] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  useEffect(() => {
    API.get("/polizas").then((res) => setPolizas(res.data));
  }, []);
  useEffect(() => {
    API.get("/vendedores").then((res) => setVendedores(res.data));
  }, []);
  useEffect(() => {
    API.get("/seguimiento/parametros-envio").then((res) => {
      if (res.data && res.data.length > 0) setParams(res.data[0]);
    });
  }, []);
  useEffect(() => {
    API.get("/seguimiento/historial-correos").then((res) =>
      setHistorial(res.data.filter((h) => h.Destination === "S"))
    );
  }, []);
  useEffect(() => {
    const h = () => setDarkMode(localStorage.getItem("darkMode") === "true");
    window.addEventListener("darkModeChange", h);
    return () => window.removeEventListener("darkModeChange", h);
  }, []);

  const vendedoresMap = vendedores.reduce((a, v) => {
    a[v.id] = v;
    return a;
  }, {});

  const polizasMap = polizas.reduce((a,p)=>{a[p.id]=p; return a;}, {});

  const shouldSend = (p) => {
    if (!params) return false;
    if (p.activo !== "Y") return false;
    const due = new Date(p.DueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diff = Math.floor((due - today) / 86400000);
    const before = diff >= 0 && diff <= parseInt(params.daystodueSeller || 0, 10);
    const after = diff < 0 && Math.abs(diff) <= parseInt(params.maxdaysallow || 0, 10);
    return before || after;
  };

  const filteredPol = polizas
    .filter(shouldSend)
    .filter((p) => {
      const s = vendedoresMap[p.id_slrs] || {};
      const term = searchPol.toLowerCase();
      return (
        p.PolicyNum.toLowerCase().includes(term) ||
        (s.identificacion || "").toLowerCase().includes(term) ||
        (s.nombre || "").toLowerCase().includes(term) ||
        (s.email || "").toLowerCase().includes(term)
      );
    });

  const filteredHist = historial.filter((h) => {
    const term = searchHist.toLowerCase();
    const polNum = polizasMap[h.id_policy]?.PolicyNum?.toLowerCase() || "";
    const matchesText = h.Subject.toLowerCase().includes(term) || polNum.includes(term);
    const date = new Date(h.CreateDate);
    if (startDate && date < new Date(startDate)) return false;
    if (endDate && date > new Date(endDate)) return false;
    return matchesText;
  });

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selected.length === filteredPol.length) setSelected([]);
    else setSelected(filteredPol.map((p) => p.id));
  };

  const sendMails = async () => {
    if (selected.length === 0) return;
    await API.post("/seguimiento/historial-correos/enviar-vendedores", {
      policy_ids: selected,
    });
    setSelected([]);
    const res = await API.get("/seguimiento/historial-correos");
    setHistorial(res.data.filter((h) => h.Destination === "S"));
  };

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-md-6 mb-4">
          <div
            className={`card border-0 shadow-sm ${darkMode ? "bg-dark" : "bg-white"}`}
          >
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Pólizas por vencer</h5>
                <button
                  className="btn btn-primary"
                  disabled={selected.length === 0}
                  onClick={sendMails}
                >
                  Enviar correos
                </button>
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Buscar"
                  value={searchPol}
                  onChange={(e) => setSearchPol(e.target.value)}
                />
              </div>
              <div className="table-responsive" style={{ maxHeight: "40vh", overflowY: "auto" }}>
                <table className={`table table-hover ${darkMode ? "table-dark" : ""}`}>
                  <thead>
                    <tr>
                      <th>
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={
                            filteredPol.length > 0 && selected.length === filteredPol.length
                          }
                          onChange={toggleSelectAll}
                        />
                      </th>
                      <th>Nro. Póliza</th>
                      <th>Vendedor</th>
                      <th>Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPol.map((p) => {
                      const s = vendedoresMap[p.id_slrs] || {};
                      return (
                        <tr key={p.id}>
                          <td>
                            <input
                              type="checkbox"
                              className="form-check-input"
                              checked={selected.includes(p.id)}
                              onChange={() => toggleSelect(p.id)}
                            />
                          </td>
                          <td>{p.PolicyNum}</td>
                          <td>{s.nombre}</td>
                          <td>{s.email}</td>
                        </tr>
                      );
                    })}
                    {filteredPol.length === 0 && (
                      <tr>
                        <td colSpan="4" className="text-center">
                          Sin pólizas
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-4">
          <div
            className={`card border-0 shadow-sm ${darkMode ? "bg-dark" : "bg-white"}`}
          >
            <div className="card-body">
              <h5>Correos enviados</h5>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Buscar por asunto o póliza"
                  value={searchHist}
                  onChange={(e) => setSearchHist(e.target.value)}
                />
              </div>
              <div className="d-flex">
                  <input
                    type="date"
                    className="form-control me-2"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                  <input
                    type="date"
                    className="form-control"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              <div className="table-responsive" style={{ maxHeight: "40vh", overflowY: "auto" }}>
                <table className={`table table-hover ${darkMode ? "table-dark" : ""}`}>
                  <thead>
                    <tr>
                      <th>Asunto</th>
                      <th>Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredHist.map((h) => (
                      <tr key={h.id}>
                        <td>{h.Subject}</td>
                        <td>{h.CreateDate}</td>
                      </tr>
                    ))}
                    {filteredHist.length === 0 && (
                      <tr>
                        <td colSpan="2" className="text-center">
                          Sin correos
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ListStyles darkMode={darkMode} />
    </div>
  );
}