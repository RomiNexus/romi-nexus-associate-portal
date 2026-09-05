// ToastProvider — global toast notifications + useToast hook
import { useState, useCallback, createContext, useContext } from "react";

const GOLD   = "#D4AF37";
const RED    = "#c0392b";
const GREEN  = "#27ae60";
const ORANGE = "#e67e22";
const MONO   = "'IBM Plex Mono',monospace";

const ToastCtx = createContext(null);

/** Call anywhere inside ToastProvider to fire a toast.
 *  add(msg, type?, duration?)  type: 'info'|'success'|'error'|'warn' */
export const useToast = () => useContext(ToastCtx);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const add = useCallback((msg, type = "info", duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts(t => [...t, { id, msg, type, dying: false }]);
    setTimeout(() => {
      setToasts(t => t.map(x => x.id === id ? { ...x, dying: true } : x));
      setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 400);
    }, duration);
  }, []);

  const colorMap = { success: GREEN, error: RED, warn: ORANGE, info: GOLD };

  return (
    <ToastCtx.Provider value={add}>
      {children}
      <div style={{
        position: "fixed", bottom: 24, right: 24,
        zIndex: 9999, display: "flex", flexDirection: "column", gap: 8,
      }}>
        {toasts.map(t => (
          <div key={t.id} style={{
            background: "#0d0d0d",
            border: `1px solid ${colorMap[t.type] || GOLD}`,
            borderLeft: `3px solid ${colorMap[t.type] || GOLD}`,
            padding: "10px 16px", borderRadius: 3,
            fontFamily: MONO, fontSize: 9,
            color: "#c0c0c0", maxWidth: 340, lineHeight: 1.6,
            animation: t.dying ? "toastOut 0.4s ease forwards" : "toastIn 0.3s ease",
            display: "flex", alignItems: "flex-start", gap: 10,
          }}>
            <span style={{ color: colorMap[t.type] || GOLD, flexShrink: 0 }}>
              {t.type === "success" ? "✓" : t.type === "error" ? "✗" : t.type === "warn" ? "⚠" : "●"}
            </span>
            <span>{t.msg}</span>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export default ToastProvider;
