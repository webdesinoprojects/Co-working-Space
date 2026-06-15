"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { Check, X, Clipboard, AlertCircle } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

export type ToastVariant = "success" | "error" | "copied";

export interface ToastData {
  id: string;
  title: string;
  message?: string;
  variant: ToastVariant;
}

// ── Context ───────────────────────────────────────────────────────────────────

interface ToastCtx {
  showToast: (title: string, message?: string, variant?: ToastVariant) => void;
}

const ToastContext = createContext<ToastCtx | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}

// ── Provider ──────────────────────────────────────────────────────────────────

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const showToast = useCallback((title: string, message?: string, variant: ToastVariant = "success") => {
    setToasts((prev) => [...prev, { id: crypto.randomUUID(), title, message, variant }]);
  }, []);

  const dismiss = (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastStack toasts={toasts} onDone={dismiss} />
    </ToastContext.Provider>
  );
}

// ── Single toast item ─────────────────────────────────────────────────────────

const VARIANTS = {
  success: {
    icon: <Check size={13} className="text-green-400" />,
    bubble: "bg-green-500/20",
  },
  error: {
    icon: <AlertCircle size={13} className="text-red-400" />,
    bubble: "bg-red-500/20",
  },
  copied: {
    icon: <Clipboard size={13} className="text-blue-400" />,
    bubble: "bg-blue-500/20",
  },
};

function Toast({ toast, onDone }: { toast: ToastData; onDone: () => void }) {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  const close = useCallback(() => {
    setClosing(true);
    setTimeout(onDone, 280);
  }, [onDone]);

  useEffect(() => {
    const enter = requestAnimationFrame(() => setVisible(true));
    const exit = setTimeout(close, 2200);
    return () => { cancelAnimationFrame(enter); clearTimeout(exit); };
  }, [close]);

  const v = VARIANTS[toast.variant];

  return (
    <div
      className={`flex items-center gap-3 bg-neutral-900/95 backdrop-blur-md text-white pl-3 pr-4 py-3 rounded-2xl shadow-2xl border border-white/10 min-w-[220px] max-w-xs transition-all duration-300 ${
        closing ? "opacity-0 translate-y-2" : visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
      }`}
    >
      <span className={`flex items-center justify-center w-7 h-7 rounded-xl ${v.bubble} shrink-0`}>
        {v.icon}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-white leading-tight">{toast.title}</p>
        {toast.message && (
          <p className="text-[11px] text-neutral-400 font-mono truncate mt-0.5">{toast.message}</p>
        )}
      </div>
      <button type="button" onClick={close} className="text-neutral-600 hover:text-neutral-300 transition-colors shrink-0 ml-1">
        <X size={12} />
      </button>
    </div>
  );
}

// ── Stack ─────────────────────────────────────────────────────────────────────

export function ToastStack({ toasts, onDone }: { toasts: ToastData[]; onDone: (id: string) => void }) {
  if (toasts.length === 0) return null;
  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-2 items-end pointer-events-none">
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto">
          <Toast toast={t} onDone={() => onDone(t.id)} />
        </div>
      ))}
    </div>
  );
}
