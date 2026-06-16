"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateIntroTextAction, assignIntroImageAction } from "@/features/admin/homepage/actions";
import { AdminImagePreview, AdminIntroSectionVM, MediaAssetVM } from "@/features/admin/types";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { MediaPickerModal } from "@/components/admin/media/MediaPickerModal";
import { useToast } from "@/components/admin/Toast";
import { ImageIcon } from "lucide-react";

const INPUT = "w-full bg-white/70 border border-neutral-300 rounded-xl px-4 py-3 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 transition";
const LABEL = "block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2";

export function IntroForm({ data }: { data: AdminIntroSectionVM }) {
  const [activeSlot, setActiveSlot] = useState<string | null>(null);
  const router = useRouter();
  const { showToast } = useToast();

  const actionHandler = async (formData: FormData) => {
    const result = await updateIntroTextAction(Object.fromEntries(formData.entries()));
    if (result.success) {
      showToast("Saved changes", "Introducing Alley updated.", "success");
      router.refresh();
    } else {
      showToast("Save failed", result.error, "error");
    }
  };

  const handleMediaSelect = async (asset: MediaAssetVM) => {
    if (!activeSlot) return;
    const result = await assignIntroImageAction({ field: activeSlot + "_image_asset_id", asset_id: asset.id });
    if (result.success) {
      showToast("Image updated", "Introducing Alley image saved.", "success");
      setActiveSlot(null);
      router.refresh();
    } else {
      showToast("Image update failed", result.error, "error");
    }
  };

  return (
    <form action={actionHandler} className="flex flex-col h-full min-h-0">
      {/* Page header */}
      <div className="flex items-center justify-between px-8 py-5 border-b border-white/30 bg-white/20 backdrop-blur-sm shrink-0">
        <div>
          <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-widest mb-0.5">Homepage</p>
          <h1 className="text-xl font-bold text-neutral-900">Introducing Alley</h1>
        </div>
        <SubmitButton />
      </div>

      {/* Body: two columns */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="grid grid-cols-3 divide-x divide-white/30">

          {/* Main fields — 2/3 width */}
          <div className="col-span-2 p-8 pb-12 space-y-6">
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className={LABEL}>Badge Text</label>
                <input name="badge_text" defaultValue={data.badge_text} className={INPUT} required />
              </div>
              <div>
                <label className={LABEL}>Title</label>
                <input name="title" defaultValue={data.title} className={INPUT} required />
              </div>
              <div>
                <label className={LABEL}>CTA Label</label>
                <input name="cta_label" defaultValue={data.cta_label} className={INPUT} required />
              </div>
              <div>
                <label className={LABEL}>CTA Href</label>
                <input name="cta_href" defaultValue={data.cta_href} className={INPUT} required />
              </div>
            </div>
            <div>
              <label className={LABEL}>Body Text</label>
              <textarea name="body_text" defaultValue={data.body_text} rows={7} className={`${INPUT} resize-none`} required />
            </div>
          </div>

          {/* Media sidebar — 1/3 width */}
          <div className="col-span-1 p-6 pb-12 space-y-5">
            <p className={LABEL}>Media Assets</p>
            {(["left", "right"] as const).map((slot) => {
              const imageObj: AdminImagePreview | null = data[`${slot}_image`];
              return (
                <div key={slot}>
                  <p className="text-xs text-neutral-600 mb-2 font-semibold">{slot.toUpperCase()} IMAGE</p>
                  <button
                    type="button"
                    onClick={() => setActiveSlot(slot)}
                    className="w-full aspect-[4/3] rounded-2xl border-2 border-dashed border-neutral-300 bg-white/40 relative overflow-hidden group hover:border-neutral-500 transition-colors"
                  >
                    {imageObj ? (
                      <>
                        <img src={imageObj.url} alt="" className="absolute inset-0 w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-white text-xs font-semibold">Change</span>
                        </div>
                      </>
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-neutral-400">
                        <ImageIcon className="w-7 h-7" />
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

      <MediaPickerModal isOpen={!!activeSlot} onClose={() => setActiveSlot(null)} onSelect={handleMediaSelect} />
    </form>
  );
}
