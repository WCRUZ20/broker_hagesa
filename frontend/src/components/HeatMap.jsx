import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import API from "../services/api";
import L from "leaflet";
import "leaflet.heat";

function HeatLayer({ points }) {
  const map = useMap();
  useEffect(() => {
    if (!points.length) return;
    const layer = L.heatLayer(points, { radius: 25 });
    layer.addTo(map);
    return () => {
      map.removeLayer(layer);
    };
  }, [map, points]);
  return null;
}

export default function HeatMap() {
  const [coords, setCoords] = useState([]);
  const [center, setCenter] = useState([0, 0]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await API.get("/clientes");
        const points = res.data
          .filter((c) => c.latitud && c.longitud)
          .map((c) => [c.latitud, c.longitud]);
        if (points.length) {
          setCenter(points[0]);
          setCoords(points);
        }
      } catch (e) {
        console.error("Error loading coordinates", e);
      }
    };
    load();
  }, []);

  return (
    <MapContainer center={center} zoom={5} style={{ height: "500px", width: "100%" }}>
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <HeatLayer points={coords} />
    </MapContainer>
  );
}