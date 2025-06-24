import { forwardRef, useEffect, useRef, useState, useCallback } from "react";
import "./RichTextEditor.css";

const RichTextEditor = forwardRef(function RichTextEditor({ 
  value, 
  onChange, 
  placeholder = "Escribe tu contenido aquí...",
  darkMode = true,
  disabled = false,
  className = "",
  label = "",
  required = false,
  error = ""
}, ref) {
  const localRef = useRef(null);
  const editorRef = ref || localRef;
  const fileInputRef = useRef(null);
  const [isActive, setIsActive] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  const emitChange = useCallback(() => {
    if (onChange && editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const exec = useCallback((cmd, val = null) => {
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
  }, [disabled, emitChange]);

  const handleImage = useCallback(async (e) => {
    if (disabled) return;
    
    const file = e.target.files[0];
    if (!file) return;

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
    
    setImageUploading(true);
    
    try {
      const reader = new FileReader();
      reader.onload = (ev) => {
        exec("insertImage", ev.target.result);
        setImageUploading(false);
      };
      reader.onerror = () => {
        alert('Error al cargar la imagen.');
        setImageUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      alert('Error al procesar la imagen.');
      setImageUploading(false);
    }
    
    e.target.value = "";
  }, [disabled, exec]);

  const handleFocus = useCallback(() => {
    setIsActive(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsActive(false);
  }, []);

  const handleKeyDown = useCallback((e) => {
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
  }, [disabled, exec]);

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
      title: "Aumentar tamaño",
      text: "A+",
      action: () => exec("fontSize", "5"),
      type: "button"
    },
    {
      title: "Reducir tamaño", 
      text: "A-",
      action: () => exec("fontSize", "3"),
      type: "button"
    },
    {
      title: "Color de texto",
      action: (e) => exec("foreColor", e.target.value),
      type: "color"
    },
    {
      title: "Color de fondo",
      action: (e) => exec("hiliteColor", e.target.value),
      type: "highlight"
    },
    {
      title: "Insertar imagen",
      icon: "bi-image",
      action: () => fileInputRef.current?.click(),
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
    }
  ];

  return (
    <div className="form-group-modern">
      {label && (
        <label className="form-label-modern-static">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}
      
      <div
        className={`rich-editor-modern ${darkMode ? 'dark-theme' : 'light-theme'} ${className} ${isActive ? 'active' : ''} ${disabled ? 'disabled' : ''} ${error ? 'error' : ''}`}
      >
        <div className="toolbar-modern">
          {toolbarButtons.map((button, index) => {
            if (button.type === "color") {
              return (
                <div key={index} className="color-input-wrapper" title={button.title}>
                  <input
                    type="color"
                    onChange={button.action}
                    disabled={disabled}
                    defaultValue="#ffffff"
                    className="color-input-modern"
                  />
                  <i className="bi bi-palette color-icon"></i>
                </div>
              );
            }
            
            if (button.type === "highlight") {
              return (
                <div key={index} className="color-input-wrapper" title={button.title}>
                  <input
                    type="color"
                    onChange={button.action}
                    disabled={disabled}
                    defaultValue="#ffff00"
                    className="color-input-modern"
                  />
                  <i className="bi bi-paint-bucket color-icon"></i>
                </div>
              );
            }
            
            return (
              <button
                key={index}
                type="button"
                onClick={button.action}
                title={button.title}
                disabled={disabled || (button.title.includes("imagen") && imageUploading)}
                className="toolbar-btn-modern"
              >
                {button.icon && <i className={`bi ${button.icon}`}></i>}
                {button.text && <span>{button.text}</span>}
                {button.title.includes("imagen") && imageUploading && (
                  <div className="btn-spinner"></div>
                )}
              </button>
            );
          })}
        </div>
        
        <div
          ref={editorRef}
          className="editor-modern"
          contentEditable={!disabled}
          onInput={emitChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          data-placeholder={placeholder}
          suppressContentEditableWarning={true}
          role="textbox"
          aria-multiline="true"
          aria-required={required}
          aria-invalid={!!error}
          aria-describedby={error ? `editor-error-${Math.random()}` : undefined}
        />
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImage}
          style={{ display: 'none' }}
          disabled={disabled}
        />
        
        {disabled && (
          <div className="editor-overlay-modern">
            <div className="overlay-content">
              <i className="bi bi-lock"></i>
              <span>Editor deshabilitado</span>
            </div>
          </div>
        )}
      </div>
      
      {error && (
        <div className="form-error-modern" role="alert">
          <i className="bi bi-exclamation-circle me-1"></i>
          {error}
        </div>
      )}
    </div>
  );
});

export default RichTextEditor;