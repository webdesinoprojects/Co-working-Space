"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  updateLocationsHeaderAction,
  upsertLocationCardAction,
  deleteLocationCardAction,
  reorderItemsAction,
} from "@/features/admin/homepage/actions";
import type { AdminLocationsSectionVM, AdminLocationCardVM, MediaAssetVM } from "@/features/admin/types";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { SortableList } from "@/components/admin/SortableList";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { ItemDialog } from "@/components/admin/ItemDialog";
import { MediaPickerModal } from "@/components/admin/media/MediaPickerModal";
import { useToast } from "@/components/admin/Toast";
import { Plus, ImageIcon } from "lucide-react";

const INPUT = "w-full bg-white/70 border border-neutral-300 rounded-xl px-4 py-3 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 transition";
const LABEL = "block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2";

function LocationCardDialog({ isOpen, title, initial, sectionId, cardId, onClose }: {
  isOpen: boolean; title: string; initial?: Partial<AdminLocationCardVM>;
  sectionId: string; cardId?: string; onClose: () => void;
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
      const result = await upsertLocationCardAction({
        id: cardId, section_id: sectionId,
        layout_slot: parseInt(fd.get("layout_slot") as string, 10),
        location_name: (fd.get("location_name") as string).trim(),
        subtitle: ((fd.get("subtitle") as string).trim()) || null,
        image_asset_id: initial?.image_asset_id ?? null,
        hover_visit_label: (fd.get("hover_visit_label") as string).trim(),
        hover_visit_href: (fd.get("hover_visit_href") as string).trim(),
        hover_meeting_label: (fd.get("hover_meeting_label") as string).trim(),
        hover_meeting_href: (fd.get("hover_meeting_href") as string).trim(),
        hover_space_label: (fd.get("hover_space_label") as string).trim(),
        hover_space_href: (fd.get("hover_space_href") as string).trim(),
        sort_order: initial?.sort_order ?? 0,
        is_active: fd.get("is_active") === "on",
      });
      if (result.success) {
        showToast("Saved changes", "Location card updated.", "success");
        onClose();
        router.refresh();
      } else {
        setError(result.error);
      }
    });
  };

  return (
    <ItemDialog isOpen={isOpen} title={title} onClose={onClose} wide>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={LABEL}>Location Name</label>
            <input name="location_name" defaultValue={initial?.location_name ?? ""} required className={INPUT} />
          </div>
          <div>
            <label className={LABEL}>Subtitle <span className="text-neutral-400 normal-case font-normal">(optional)</span></label>
            <input name="subtitle" defaultValue={initial?.subtitle ?? ""} className={INPUT} />
          </div>
          <div>
            <label className={LABEL}>Layout Slot (1–7)</label>
            <input name="layout_slot" type="number" min={1} max={7} defaultValue={initial?.layout_slot ?? 1} required className={INPUT} />
          </div>
        </div>

        <div className="border-t border-white/30 pt-4">
          <p className={LABEL}>Hover CTAs</p>
          <div className="grid grid-cols-2 gap-3 mt-2">
            {([
              ["hover_visit_label", "Visit Label", "Request a Visit"],
              ["hover_visit_href", "Visit Href", "/connect"],
              ["hover_meeting_label", "Meeting Label", "Book Meeting Room"],
              ["hover_meeting_href", "Meeting Href", "/workspaces/meeting-rooms"],
              ["hover_space_label", "Space Label", "Book Your Space"],
              ["hover_space_href", "Space Href", "/workspaces"],
            ] as [keyof AdminLocationCardVM, string, string][]).map(([name, label, placeholder]) => (
              <div key={name}>
                <label className={LABEL}>{label}</label>
                <input name={name} defaultValue={(initial?.[name] as string) ?? placeholder} required className={INPUT} />
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" name="is_active" id="card_is_active" defaultChecked={initial?.is_active ?? true} className="w-4 h-4 rounded border-neutral-300" />
          <label htmlFor="card_is_active" className="text-sm font-medium text-neutral-700">Active (shown on homepage)</label>
        </div>
        {error && <p className="text-red-500 text-xs">{error}</p>}
        <div className="flex justify-end">
          <button type="submit" disabled={isPending} className="bg-neutral-900 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-neutral-800 disabled:opacity-50">
            {isPending ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </ItemDialog>
  );
}

export function LocationsForm({ data }: { data: AdminLocationsSectionVM }) {
  const [cards, setCards] = useState(data.cards);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingCard, setEditingCard] = useState<AdminLocationCardVM | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [imagePickFor, setImagePickFor] = useState<AdminLocationCardVM | null>(null);
  const router = useRouter();
  const { showToast } = useToast();

  useEffect(() => {
    setCards(data.cards);
  }, [data.cards]);

  const headerAction = async (formData: FormData) => {
    const result = await updateLocationsHeaderAction(Object.fromEntries(formData.entries()));
    if (result.success) {
      showToast("Saved changes", "Growing Network settings updated.", "success");
      router.refresh();
    } else {
      showToast("Save failed", result.error, "error");
    }
  };
  const handleReorder = async (reordered: AdminLocationCardVM[]) => {
    setCards(reordered.map((card, index) => ({ ...card, sort_order: index * 10 })));
    const result = await reorderItemsAction("home_location_cards", reordered.map((c, i) => ({ id: c.id, sort_order: i * 10 })));
    if (result.success) {
      showToast("Saved order", "Location cards reordered.", "success");
      router.refresh();
    } else {
      showToast("Reorder failed", result.error, "error");
    }
  };
  const handleDelete = async () => {
    if (!deleteId) return;
    const result = await deleteLocationCardAction(deleteId);
    setDeleteId(null);
    if (result.success) {
      setCards((current) => current.filter((card) => card.id !== deleteId));
      showToast("Deleted", "Location card removed.", "success");
      router.refresh();
    } else {
      showToast("Delete failed", result.error, "error");
    }
  };
  const handleImageSelect = async (asset: MediaAssetVM) => {
    if (!imagePickFor) return;
    const cardId = imagePickFor.id;
    // Optimistically update the thumbnail before the server round-trip
    setImagePickFor(null);
    setCards((current) =>
      current.map((card) =>
        card.id === cardId
          ? {
              ...card,
              image_asset_id: asset.id,
              image: {
                asset_id: asset.id,
                url: asset.file_url,
                alt: asset.alt_text,
                width: asset.width,
                height: asset.height,
              },
            }
          : card
      )
    );
    const result = await upsertLocationCardAction({ ...imagePickFor, image_asset_id: asset.id });
    if (result.success) {
      showToast("Image updated", "Location card image saved.", "success");
    } else {
      // Revert optimistic update on failure
      setCards((current) =>
        current.map((card) =>
          card.id === cardId
            ? { ...card, image_asset_id: imagePickFor.image_asset_id, image: imagePickFor.image }
            : card
        )
      );
      showToast("Image update failed", result.error, "error");
    }
  };

  const sorted = [...cards].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Page header */}
      <div className="flex items-center justify-between px-8 py-5 border-b border-white/30 bg-white/20 backdrop-blur-sm shrink-0">
        <div>
          <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-widest mb-0.5">Homepage</p>
          <h1 className="text-xl font-bold text-neutral-900">Growing Network</h1>
        </div>
        <button type="button" onClick={() => setAddOpen(true)}
          className="flex items-center gap-2 bg-neutral-900 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-neutral-800 transition-colors">
          <Plus className="w-4 h-4" /> Add Card
        </button>
      </div>

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
            <div>
              <label className={LABEL}>View All Label</label>
              <input name="view_all_label" defaultValue={data.view_all_label} required className={INPUT} />
            </div>
            <div>
              <label className={LABEL}>View All Href</label>
              <input name="view_all_href" defaultValue={data.view_all_href} required className={INPUT} />
            </div>
          </div>
          <div className="flex justify-end mt-4"><SubmitButton /></div>
        </form>

        {/* Cards list */}
        <div className="px-8 py-6">
          <p className={`mb-4 ${LABEL}`}>Location Cards ({cards.length})</p>
          <div className="space-y-3">
            <SortableList
              items={sorted}
              onReorder={handleReorder}
              renderItem={(card, dragHandle) => (
                <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-2xl p-5 flex items-center gap-4">
                  {dragHandle}
                  <button type="button" onClick={() => setImagePickFor(card)} title="Click to change image"
                    className="w-14 h-14 bg-white/60 rounded-xl border border-neutral-200 overflow-hidden shrink-0 hover:opacity-80 transition-opacity flex items-center justify-center">
                    {card.image ? <img src={card.image.url} alt={card.image.alt ?? card.location_name} className="w-full h-full object-cover" /> : <ImageIcon className="w-5 h-5 text-neutral-300" />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-neutral-900">{card.location_name}</p>
                    <p className="text-xs text-neutral-500 mt-0.5">{card.subtitle || "No subtitle"} &mdash; Slot {card.layout_slot}</p>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold shrink-0 ${card.is_active ? "bg-green-100 text-green-700" : "bg-neutral-100 text-neutral-500"}`}>
                    {card.is_active ? "Active" : "Off"}
                  </span>
                  <div className="flex gap-1 shrink-0">
                    <button type="button" onClick={() => setEditingCard(card)} className="text-xs font-semibold text-blue-600 hover:text-blue-800 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors">Edit</button>
                    <button type="button" onClick={() => setDeleteId(card.id)} className="text-xs font-semibold text-red-500 hover:text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors">Delete</button>
                  </div>
                </div>
              )}
            />
            {sorted.length === 0 && (
              <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-2xl py-12 text-center text-neutral-400 text-sm">
                No location cards yet. Click &quot;Add Card&quot; to create one.
              </div>
            )}
          </div>
        </div>
      </div>

      <LocationCardDialog isOpen={addOpen} title="Add Location Card" initial={{ layout_slot: Math.min(sorted.length + 1, 7), sort_order: sorted.length * 10 }} sectionId={data.id} onClose={() => setAddOpen(false)} />
      {editingCard && <LocationCardDialog isOpen title="Edit Location Card" initial={editingCard} sectionId={data.id} cardId={editingCard.id} onClose={() => setEditingCard(null)} />}
      <ConfirmDialog isOpen={!!deleteId} title="Delete Location Card" message="Remove this location card from the homepage?" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
      <MediaPickerModal isOpen={!!imagePickFor} onClose={() => setImagePickFor(null)} onSelect={handleImageSelect} />
    </div>
  );
}
