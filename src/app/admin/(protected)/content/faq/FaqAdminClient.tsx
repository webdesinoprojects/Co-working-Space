"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  updateFaqSectionAction,
  upsertFaqCategoryAction,
  deleteFaqCategoryAction,
  upsertFaqItemAction,
  deleteFaqItemAction,
  reorderFaqItemsAction,
} from "@/features/admin/faq/actions";
import type { AdminFaqSectionVM, AdminFaqCategoryVM, AdminFaqItemVM } from "@/features/admin/types";
import { SortableList } from "@/components/admin/SortableList";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { ItemDialog } from "@/components/admin/ItemDialog";
import { useToast } from "@/components/admin/Toast";
import { Plus, Pencil, Trash2 } from "lucide-react";

const INPUT =
  "w-full bg-white/70 border border-neutral-300 rounded-xl px-4 py-3 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 transition";
const LABEL = "block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2";
const SECTION = "bg-white/40 backdrop-blur-xl border border-white/60 rounded-2xl p-6 shadow-sm";

// ─── Section Header Form ─────────────────────────────────────────────────────

function SectionHeaderForm({ data }: { data: AdminFaqSectionVM }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await updateFaqSectionAction({
        badge_text: (fd.get("badge_text") as string).trim(),
        title: (fd.get("title") as string).trim(),
        highlighted_word: (fd.get("highlighted_word") as string).trim(),
        body_text: (fd.get("body_text") as string).trim(),
      });
      if (result.success) {
        showToast("Saved", "Section header updated.", "success");
        router.refresh();
      } else {
        showToast("Save failed", result.error, "error");
      }
    });
  };

  return (
    <div className={SECTION}>
      <h2 className="text-base font-semibold text-neutral-900 mb-5">Section Header</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={LABEL}>Badge Text</label>
            <input name="badge_text" defaultValue={data.badge_text} required className={INPUT} />
          </div>
          <div>
            <label className={LABEL}>Highlighted Word</label>
            <input
              name="highlighted_word"
              defaultValue={data.highlighted_word}
              required
              className={INPUT}
              placeholder="e.g. Questions"
            />
          </div>
        </div>
        <div>
          <label className={LABEL}>Title</label>
          <input name="title" defaultValue={data.title} required className={INPUT} />
        </div>
        <div>
          <label className={LABEL}>Body Text</label>
          <textarea
            name="body_text"
            defaultValue={data.body_text}
            required
            rows={3}
            className={`${INPUT} resize-y`}
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isPending}
            className="bg-neutral-900 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-neutral-800 disabled:opacity-50"
          >
            {isPending ? "Saving..." : "Save Header"}
          </button>
        </div>
      </form>
    </div>
  );
}

// ─── Category Dialog ──────────────────────────────────────────────────────────

