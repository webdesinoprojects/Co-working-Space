"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  upsertAboutPillarCardAction,
  deleteAboutPillarCardAction,
  reorderAboutItemsAction,
} from "@/features/admin/about/actions";
import type { AdminAboutPillarsSectionVM, AdminAboutPillarCardVM } from "@/features/admin/types";
import { SortableList } from "@/components/admin/SortableList";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { ItemDialog } from "@/components/admin/ItemDialog";
import { useToast } from "@/components/admin/Toast";
import { Plus, Building2 } from "lucide-react";

const INPUT =
  "w-full bg-white/70 border border-neutral-300 rounded-xl px-4 py-3 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 transition";
const LABEL =
  "block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2";

function PillarDialog({
  isOpen,
  title,
  initial,
  sectionId,
  cardId,
  onClose,
}: {
  isOpen: boolean;
  title: string;
  initial?: Partial<AdminAboutPillarCardVM>;
  sectionId: string;
  cardId?: string;
  onClose: () => void;
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
      const result = await upsertAboutPillarCardAction({
        id: cardId,
        section_id: sectionId,
        sort_order: initial?.sort_order ?? 0,
        icon_key: (fd.get("icon_key") as string).trim(),
        label: (fd.get("label") as string).trim(),
        stat: (fd.get("stat") as string).trim(),
        description: (fd.get("description") as string).trim(),
        is_active: fd.get("is_active") === "on",
      });
      if (result.success) {
        showToast("Saved", "Pillar card updated.", "success");
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
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={LABEL}>Icon Key</label>
            <input
              name="icon_key"
              defaultValue={initial?.icon_key ?? "building-2"}
              required
              className={INPUT}
              placeholder="building-2"
            />
            <p className="text-[11px] text-neutral-400 mt-1">
              building-2, zap, shield-check
            </p>
          </div>
          <div>
            <label className={LABEL}>Label</label>
            <input
              name="label"
              defaultValue={initial?.label ?? ""}
              required
              className={INPUT}
              placeholder="Location"
            />
          </div>
          <div>
            <label className={LABEL}>Stat</label>
            <input
              name="stat"
              defaultValue={initial?.stat ?? ""}
              required
              className={INPUT}
              placeholder="Noida & Delhi"
            />
          </div>
          <div>
            <label className={LABEL}>Description</label>
            <input
              name="description"
              defaultValue={initial?.description ?? ""}
              required
              className={INPUT}
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="is_active"
            id="pillar_active"
            defaultChecked={initial?.is_active ?? true}
            className="w-4 h-4 rounded border-neutral-300"
          />
          <label htmlFor="pillar_active" className="text-sm font-medium text-neutral-700">
            Active (shown on about page)
          </label>
        </div>
        {error && <p className="text-red-500 text-xs">{error}</p>}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isPending}
            className="bg-neutral-900 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-neutral-800 disabled:opacity-50"
          >
            {isPending ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </ItemDialog>
  );
}

export function ValuesForm({ data }: { data: AdminAboutPillarsSectionVM }) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<AdminAboutPillarCardVM | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  const sorted = [...data.cards].sort((a, b) => a.sort_order - b.sort_order);

  const handleReorder = async (reordered: AdminAboutPillarCardVM[]) => {
    const result = await reorderAboutItemsAction(
      "about_pillar_cards",
      reordered.map((c, i) => ({ id: c.id, sort_order: i * 10 }))
    );
    if (result.success) {
      showToast("Reordered", "Pillar order saved.", "success");
      router.refresh();
    } else {
      showToast("Reorder failed", result.error, "error");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const result = await deleteAboutPillarCardAction(deleteId);
    setDeleteId(null);
    if (result.success) {
      showToast("Deleted", "Pillar card removed.", "success");
      router.refresh();
    } else {
      showToast("Delete failed", result.error, "error");
    }
  };

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-5 border-b border-white/30 bg-white/20 backdrop-blur-sm shrink-0">
        <div>
          <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-widest mb-0.5">
            About
          </p>
          <h1 className="text-xl font-bold text-neutral-900">Three Pillars (Values)</h1>
        </div>
        <button
          type="button"
          onClick={() => setAddOpen(true)}
          className="flex items-center gap-2 bg-neutral-900 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-neutral-800 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Card
        </button>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 px-8 py-6">
        <p className={`mb-4 ${LABEL}`}>Cards ({data.cards.length})</p>
        <div className="space-y-3">
          <SortableList
            items={sorted}
            onReorder={handleReorder}
            renderItem={(card, dragHandle) => (
              <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-2xl p-5 flex items-start gap-4">
                {dragHandle}
                <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5 text-[#F26522]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-neutral-900">
                    {card.label}
                    <span className="text-neutral-500 font-normal ml-2">- {card.stat}</span>
                  </p>
                  <p className="text-xs text-neutral-500 mt-1 line-clamp-2">
                    {card.description}
                  </p>
                  <p className="text-[11px] text-neutral-400 mt-0.5">icon: {card.icon_key}</p>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-semibold shrink-0 ${
                    card.is_active
                      ? "bg-green-100 text-green-700"
                      : "bg-neutral-100 text-neutral-500"
                  }`}
                >
                  {card.is_active ? "Active" : "Off"}
                </span>
                <div className="flex flex-col gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => setEditing(card)}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteId(card.id)}
                    className="text-xs font-semibold text-red-500 hover:text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          />
          {sorted.length === 0 && (
            <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-2xl py-12 text-center text-neutral-400 text-sm">
              No pillar cards yet. Click &quot;Add Card&quot; to create one.
            </div>
          )}
        </div>
      </div>

      <PillarDialog
        isOpen={addOpen}
        title="Add Pillar Card"
        initial={{ sort_order: sorted.length * 10 }}
        sectionId={data.id}
        onClose={() => setAddOpen(false)}
      />
      {editing && (
        <PillarDialog
          isOpen
          title="Edit Pillar Card"
          initial={editing}
          sectionId={data.id}
          cardId={editing.id}
          onClose={() => setEditing(null)}
        />
      )}
      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete Pillar Card"
        message="Remove this pillar card from the about page?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
