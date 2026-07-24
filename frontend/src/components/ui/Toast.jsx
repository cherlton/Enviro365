import React, { createContext, useContext, useState, useCallback } from 'react';

/**
 * Enviro365 Global Toast Notification System
 * Provides feedback popup messages after every user action.
 */

const ToastContext = createContext(null);

let toastIdCounter = 0;

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ type = 'info', title, message, duration = 4000 }) => {
    const id = ++toastIdCounter;
    const toast = { id, type, title, message, duration, exiting: false };
    setToasts((prev) => [...prev, toast]);

    // Auto-dismiss after duration
    setTimeout(() => {
      dismissToast(id);
    }, duration);

    return id;
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, exiting: true } : t))
    );
    // Remove after exit animation
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 200);
  }, []);

  const success = useCallback((title, message) => addToast({ type: 'success', title, message }), [addToast]);
  const error = useCallback((title, message) => addToast({ type: 'error', title, message }), [addToast]);
  const warning = useCallback((title, message) => addToast({ type: 'warning', title, message }), [addToast]);
  const info = useCallback((title, message) => addToast({ type: 'info', title, message }), [addToast]);

  return (
    <ToastContext.Provider value={{ addToast, dismissToast, success, error, warning, info }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
};

const toastStyles = {
  success: {
    bg: 'bg-white border-l-4 border-l-[#1A7A6D]',
    icon: (
      <svg className="w-5 h-5 text-[#1A7A6D]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    progressColor: 'bg-[#1A7A6D]',
  },
  error: {
    bg: 'bg-white border-l-4 border-l-[#DC2626]',
    icon: (
      <svg className="w-5 h-5 text-[#DC2626]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
      </svg>
    ),
    progressColor: 'bg-[#DC2626]',
  },
  warning: {
    bg: 'bg-white border-l-4 border-l-[#D97706]',
    icon: (
      <svg className="w-5 h-5 text-[#D97706]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
    ),
    progressColor: 'bg-[#D97706]',
  },
  info: {
    bg: 'bg-white border-l-4 border-l-[#1A7A6D]',
    icon: (
      <svg className="w-5 h-5 text-[#1A7A6D]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
      </svg>
    ),
    progressColor: 'bg-[#1A7A6D]',
  },
};

const ToastContainer = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const style = toastStyles[toast.type] || toastStyles.info;
        return (
          <div
            key={toast.id}
            className={`${toast.exiting ? 'toast-exit' : 'toast-enter'} ${style.bg} border border-[#E5E0D8] rounded-[10px] shadow-[0_8px_20px_rgba(27,38,35,0.07)] pointer-events-auto overflow-hidden`}
          >
            <div className="p-4 flex items-start gap-3">
              <div className="mt-0.5 shrink-0">{style.icon}</div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-[#1C1917]">{toast.title}</p>
                {toast.message && <p className="text-[12px] text-[#57534E] mt-0.5 leading-normal">{toast.message}</p>}
              </div>
              <button
                onClick={() => onDismiss(toast.id)}
                className="text-[#A8A29E] hover:text-[#1C1917] transition-colors p-0.5 cursor-pointer shrink-0"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {/* Progress bar */}
            <div className="h-[3px] w-full bg-[#F2EFE9]">
              <div
                className={`h-full ${style.progressColor} toast-progress`}
                style={{ animationDuration: `${toast.duration}ms` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ToastProvider;
