import { useEffect, useState } from "react";
import API from "../services/api";

export default function Polizas() {
  const [items, setItems] = useState([]);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  const loadItems = async () => {
    const res = await API.get("/polizas");
    setItems(res.data);
  };

  useEffect(() => {
    loadItems();
  }, []);

  useEffect(() => {
    const handler = () => {
      setDarkMode(localStorage.getItem("darkMode") === "true");
    };
    window.addEventListener("darkModeChange", handler);
    return () => window.removeEventListener("darkModeChange", handler);
  }, []);

  return (
    <div className="container py-4">
      <h2 className="mb-4">Listado de Pólizas</h2>
      <div className={`card shadow-sm ${darkMode ? "bg-dark text-white" : ""}`}>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table
              className={`table table-hover align-middle mb-0 ${
                darkMode ? "table-dark" : "table-striped"
              }`}
            >
              <thead className={darkMode ? "" : "table-light"}>
                <tr>
                  <th>ID</th>
                  <th>Número</th>
                  <th>Tipo</th>
                  <th>Inicio</th>
                  <th>Vencimiento</th>
                  <th>Valor Asegurado</th>
                </tr>
              </thead>
              <tbody>
                {items.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.PolicyNum}</td>
                    <td>{p.DocType}</td>
                    <td>{p.InitDate}</td>
                    <td>{p.DueDate}</td>
                    <td>{p.AscValue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