function CategoryDialog({
  isOpen,
  initial,
  onClose,
}: {
  isOpen: boolean;
  initial?: AdminFaqCategoryVM;
  onClose: () => void;
}) {
  const router = useRouter();
  const { showToast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setError(null);
    startTransition(async () => {
      const result = await upsertFaqCategoryAction({
        id: initial?.id,
        label: (fd.get("label") as string).trim(),
        slug: (fd.get("slug") as string).trim(),
        sort_order: initial?.sort_order ?? 0,
        is_active: true,
      });
      if (result.success) {
        showToast("Saved", initial ? "Category updated." : "Category added.", "success");
        router.refresh();
        onClose();
      } else {
        setError(result.error);
      }
    });
  };

  return (
    <ItemDialog
      isOpen={isOpen}
      title={initial ? "Edit Category" : "Add Category"}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={LABEL}>Label</label>
          <input name="label" defaultValue={initial?.label ?? ""} required className={INPUT} />
        </div>
        <div>
          <label className={LABEL}>Slug</label>
          <input
            name="slug"
            defaultValue={initial?.slug ?? ""}
            required
            placeholder="e.g. general"
            className={INPUT}
          />
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

// ─── Categories Panel ─────────────────────────────────────────────────────────

function CategoriesPanel({ categories }: { categories: AdminFaqCategoryVM[] }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [items, setItems] = useState(categories);
  const [addOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState<AdminFaqCategoryVM | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const sorted = [...items].sort((a, b) => a.sort_order - b.sort_order);

  const handleReorder = async (reordered: AdminFaqCategoryVM[]) => {
    const updates = reordered.map((c, i) => ({ id: c.id, sort_order: i * 10 }));
    setItems(reordered.map((c, i) => ({ ...c, sort_order: i * 10 })));
    const result = await reorderFaqItemsAction("faq_categories", updates);
    if (!result.success) showToast("Reorder failed", result.error, "error");
    else router.refresh();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const result = await deleteFaqCategoryAction(deleteId);
    setDeleteId(null);
    if (result.success) {
      setItems((prev) => prev.filter((c) => c.id !== deleteId));
      showToast("Deleted", "Category removed.", "success");
      router.refresh();
    } else {
      showToast("Error", result.error, "error");
    }
  };

  return (
    <div className={SECTION}>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-semibold text-neutral-900">Categories</h2>
        <button
          type="button"
          onClick={() => setAddOpen(true)}
          className="flex items-center gap-2 text-sm font-semibold bg-neutral-900 text-white px-4 py-2 rounded-xl hover:bg-neutral-800 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>

      {sorted.length === 0 ? (
        <p className="text-sm text-neutral-400">No categories yet.</p>
      ) : (
        <SortableList
          items={sorted}
          onReorder={handleReorder}
          renderItem={(cat, dragHandle) => (
            <div className="flex items-center gap-3 py-2.5 px-3 bg-white/60 rounded-xl border border-neutral-200">
              {dragHandle}
              <span className="flex-1 text-sm font-medium text-neutral-800">
                {cat.label}
                <span className="ml-2 text-xs text-neutral-400">/{cat.slug}</span>
              </span>
              <button
                type="button"
                onClick={() => setEditing(cat)}
                className="p-1.5 text-neutral-400 hover:text-neutral-700 transition-colors"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setDeleteId(cat.id)}
                className="p-1.5 text-red-400 hover:text-red-600 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        />
      )}

      <CategoryDialog isOpen={addOpen} onClose={() => setAddOpen(false)} />
      {editing && (
        <CategoryDialog isOpen={true} initial={editing} onClose={() => setEditing(null)} />
      )}
      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete Category"
        message="All FAQ items in this category will become uncategorised. Continue?"
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}

// ─── FAQ Item Dialog ──────────────────────────────────────────────────────────

function FaqItemDialog({
  isOpen,
  initial,
  categories,
  onClose,
}: {
  isOpen: boolean;
  initial?: AdminFaqItemVM;
  categories: AdminFaqCategoryVM[];
  onClose: () => void;
}) {
  const router = useRouter();
  const { showToast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setError(null);
    startTransition(async () => {
      const catId = (fd.get("category_id") as string) || null;
      const result = await upsertFaqItemAction({
        id: initial?.id,
        category_id: catId,
        question: (fd.get("question") as string).trim(),
        answer: (fd.get("answer") as string).trim(),
        sort_order: initial?.sort_order ?? 0,
        is_active: fd.get("is_active") === "on",
      });
      if (result.success) {
        showToast("Saved", initial ? "FAQ updated." : "FAQ added.", "success");
        router.refresh();
        onClose();
      } else {
        setError(result.error);
      }
    });
  };

  return (
    <ItemDialog
      isOpen={isOpen}
      title={initial ? "Edit FAQ" : "Add FAQ"}
      onClose={onClose}
      wide
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={LABEL}>Category</label>
          <select
            name="category_id"
            defaultValue={initial?.category_id ?? ""}
            className={INPUT}
          >
            <option value="">— No category —</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={LABEL}>Question</label>
          <input
            name="question"
            defaultValue={initial?.question ?? ""}
            required
            className={INPUT}
          />
        </div>
        <div>
          <label className={LABEL}>Answer</label>
          <textarea
            name="answer"
            defaultValue={initial?.answer ?? ""}
            required
            rows={5}
            className={`${INPUT} resize-y`}
          />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="is_active"
            defaultChecked={initial?.is_active ?? true}
            className="w-4 h-4"
          />
          Active (visible on public page)
        </label>
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

// ─── FAQ Items Panel ──────────────────────────────────────────────────────────

function FaqItemsPanel({
  items: initialItems,
  categories,
}: {
  items: AdminFaqItemVM[];
  categories: AdminFaqCategoryVM[];
}) {
  const router = useRouter();
  const { showToast } = useToast();
  const [items, setItems] = useState(initialItems);
  const [addOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState<AdminFaqItemVM | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const categoryMap = Object.fromEntries(categories.map((c) => [c.id, c.label]));
  const sorted = [...items].sort((a, b) => a.sort_order - b.sort_order);

  const handleReorder = async (reordered: AdminFaqItemVM[]) => {
    const updates = reordered.map((item, i) => ({ id: item.id, sort_order: i * 10 }));
    setItems(reordered.map((item, i) => ({ ...item, sort_order: i * 10 })));
    const result = await reorderFaqItemsAction("faq_items", updates);
    if (!result.success) showToast("Reorder failed", result.error, "error");
    else router.refresh();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const result = await deleteFaqItemAction(deleteId);
    setDeleteId(null);
    if (result.success) {
      setItems((prev) => prev.filter((i) => i.id !== deleteId));
      showToast("Deleted", "FAQ item removed.", "success");
      router.refresh();
    } else {
      showToast("Error", result.error, "error");
    }
  };

  return (
    <div className={SECTION}>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-semibold text-neutral-900">
          FAQ Items
          <span className="ml-2 text-sm text-neutral-400 font-normal">({items.length})</span>
        </h2>
        <button
          type="button"
          onClick={() => setAddOpen(true)}
          className="flex items-center gap-2 text-sm font-semibold bg-neutral-900 text-white px-4 py-2 rounded-xl hover:bg-neutral-800 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add FAQ
        </button>
      </div>

      {sorted.length === 0 ? (
        <p className="text-sm text-neutral-400">No FAQ items yet.</p>
      ) : (
        <SortableList
          items={sorted}
          onReorder={handleReorder}
          renderItem={(item, dragHandle) => (
            <div
              className={`flex items-start gap-3 py-3 px-3 rounded-xl border ${
                item.is_active
                  ? "bg-white/60 border-neutral-200"
                  : "bg-neutral-50/60 border-neutral-200 opacity-60"
              }`}
            >
              {dragHandle}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-neutral-800 truncate">{item.question}</p>
                <p className="text-xs text-neutral-500 mt-0.5 line-clamp-1">{item.answer}</p>
                {item.category_id && (
                  <span className="inline-block mt-1 text-[10px] bg-neutral-100 px-1.5 py-0.5 rounded text-neutral-500">
                    {categoryMap[item.category_id] ?? "Unknown category"}
                  </span>
                )}
                {!item.is_active && (
                  <span className="inline-block mt-1 ml-1 text-[10px] bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded">
                    Hidden
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setEditing(item)}
                className="p-1.5 text-neutral-400 hover:text-neutral-700 transition-colors shrink-0"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setDeleteId(item.id)}
                className="p-1.5 text-red-400 hover:text-red-600 transition-colors shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        />
      )}

      <FaqItemDialog
        isOpen={addOpen}
        categories={categories}
        onClose={() => setAddOpen(false)}
      />
      {editing && (
        <FaqItemDialog
          isOpen={true}
          initial={editing}
          categories={categories}
          onClose={() => setEditing(null)}
        />
      )}
      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete FAQ"
        message="This will permanently remove this FAQ item."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export default function FaqAdminClient({
  section,
  categories,
  items,
}: {
  section: AdminFaqSectionVM;
  categories: AdminFaqCategoryVM[];
  items: AdminFaqItemVM[];
}) {
  return (
    <div className="p-8 space-y-6 max-w-4xl">
      <h1 className="text-2xl font-semibold text-neutral-900">FAQ</h1>
      <SectionHeaderForm data={section} />
      <CategoriesPanel categories={categories} />
      <FaqItemsPanel items={items} categories={categories} />
    </div>
  );
}
