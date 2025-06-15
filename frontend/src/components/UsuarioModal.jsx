import { useState, useEffect } from "react";
import API from "../services/api";

export default function UsuarioModal({ user, onClose }) {
  const isEdit = !!user;

  const [form, setForm] = useState({
    user_name: "",
    last_name: "",
    user_role: "R",
    user_cod: "",
    user_email: "",
    user_password: "",
    user_photo: "",
    user_position: "",
    user_status: "Habilitado"
  });
  
  const [cargos, setCargos] = useState([]);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    API.get("/cargos")
      .then((res) => setCargos(res.data))
      .catch(() => setCargos([]));
  }, []);

  useEffect(() => {
    if (isEdit) {
      setForm({ ...user, user_password: "", user_position: user.user_position ?? "" });
      setShowPassword(false);
    }
  }, [user]);

  const handleChange = (e) => {
     const value =
      e.target.name === "user_position"
        ? e.target.value === "" ? "" : Number(e.target.value)
        : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  const handlePhotoChange = (e) => {
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
        setForm((prevForm) => ({
          ...prevForm,
          user_photo: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let payload = { ...form };
      if (payload.user_position === "") {
        payload.user_position = null;
      }
      if (isEdit && !payload.user_password.trim()) {
        delete payload.user_password;
      }
      if (isEdit) {
        await API.put(`/users/${user.id}`, payload);
      } else {
        await API.post("/users/create", payload);
      }
      onClose();
    } catch (err) {
      alert("Error al guardar el usuario");
    }
  };

  return (
    <div className="modal show fade d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">{isEdit ? "Editar Usuario" : "Nuevo Usuario"}</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              <div className="container-fluid">
                <div className="row g-2 mb-2">
                  <div className="col-md-6">
                    <label className="form-label">Nombre</label>
                    <input
                      name="user_name"
                      className="form-control"
                      placeholder="Nombre"
                      value={form.user_name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Apellido</label>
                    <input
                      name="last_name"
                      className="form-control"
                      placeholder="Apellido"
                      value={form.last_name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="row g-2 mb-2">
                  <div className="col-md-6">
                    <label className="form-label">Código usuario</label>
                    <input
                      name="user_cod"
                      className="form-control"
                      placeholder="Código usuario"
                      value={form.user_cod}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Correo</label>
                    <input
                      name="user_email"
                      className="form-control"
                      placeholder="Correo"
                      type="email"
                      value={form.user_email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="row g-2 mb-2">
                  <div className="col-md-6">
                    <label className="form-label">Cargo</label>
                    <select
                      name="user_position"
                      className="form-select"
                      value={form.user_position}
                      onChange={handleChange}
                    >
                      <option value="">Seleccione cargo</option>
                      {cargos.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.Description}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Foto</label>
                    <input
                      type="file"
                      accept="image/*"
                      className="form-control"
                      onChange={handlePhotoChange}
                    />
                  </div>
                </div>

                {form.user_photo && (
                  <div className="row mb-2">
                    <div className="col text-center">
                      <img
                        src={form.user_photo}
                        alt="Vista previa"
                        className="rounded-circle"
                        width={100}
                        height={100}
                      />
                    </div>
                  </div>
                )}

                <div className="row g-2 mb-2">
                  <div className="col-md-6">
                    <label className="form-label">Contraseña</label>
                    <div className="input-group">
                      <input
                        name="user_password"
                        className="form-control"
                        placeholder={isEdit ? "Contraseña (dejar en blanco para mantener)" : "Contraseña"}
                        type={showPassword ? "text" : "password"}
                        value={form.user_password}
                        onChange={handleChange}
                        {...(!isEdit && { required: true })}
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                      </button>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Rol</label>
                    <select
                      name="user_role"
                      className="form-select"
                      value={form.user_role}
                      onChange={handleChange}
                    >
                      <option value="A">Administrador</option>
                      <option value="R">Regular</option>
                    </select>
                  </div>
                </div>

                <div className="row g-2 mb-2">
                  <div className="col-md-6">
                    <label className="form-label">Estado</label>
                    <select
                      name="user_status"
                      className="form-select"
                      value={form.user_status}
                      onChange={handleChange}
                      required
                    >
                      <option value="Habilitado">Habilitado</option>
                      <option value="Deshabilitado">Deshabilitado</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={onClose} type="button">Cancelar</button>
              <button className="btn btn-primary" type="submit">Guardar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
