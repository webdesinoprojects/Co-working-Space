"use client";

import { MediaAssetVM } from "@/features/admin/types";
import { MediaLibrary } from "./MediaLibrary";

export function MediaPickerModal({ isOpen, onClose, onSelect }: { isOpen: boolean, onClose: () => void, onSelect: (asset: MediaAssetVM) => void }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/35 backdrop-blur-[2px]">
      <button
        type="button"
        aria-label="Close media picker overlay"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
      />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-[980px] flex-col overflow-hidden border-l border-white/60 bg-white/85 shadow-2xl backdrop-blur-2xl">
        <div className="flex items-center justify-between border-b border-neutral-200/80 px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900">Select Media Asset</h2>
            <p className="text-xs text-neutral-500">Search, filter, upload, then choose an image.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close media picker"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-500 transition hover:text-neutral-900"
          >
            <span className="text-2xl leading-none">&times;</span>
          </button>
        </div>
        <div className="flex-1 overflow-hidden bg-white/30 p-4">
          <MediaLibrary isModal={true} onSelect={(asset) => { onSelect(asset); onClose(); }} />
        </div>
      </aside>
    </div>
  );
}
