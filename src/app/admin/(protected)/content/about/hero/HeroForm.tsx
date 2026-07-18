"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  updateAboutHeroTextAction,
  assignAboutHeroImageAction,
} from "@/features/admin/about/actions";
import type { AdminAboutHeroSectionVM, MediaAssetVM } from "@/features/admin/types";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { MediaPickerModal } from "@/components/admin/media/MediaPickerModal";
import { useToast } from "@/components/admin/Toast";
import { ImageIcon } from "lucide-react";

const INPUT =
  "w-full bg-white/70 border border-neutral-300 rounded-xl px-4 py-3 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 transition";
const LABEL =
  "block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2";

const HERO_SLOTS = [
  { slot: 1, label: "Slot 1 - Main (2x2 large)" },
  { slot: 2, label: "Slot 2 - Top right" },
  { slot: 3, label: "Slot 3 - Mid right" },
  { slot: 4, label: "Slot 4 - Bottom left (2x1)" },
  { slot: 5, label: "Slot 5 - Bottom right" },
] as const;

export function HeroForm({ data }: { data: AdminAboutHeroSectionVM }) {
  const [activeSlot, setActiveSlot] = useState<number | null>(null);
  const [images, setImages] = useState(data.images);
  const router = useRouter();
  const { showToast } = useToast();

  const actionHandler = async (formData: FormData) => {
    const result = await updateAboutHeroTextAction(
      Object.fromEntries(formData.entries())
    );
    if (result.success) {
      showToast("Saved", "Hero text updated.", "success");
      router.refresh();
    } else {
      showToast("Save failed", result.error, "error");
    }
  };

  const handleMediaSelect = async (asset: MediaAssetVM) => {
    if (activeSlot === null) return;
    const slot = activeSlot;
    setActiveSlot(null);

    // Optimistic update
    setImages((prev) =>
      prev.map((img) =>
        img.slot === slot
          ? {
              ...img,
              image_asset_id: asset.id,
              image: {
                asset_id: asset.id,
                url: asset.file_url,
                alt: asset.alt_text,
                width: asset.width,
                height: asset.height,
              },
            }
          : img
      )
    );

    const result = await assignAboutHeroImageAction({
      section_id: data.id,
      slot,
      image_asset_id: asset.id,
    });
    if (result.success) {
      showToast("Image saved", `Slot ${slot} updated.`, "success");
    } else {
      // Revert
      setImages(data.images);
      showToast("Image failed", result.error, "error");
    }
  };

  return (
    <form action={actionHandler} className="flex flex-col h-full min-h-0">
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-5 border-b border-white/30 bg-white/20 backdrop-blur-sm shrink-0">
        <div>
          <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-widest mb-0.5">
            About
          </p>
          <h1 className="text-xl font-bold text-neutral-900">Hero Section</h1>
        </div>
        <SubmitButton />
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="grid grid-cols-3 divide-x divide-white/30">
          {/* Text fields */}
          <div className="col-span-2 p-8 pb-12 space-y-6">
            <div>
              <label className={LABEL}>Headline</label>
              <textarea
                name="headline"
                defaultValue={data.headline}
                required
                rows={3}
                className={`${INPUT} resize-y`}
              />
            </div>
            <div>
              <label className={LABEL}>Subtext</label>
              <textarea
                name="subtext"
                defaultValue={data.subtext}
                required
                rows={3}
                className={`${INPUT} resize-y`}
              />
            </div>
          </div>

          {/* Image slots */}
          <div className="col-span-1 p-6 pb-12 space-y-4">
            <p className={LABEL}>Hero Images (5 slots)</p>
            {HERO_SLOTS.map(({ slot, label }) => {
              const slotData = images.find((i) => i.slot === slot);
              const img = slotData?.image ?? null;
              return (
                <div key={slot}>
                  <p className="text-xs text-neutral-600 mb-1.5 font-medium">{label}</p>
                  <button
                    type="button"
                    onClick={() => setActiveSlot(slot)}
                    className="w-full aspect-[4/3] rounded-xl border-2 border-dashed border-neutral-300 bg-white/40 relative overflow-hidden group hover:border-neutral-500 transition-colors"
                  >
                    {img ? (
                      <>
                        <img
                          src={img.url}
                          alt={img.alt || label}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-white text-xs font-semibold">Change</span>
                        </div>
                      </>
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-neutral-400">
                        <ImageIcon className="w-6 h-6" />
                        <span className="text-xs">Click to select</span>
                      </div>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <MediaPickerModal
        isOpen={activeSlot !== null}
        onClose={() => setActiveSlot(null)}
        onSelect={handleMediaSelect}
      />
    </form>
  );
}
