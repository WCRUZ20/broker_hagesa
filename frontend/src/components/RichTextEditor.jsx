import { forwardRef, useEffect, useRef } from "react";
import "./RichTextEditor.css";

const RichTextEditor = forwardRef(function RichTextEditor({ value, onChange, placeholder = "" }, ref) {
  const localRef = useRef(null);
  const editorRef = ref || localRef;

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  const emitChange = () => {
    if (onChange && editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const exec = (cmd, val = null) => {
    document.execCommand(cmd, false, val);
    emitChange();
    editorRef.current && editorRef.current.focus();
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        exec("insertImage", ev.target.result);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = "";
  };

  return (
    <div className="rich-editor">
      <div className="toolbar mb-2">
        <button type="button" className="btn btn-sm btn-outline-secondary me-1" onClick={() => exec("bold")}
          title="Negrita">
          <i className="bi bi-type-bold"></i>
        </button>
        <button type="button" className="btn btn-sm btn-outline-secondary me-1" onClick={() => exec("fontSize", 5)}
          title="Aumentar tama\u00f1o">
          A+
        </button>
        <button type="button" className="btn btn-sm btn-outline-secondary me-1" onClick={() => exec("fontSize", 3)}
          title="Reducir tama\u00f1o">
          A-
        </button>
        <input type="color" className="form-control-color me-1" onChange={(e) => exec("foreColor", e.target.value)}
          title="Color" />
        <input type="color" className="form-control-color me-1" onChange={(e) => exec("hiliteColor", e.target.value)}
          title="Resaltar" />
        <button type="button" className="btn btn-sm btn-outline-secondary me-1" onClick={() => exec("insertUnorderedList")}
          title="Lista">
          <i className="bi bi-list-ul"></i>
        </button>
        <label className="btn btn-sm btn-outline-secondary me-1 mb-0" title="Imagen">
          <i className="bi bi-image"></i>
          <input type="file" accept="image/*" onChange={handleImage} style={{ display: "none" }} />
        </label>
        <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => exec("removeFormat")}
          title="Limpiar formato">
          <i className="bi bi-eraser"></i>
        </button>
      </div>
      <div
        ref={editorRef}
        className="editor form-control"
        contentEditable
        onInput={emitChange}
        data-placeholder={placeholder}
        style={{ minHeight: "150px" }}
      ></div>
    </div>
  );
});

export default RichTextEditor;