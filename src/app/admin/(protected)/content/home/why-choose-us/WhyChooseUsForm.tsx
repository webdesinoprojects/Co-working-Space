"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  deleteWhyChooseUsCardAction,
  reorderItemsAction,
  updateWhyChooseUsHeaderAction,
  upsertWhyChooseUsCardAction,
} from "@/features/admin/homepage/actions";
import type { AdminWhyChooseUsCardVM, AdminWhyChooseUsSectionVM } from "@/features/admin/types";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { ItemDialog } from "@/components/admin/ItemDialog";
import { SortableList } from "@/components/admin/SortableList";
import { useToast } from "@/components/admin/Toast";
import { Plus } from "lucide-react";

const INPUT =
  "w-full bg-white/70 border border-neutral-300 rounded-xl px-4 py-3 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 transition";
const LABEL = "block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2";

const ANIMATION_OPTIONS = [
  { value: "rolling-track", label: "Rolling Track" },
  { value: "isometric-cube", label: "Isometric Cube" },
  { value: "rising-graph", label: "Rising Graph" },
  { value: "ripple", label: "Ripple" },
];

function CardDialog({
  isOpen,
  title,
  sectionId,
  initial,
  onClose,
}: {
  isOpen: boolean;
  title: string;
  sectionId: string;
  initial?: Partial<AdminWhyChooseUsCardVM>;
  onClose: () => void;
}) {
  const router = useRouter();
  const { showToast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const result = await upsertWhyChooseUsCardAction({
        id: initial?.id,
        section_id: sectionId,
        title: (formData.get("title") as string).trim(),
        description: (formData.get("description") as string).trim(),
        animation_key: formData.get("animation_key") as string,
        theme: formData.get("theme") as "light" | "dark",
        sort_order: initial?.sort_order ?? 0,
        is_active: formData.get("is_active") === "on",
      });

      if (result.success) {
        showToast("Saved changes", "Why Choose Us card updated.");
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
        <div>
          <label className={LABEL}>Title</label>
          <input name="title" defaultValue={initial?.title ?? ""} required className={INPUT} />
        </div>
        <div>
          <label className={LABEL}>Description</label>
          <textarea
            name="description"
            defaultValue={initial?.description ?? ""}
            rows={5}
            required
            className={`${INPUT} resize-none`}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={LABEL}>Animation</label>
            <select name="animation_key" defaultValue={initial?.animation_key ?? "rolling-track"} className={INPUT}>
              {ANIMATION_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={LABEL}>Theme</label>
            <select name="theme" defaultValue={initial?.theme ?? "light"} className={INPUT}>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm font-medium text-neutral-700">
          <input
            type="checkbox"
            name="is_active"
            defaultChecked={initial?.is_active ?? true}
            className="h-4 w-4 rounded border-neutral-300"
          />
          Active on frontend
        </label>
        {error && <p className="text-xs text-red-600">{error}</p>}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isPending}
            className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-800 disabled:opacity-50"
          >
            {isPending ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </ItemDialog>
  );
}

export function WhyChooseUsForm({ data }: { data: AdminWhyChooseUsSectionVM }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [cards, setCards] = useState(data.cards);
  const [editingCard, setEditingCard] = useState<AdminWhyChooseUsCardVM | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [isSavingHeader, startHeader] = useTransition();

  const sorted = [...cards].sort((a, b) => a.sort_order - b.sort_order);

  const handleHeaderSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    startHeader(async () => {
      const result = await updateWhyChooseUsHeaderAction({
        badge_text: (formData.get("badge_text") as string).trim(),
        title: (formData.get("title") as string).trim(),
        body_text: (formData.get("body_text") as string).trim(),
      });

      if (result.success) {
        showToast("Saved changes", "Why Choose Us section updated.");
        router.refresh();
      } else {
        showToast("Save failed", result.error, "error");
      }
    });
  };

  const handleReorder = async (reordered: AdminWhyChooseUsCardVM[]) => {
    setCards(reordered.map((item, index) => ({ ...item, sort_order: index * 10 })));
    const result = await reorderItemsAction(
      "home_why_choose_us_cards",
      reordered.map((item, index) => ({ id: item.id, sort_order: index * 10 }))
    );

    if (result.success) {
      showToast("Saved order", "Why Choose Us cards reordered.");
      router.refresh();
    } else {
      showToast("Reorder failed", result.error, "error");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const result = await deleteWhyChooseUsCardAction(deleteId);
    if (result.success) {
      setCards((current) => current.filter((card) => card.id !== deleteId));
      setDeleteId(null);
      showToast("Deleted", "Why Choose Us card removed.");
      router.refresh();
    } else {
      showToast("Delete failed", result.error, "error");
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex shrink-0 items-center justify-between border-b border-white/30 bg-white/20 px-8 py-5 backdrop-blur-sm">
        <div>
          <p className="mb-0.5 text-[11px] font-semibold uppercase tracking-widest text-neutral-400">Homepage</p>
          <h1 className="text-xl font-bold text-neutral-900">Why Choose Us</h1>
        </div>
        <button
          type="button"
          onClick={() => setAddOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-neutral-800"
        >
          <Plus className="h-4 w-4" />
          Add Card
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-8 py-6">
        <form onSubmit={handleHeaderSave} className="mb-8 grid grid-cols-2 gap-5">
          <div>
            <label className={LABEL}>Badge Text</label>
            <input name="badge_text" defaultValue={data.badge_text} required className={INPUT} />
          </div>
          <div>
            <label className={LABEL}>Title</label>
            <input name="title" defaultValue={data.title} required className={INPUT} />
          </div>
          <div className="col-span-2">
            <label className={LABEL}>Body Text</label>
            <textarea name="body_text" defaultValue={data.body_text} required rows={4} className={`${INPUT} resize-none`} />
          </div>
          <div className="col-span-2 flex justify-end">
            <button
              type="submit"
              disabled={isSavingHeader}
              className="rounded-xl bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800 disabled:opacity-50"
            >
              {isSavingHeader ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>

        <p className={`mb-4 ${LABEL}`}>Cards ({cards.length})</p>
        <div className="overflow-hidden rounded-2xl border border-white/60 bg-white/40 backdrop-blur-xl">
          <SortableList
            items={sorted}
            onReorder={handleReorder}
            renderItem={(card, dragHandle) => (
              <div className="flex items-center gap-3 border-b border-white/30 px-5 py-4 last:border-0">
                {dragHandle}
                <span className="w-32 shrink-0 rounded-lg border border-neutral-200 bg-white/60 px-2 py-1 text-center font-mono text-xs">
                  {card.animation_key}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-neutral-900">{card.title}</p>
                  <p className="truncate text-xs text-neutral-500">{card.description}</p>
                </div>
                <span className="w-16 text-xs font-semibold capitalize text-neutral-500">{card.theme}</span>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${card.is_active ? "bg-green-100 text-green-700" : "bg-neutral-100 text-neutral-500"}`}>
                  {card.is_active ? "Active" : "Off"}
                </span>
                <button type="button" onClick={() => setEditingCard(card)} className="rounded-lg px-3 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-50">
                  Edit
                </button>
                <button type="button" onClick={() => setDeleteId(card.id)} className="rounded-lg px-3 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-50">
                  Delete
                </button>
              </div>
            )}
          />
          {sorted.length === 0 && (
            <div className="px-5 py-12 text-center text-sm text-neutral-400">
              No cards yet. Click &quot;Add Card&quot; to create one.
            </div>
          )}
        </div>
      </div>

      <CardDialog
        isOpen={addOpen}
        title="Add Why Choose Us Card"
        sectionId={data.id}
        initial={{ sort_order: sorted.length * 10 }}
        onClose={() => setAddOpen(false)}
      />
      {editingCard && (
        <CardDialog
          isOpen
          title="Edit Why Choose Us Card"
          sectionId={data.id}
          initial={editingCard}
          onClose={() => setEditingCard(null)}
        />
      )}
      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete Card"
        message="Remove this Why Choose Us card?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
