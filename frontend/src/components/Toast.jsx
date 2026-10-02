import React, { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext(null);

let toastId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "success", duration = 3500) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

  const ICONS = { success: "✅", error: "❌", info: "ℹ️", warning: "⚠️" };
  const COLORS = {
    success: { bg: "#ecfdf5", border: "#6ee7b7", text: "#065f46" },
    error:   { bg: "#fef2f2", border: "#fca5a5", text: "#991b1b" },
    info:    { bg: "#eff6ff", border: "#93c5fd", text: "#1e40af" },
    warning: { bg: "#fffbeb", border: "#fcd34d", text: "#92400e" },
  };

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      {/* Toast Container */}
      <div style={{
        position: "fixed",
        top: 80,
        right: 20,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        maxWidth: 340,
        width: "calc(100vw - 40px)",
      }}>
        {toasts.map((t) => {
          const c = COLORS[t.type] || COLORS.success;
          return (
            <div key={t.id} style={{
              background: c.bg,
              border: `1.5px solid ${c.border}`,
              color: c.text,
              borderRadius: 14,
              padding: "14px 16px",
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
              boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
              animation: "toastSlideIn 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards",
            }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>{ICONS[t.type]}</span>
              <span style={{ flex: 1, fontSize: "0.9rem", fontWeight: 600, lineHeight: 1.4 }}>
                {t.message}
              </span>
              <button
                onClick={() => removeToast(t.id)}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  color: c.text, fontSize: 16, padding: 0, lineHeight: 1, flexShrink: 0,
                }}
              >✕</button>
            </div>
          );
        })}
      </div>
      <style>{`
        @keyframes toastSlideIn {
          from { opacity: 0; transform: translateX(80px) scale(0.9); }
          to   { opacity: 1; transform: translateX(0)   scale(1);   }
        }
      `}</style>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx.toast;
}
