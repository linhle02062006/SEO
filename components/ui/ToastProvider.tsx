"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "info";
type Toast = { id: number; type: ToastType; message: string };

type ToastContextValue = {
  toast: (message: string, type?: ToastType) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const ICONS: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle2 className="size-5 text-emerald-500" />,
  error: <AlertCircle className="size-5 text-rose-500" />,
  info: <Info className="size-5 text-brand-500" />,
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const remove = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (message: string, type: ToastType = "info") => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev.slice(-3), { id, type, message }]);
      window.setTimeout(() => remove(id), 4000);
    },
    [remove],
  );

  const value = useMemo<ToastContextValue>(
    () => ({
      toast,
      success: (m: string) => toast(m, "success"),
      error: (m: string) => toast(m, "error"),
      info: (m: string) => toast(m, "info"),
    }),
    [toast],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed bottom-4 right-4 z-[90] flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-2"
        aria-live="polite"
        role="status"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "pointer-events-auto flex items-start gap-3 rounded-xl border border-ink-200 bg-white p-3.5 shadow-lg shadow-ink-900/5",
              "animate-[toast-in_.25s_ease-out]",
            )}
          >
            <span className="mt-0.5 shrink-0">{ICONS[t.type]}</span>
            <p className="flex-1 text-sm leading-5 text-ink-800">{t.message}</p>
            <button
              type="button"
              onClick={() => remove(t.id)}
              className="shrink-0 rounded-md p-0.5 text-ink-400 transition hover:bg-ink-100 hover:text-ink-700"
              aria-label="Đóng thông báo"
            >
              <X className="size-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast phải nằm trong <ToastProvider>");
  return ctx;
}
