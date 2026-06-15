"use client";

import { useTransition } from "react";

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = "Delete",
  onConfirm,
  onCancel,
}: {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => Promise<void> | void;
  onCancel: () => void;
}) {
  const [isPending, startTransition] = useTransition();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full mx-4">
        <h3 className="text-base font-semibold text-neutral-900 mb-2">{title}</h3>
        <p className="text-sm text-neutral-600 mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={isPending}
            className="px-4 py-2 text-sm font-medium text-neutral-700 border border-neutral-300 rounded-lg hover:bg-neutral-50 disabled:opacity-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => startTransition(async () => { await onConfirm(); })}
            disabled={isPending}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            {isPending ? "Deleting..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
