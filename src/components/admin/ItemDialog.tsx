"use client";

import type { ReactNode } from "react";

export function ItemDialog({
  isOpen,
  title,
  onClose,
  children,
  wide = false,
}: {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        className={`bg-white rounded-xl shadow-2xl w-full ${wide ? "max-w-2xl" : "max-w-lg"} max-h-[90vh] flex flex-col overflow-hidden`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200 shrink-0">
          <h2 className="text-base font-semibold text-neutral-900">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-neutral-400 hover:text-neutral-600 text-2xl leading-none transition-colors"
          >
            &times;
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  );
}
