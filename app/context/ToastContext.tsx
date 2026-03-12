"use client";

import { createContext, useContext, useState } from "react";

type ToastType = "success" | "error" | "info";

interface ToastState {
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = (message: string, type: ToastType = "success") => {
    setToast({ message, type });

    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {toast && (
        <div className="fixed top-3 left-1/2 -translate-x-1/2 z-[9999] w-[95%] max-w-[420px]">
          <div
            className={`flex items-center justify-between rounded-2xl px-4 py-3 shadow-xl bg-white
              ${
                toast.type === "success"
                  ? "border-l-4 border-green-500"
                  : toast.type === "error"
                  ? "border-l-4 border-red-500"
                  : "border-l-4 border-blue-500"
              }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 flex items-center justify-center rounded-full bg-green-100">
                {toast.type === "success"
                  ? "✔️"
                  : toast.type === "error"
                  ? "❌"
                  : "ℹ️"}
              </div>

              <p className="text-sm font-medium text-gray-800">
                {toast.message}
              </p>
            </div>

            <button onClick={() => setToast(null)}>✕</button>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }
  return context;
}