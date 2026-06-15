"use client";
import { useFormStatus } from "react-dom";

export function SubmitButton({ label = "Save Changes", savingLabel = "Saving..." }: { label?: string; savingLabel?: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-neutral-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-neutral-800 disabled:opacity-50 transition-colors"
    >
      {pending ? savingLabel : label}
    </button>
  );
}