"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import {
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Info,
  X,
} from "lucide-react";

export type ToastType = "success" | "warning" | "error" | "info";

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextValue {
  toasts: ToastItem[];
  showToast: (item: Omit<ToastItem, "id">) => void;
  removeToast: (id: string) => void;
  success: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    ({
      type,
      title,
      message,
      duration = 4000,
    }: Omit<ToastItem, "id">) => {
      const id = "toast-" + Date.now() + "-" + Math.random().toString(36).slice(2, 6);
      const newToast: ToastItem = { id, type, title, message, duration };

      setToasts((prev) => {
        // Limit max toasts to 4 to avoid screen clutter
        const next = [...prev, newToast];
        return next.slice(-4);
      });

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  const success = useCallback(
    (title: string, message?: string) => {
      showToast({ type: "success", title, message });
    },
    [showToast]
  );

  const warning = useCallback(
    (title: string, message?: string) => {
      showToast({ type: "warning", title, message });
    },
    [showToast]
  );

  const error = useCallback(
    (title: string, message?: string) => {
      showToast({ type: "error", title, message });
    },
    [showToast]
  );

  const info = useCallback(
    (title: string, message?: string) => {
      showToast({ type: "info", title, message });
    },
    [showToast]
  );

  return (
    <ToastContext.Provider
      value={{
        toasts,
        showToast,
        removeToast,
        success,
        warning,
        error,
        info,
      }}
    >
      {children}

      {/* Floating Toast Notification Stack */}
      <div
        aria-live="polite"
        className="fixed bottom-3 left-3 right-3 sm:left-auto sm:right-5 sm:bottom-5 z-50 flex flex-col gap-2 pointer-events-none sm:w-96 max-w-full"
      >
        {toasts.map((toast) => {
          const isWarning = toast.type === "warning";
          const isError = toast.type === "error";
          const isSuccess = toast.type === "success";

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto p-3 sm:p-3.5 rounded-xl border shadow-lg backdrop-blur-md transition-all duration-200 animate-toast-enter flex items-start justify-between gap-3 ${
                isWarning
                  ? "bg-amber-50/95 dark:bg-zinc-900/95 border-amber-300/80 dark:border-amber-800/80 text-zinc-900 dark:text-zinc-100"
                  : isError
                  ? "bg-rose-50/95 dark:bg-zinc-900/95 border-rose-300/80 dark:border-rose-800/80 text-zinc-900 dark:text-zinc-100"
                  : isSuccess
                  ? "bg-emerald-50/95 dark:bg-zinc-900/95 border-emerald-300/80 dark:border-emerald-800/80 text-zinc-900 dark:text-zinc-100"
                  : "bg-white/95 dark:bg-zinc-900/95 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100"
              }`}
            >
              <div className="flex items-start space-x-2.5 min-w-0">
                <div className="mt-0.5 shrink-0">
                  {isWarning && (
                    <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  )}
                  {isError && (
                    <AlertCircle className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                  )}
                  {isSuccess && (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  )}
                  {toast.type === "info" && (
                    <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  )}
                </div>

                <div className="space-y-0.5 min-w-0">
                  <p className="text-xs font-semibold leading-snug">
                    {toast.title}
                  </p>
                  {toast.message && (
                    <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      {toast.message}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 p-0.5 rounded cursor-pointer shrink-0 transition-colors"
                title="Tutup notifikasi"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
