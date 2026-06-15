"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  updateAmenitiesHeaderAction,
  upsertAmenityAction,
  deleteAmenityAction,
  reorderItemsAction,
} from "@/features/admin/homepage/actions";
import type { AdminAmenitiesSectionVM, AdminAmenityVM } from "@/features/admin/types";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { SortableList } from "@/components/admin/SortableList";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { ItemDialog } from "@/components/admin/ItemDialog";
import { useToast } from "@/components/admin/Toast";
import { Plus } from "lucide-react";

const INPUT = "w-full bg-white/70 border border-neutral-300 rounded-xl px-4 py-3 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 transition";
const LABEL = "block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2";

function AmenityDialog({ isOpen, title, initial, sectionId, amenityId, onClose }: {
  isOpen: boolean; title: string; initial?: Partial<AdminAmenityVM>;
  sectionId: string; amenityId?: string; onClose: () => void;
}) {
  const router = useRouter();
  const { showToast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await upsertAmenityAction({
        id: amenityId,
        section_id: sectionId,
        icon_key: (fd.get("icon_key") as string).trim(),
        label: (fd.get("label") as string).trim(),
        sort_order: initial?.sort_order ?? 0,
        is_active: fd.get("is_active") === "on",
      });
      if (result.success) {
        showToast("Saved changes", "Amenity updated.", "success");
        onClose();
        router.refresh();
      } else {
        setError(result.error);
      }
    });
  };

  return (
    <ItemDialog isOpen={isOpen} title={title} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={LABEL}>Label</label>
          <input name="label" defaultValue={initial?.label ?? ""} required className={INPUT} placeholder="e.g. High-Speed WiFi" />
        </div>
        <div>
          <label className={LABEL}>Icon Key</label>
          <input name="icon_key" defaultValue={initial?.icon_key ?? ""} required className={`${INPUT} font-mono`} placeholder="e.g. wifi, coffee, key, printer" />
          <p className="text-xs text-neutral-400 mt-1">Lucide icon name in lowercase</p>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" name="is_active" id="amenity_active" defaultChecked={initial?.is_active ?? true} className="w-4 h-4 rounded border-neutral-300" />
          <label htmlFor="amenity_active" className="text-sm font-medium text-neutral-700">Active (shown on homepage)</label>
        </div>
        {error && <p className="text-red-500 text-xs">{error}</p>}
        <div className="flex justify-end">
          <button type="submit" disabled={isPending} className="bg-neutral-900 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-neutral-800 disabled:opacity-50 transition-colors">
            {isPending ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </ItemDialog>
  );
}

export function AmenitiesForm({ data }: { data: AdminAmenitiesSectionVM }) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingAmenity, setEditingAmenity] = useState<AdminAmenityVM | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  const headerAction = async (formData: FormData) => {
    const result = await updateAmenitiesHeaderAction(Object.fromEntries(formData.entries()));
    if (result.success) {
      showToast("Saved changes", "Amenities settings updated.", "success");
      router.refresh();
    } else {
      showToast("Save failed", result.error, "error");
    }
  };

  const handleReorder = async (reordered: AdminAmenityVM[]) => {
    const result = await reorderItemsAction("home_amenities", reordered.map((a, i) => ({ id: a.id, sort_order: i * 10 })));
    if (result.success) {
      showToast("Saved order", "Amenities reordered.", "success");
      router.refresh();
    } else {
      showToast("Reorder failed", result.error, "error");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const result = await deleteAmenityAction(deleteId);
    setDeleteId(null);
    if (result.success) {
      showToast("Deleted", "Amenity removed.", "success");
      router.refresh();
    } else {
      showToast("Delete failed", result.error, "error");
    }
  };

  const sorted = [...data.amenities].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Page header */}
      <div className="flex items-center justify-between px-8 py-5 border-b border-white/30 bg-white/20 backdrop-blur-sm shrink-0">
        <div>
          <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-widest mb-0.5">Homepage</p>
          <h1 className="text-xl font-bold text-neutral-900">Amenities</h1>
        </div>
        <button type="button" onClick={() => setAddOpen(true)}
          className="flex items-center gap-2 bg-neutral-900 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-neutral-800 transition-colors">
          <Plus className="w-4 h-4" /> Add Amenity
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {/* Section settings */}
        <form action={headerAction} className="px-8 py-6 border-b border-white/20">
          <p className={LABEL}>Section Settings</p>
          <div className="grid grid-cols-2 gap-5 mt-3">
            <div>
              <label className={LABEL}>Badge Text</label>
              <input name="badge_text" defaultValue={data.badge_text} required className={INPUT} />
            </div>
            <div>
              <label className={LABEL}>Title</label>
              <input name="title" defaultValue={data.title} required className={INPUT} />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <SubmitButton />
          </div>
        </form>

        {/* List */}
        <div className="px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <p className={LABEL}>Amenities ({data.amenities.length})</p>
          </div>
          <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-2xl overflow-hidden">
            <SortableList
              items={sorted}
              onReorder={handleReorder}
              renderItem={(amenity, dragHandle) => (
                <div className="flex items-center gap-4 px-5 py-4 border-b border-white/30 last:border-0 hover:bg-white/20 transition-colors">
                  {dragHandle}
                  <span className="font-mono text-xs bg-white/60 px-2 py-1 rounded-lg w-28 text-center shrink-0 truncate border border-neutral-200">
                    {amenity.icon_key}
                  </span>
                  <span className="font-medium text-sm text-neutral-900 flex-1">{amenity.label}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold shrink-0 ${amenity.is_active ? "bg-green-100 text-green-700" : "bg-neutral-100 text-neutral-500"}`}>
                    {amenity.is_active ? "Active" : "Off"}
                  </span>
                  <button type="button" onClick={() => setEditingAmenity(amenity)} className="text-xs font-semibold text-blue-600 hover:text-blue-800 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors">Edit</button>
                  <button type="button" onClick={() => setDeleteId(amenity.id)} className="text-xs font-semibold text-red-500 hover:text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors">Delete</button>
                </div>
              )}
            />
            {sorted.length === 0 && (
              <div className="px-5 py-12 text-center text-neutral-400 text-sm">No amenities yet. Click &quot;Add Amenity&quot; to create one.</div>
            )}
          </div>
        </div>
      </div>

      <AmenityDialog isOpen={addOpen} title="Add Amenity" initial={{ sort_order: sorted.length * 10 }} sectionId={data.id} onClose={() => setAddOpen(false)} />
      {editingAmenity && <AmenityDialog isOpen title="Edit Amenity" initial={editingAmenity} sectionId={data.id} amenityId={editingAmenity.id} onClose={() => setEditingAmenity(null)} />}
      <ConfirmDialog isOpen={!!deleteId} title="Delete Amenity" message="This amenity will be removed from the homepage. Continue?" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </div>
  );
}
