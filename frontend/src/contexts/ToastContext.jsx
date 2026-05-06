import { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);
let toastId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback((message, type = 'info') => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type, exiting: false }]);
    setTimeout(() => {
      setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, exiting: true } : t)));
      setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 200);
    }, 4000);
  }, []);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, exiting: true } : t)));
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 200);
  }, []);

  const icons = {
    success: <CheckCircle className="w-4 h-4 text-accent-emerald" />,
    error:   <AlertCircle className="w-4 h-4 text-accent-rose" />,
    info:    <Info className="w-4 h-4 text-accent-blue" />,
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`card-glow px-4 py-3 flex items-start gap-3 ${
              t.exiting ? 'toast-exit' : 'toast-enter'
            }`}
          >
            <span className="mt-0.5">{icons[t.type]}</span>
            <p className="text-sm text-white/80 flex-1">{t.message}</p>
            <button
              onClick={() => dismiss(t.id)}
              className="text-white/30 hover:text-white/60 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
