import { forwardRef, useEffect, useRef, useState } from "react";
import "./RichTextEditor.css";

const RichTextEditor = forwardRef(function RichTextEditor({ 
  value, 
  onChange, 
  placeholder = "Escribe tu contenido aquí...",
  darkMode = true,
  disabled = false,
  className = ""
}, ref) {
  const localRef = useRef(null);
  const editorRef = ref || localRef;
  const [isActive, setIsActive] = useState(false);

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
    if (disabled) return;
    
    try {
      document.execCommand(cmd, false, val);
      emitChange();
      if (editorRef.current) {
        editorRef.current.focus();
      }
    } catch (error) {
      console.error('Error ejecutando comando:', error);
    }
  };

  const handleImage = (e) => {
    if (disabled) return;
    
    const file = e.target.files[0];
    if (file) {
      // Validar tamaño de archivo (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen es demasiado grande. Máximo 5MB.');
        e.target.value = "";
        return;
      }
      
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona un archivo de imagen válido.');
        e.target.value = "";
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (ev) => {
        exec("insertImage", ev.target.result);
      };
      reader.onerror = () => {
        alert('Error al cargar la imagen.');
      };
      reader.readAsDataURL(file);
    }
    e.target.value = "";
  };

  const handleFocus = () => {
    setIsActive(true);
  };

  const handleBlur = () => {
    setIsActive(false);
  };

  const handleKeyDown = (e) => {
    if (disabled) return;
    
    // Atajos de teclado
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          exec('bold');
          break;
        case 'i':
          e.preventDefault();
          exec('italic');
          break;
        case 'u':
          e.preventDefault();
          exec('underline');
          break;
        case 'z':
          if (e.shiftKey) {
            e.preventDefault();
            exec('redo');
          } else {
            e.preventDefault();
            exec('undo');
          }
          break;
      }
    }
  };

  const toolbarButtons = [
    {
      title: "Negrita (Ctrl+B)",
      icon: "bi-type-bold",
      action: () => exec("bold"),
      type: "button"
    },
    {
      title: "Cursiva (Ctrl+I)", 
      icon: "bi-type-italic",
      action: () => exec("italic"),
      type: "button"
    },
    {
      title: "Subrayado (Ctrl+U)",
      icon: "bi-type-underline", 
      action: () => exec("underline"),
      type: "button"
    },
    {
      title: "Aumentar tamaño",
      text: "A+",
      action: () => exec("fontSize", 5),
      type: "button"
    },
    {
      title: "Reducir tamaño",
      text: "A-", 
      action: () => exec("fontSize", 3),
      type: "button"
    },
    {
      title: "Color de texto",
      type: "color",
      action: (e) => exec("foreColor", e.target.value)
    },
    {
      title: "Color de fondo",
      type: "highlight",
      action: (e) => exec("hiliteColor", e.target.value)
    },
    {
      title: "Lista con viñetas",
      icon: "bi-list-ul",
      action: () => exec("insertUnorderedList"),
      type: "button"
    },
    {
      title: "Lista numerada", 
      icon: "bi-list-ol",
      action: () => exec("insertOrderedList"),
      type: "button"
    },
    {
      title: "Alinear izquierda",
      icon: "bi-text-left",
      action: () => exec("justifyLeft"),
      type: "button"
    },
    {
      title: "Centrar",
      icon: "bi-text-center", 
      action: () => exec("justifyCenter"),
      type: "button"
    },
    {
      title: "Alinear derecha",
      icon: "bi-text-right",
      action: () => exec("justifyRight"),
      type: "button"
    },
    {
      title: "Insertar imagen",
      icon: "bi-image",
      type: "file"
    },
    {
      title: "Insertar enlace",
      icon: "bi-link-45deg",
      action: () => {
        const url = prompt("Ingresa la URL del enlace:");
        if (url) exec("createLink", url);
      },
      type: "button"
    },
    {
      title: "Deshacer (Ctrl+Z)",
      icon: "bi-arrow-counterclockwise",
      action: () => exec("undo"),
      type: "button"
    },
    {
      title: "Rehacer (Ctrl+Shift+Z)",
      icon: "bi-arrow-clockwise", 
      action: () => exec("redo"),
      type: "button"
    },
    {
      title: "Limpiar formato",
      icon: "bi-eraser",
      action: () => exec("removeFormat"),
      type: "button"
    }
  ];

  return (
    <div 
      className={`rich-editor ${darkMode ? '' : 'light-theme'} ${className} ${isActive ? 'active' : ''} ${disabled ? 'disabled' : ''}`}
    >
      <div className="toolbar">
        {toolbarButtons.map((button, index) => {
          if (button.type === "color") {
            return (
              <input
                key={index}
                type="color"
                onChange={button.action}
                title={button.title}
                disabled={disabled}
                defaultValue="#ffffff"
              />
            );
          }
          
          if (button.type === "highlight") {
            return (
              <input
                key={index}
                type="color"
                onChange={button.action}
                title={button.title}
                disabled={disabled}
                defaultValue="#ffff00"
              />
            );
          }
          
          if (button.type === "file") {
            return (
              <label key={index} title={button.title} className={disabled ? 'disabled' : ''}>
                {button.icon && <i className={`bi ${button.icon}`}></i>}
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImage}
                  disabled={disabled}
                />
              </label>
            );
          }
          
          return (
            <button
              key={index}
              type="button"
              onClick={button.action}
              title={button.title}
              disabled={disabled}
            >
              {button.icon && <i className={`bi ${button.icon}`}></i>}
              {button.text && <span>{button.text}</span>}
            </button>
          );
        })}
      </div>
      
      <div
        ref={editorRef}
        className="editor"
        contentEditable={!disabled}
        onInput={emitChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        data-placeholder={placeholder}
        suppressContentEditableWarning={true}
        style={{ 
          minHeight: "200px",
          opacity: disabled ? 0.6 : 1,
          pointerEvents: disabled ? 'none' : 'auto'
        }}
      />
      
      {disabled && (
        <div className="editor-overlay" style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '16px'
        }}>
          <span style={{ 
            color: 'rgb(150, 146, 138)', 
            fontSize: '0.9rem',
            fontWeight: '500'
          }}>
            Editor deshabilitado
          </span>
        </div>
      )}
    </div>
  );
});

export default RichTextEditor;