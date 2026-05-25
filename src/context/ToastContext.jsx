import React, { createContext, useContext, useState, useCallback } from "react";
import "./Toast.css";

const ToastContext = createContext(null);
const ConfirmContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export const useConfirm = () => {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error("useConfirm must be used within a ToastProvider");
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const [confirmState, setConfirmState] = useState(null);

  const showToast = useCallback((message, type = "info", duration = 4000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const toast = {
    success: (msg, dur) => showToast(msg, "success", dur),
    error: (msg, dur) => showToast(msg, "error", dur),
    info: (msg, dur) => showToast(msg, "info", dur),
  };

  const confirm = useCallback((message) => {
    return new Promise((resolve) => {
      setConfirmState({
        message,
        onConfirm: () => {
          setConfirmState(null);
          resolve(true);
        },
        onCancel: () => {
          setConfirmState(null);
          resolve(false);
        },
      });
    });
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={toast}>
      <ConfirmContext.Provider value={confirm}>
        {children}
        
        {/* Toasts List Container */}
        <div className="toast-container">
          {toasts.map((t) => (
            <div key={t.id} className={`toast-card toast-${t.type}`} onClick={() => removeToast(t.id)}>
              <div className="toast-icon">
                {t.type === "success" && "🟢"}
                {t.type === "error" && "🔴"}
                {t.type === "info" && "🔵"}
              </div>
              <div className="toast-message">{t.message}</div>
              <button className="toast-close">&times;</button>
            </div>
          ))}
        </div>

        {/* Global Styled Glassmorphic Confirm Modal */}
        {confirmState && (
          <div className="confirm-overlay" onClick={confirmState.onCancel}>
            <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
              <div className="confirm-header-icon">⚠️</div>
              <div className="confirm-message">
                {confirmState.message.split("\n").map((line, idx) => (
                  <React.Fragment key={idx}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}
              </div>
              <div className="confirm-actions">
                <button className="confirm-btn-cancel" onClick={confirmState.onCancel}>
                  Cancel
                </button>
                <button className="confirm-btn-confirm" onClick={confirmState.onConfirm}>
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </ConfirmContext.Provider>
    </ToastContext.Provider>
  );
};
