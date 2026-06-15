"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  updateTestimonialsHeaderAction, upsertTestimonialAction,
  deleteTestimonialAction, reorderItemsAction,
} from "@/features/admin/homepage/actions";
import type { AdminTestimonialsSectionVM, AdminTestimonialVM, MediaAssetVM } from "@/features/admin/types";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { SortableList } from "@/components/admin/SortableList";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { ItemDialog } from "@/components/admin/ItemDialog";
import { MediaPickerModal } from "@/components/admin/media/MediaPickerModal";
import { useToast } from "@/components/admin/Toast";
import { Plus, UserCircle } from "lucide-react";

const INPUT = "w-full bg-white/70 border border-neutral-300 rounded-xl px-4 py-3 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 transition";
const LABEL = "block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2";

function TestimonialDialog({ isOpen, title, initial, sectionId, testimonialId, onClose }: {
  isOpen: boolean; title: string; initial?: Partial<AdminTestimonialVM>;
  sectionId: string; testimonialId?: string; onClose: () => void;
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
      const result = await upsertTestimonialAction({
        id: testimonialId, section_id: sectionId,
        quote: (fd.get("quote") as string).trim(),
        person_name: (fd.get("person_name") as string).trim(),
        person_role: ((fd.get("person_role") as string).trim()) || null,
        company_name: ((fd.get("company_name") as string).trim()) || null,
        avatar_asset_id: initial?.avatar_asset_id ?? null,
        sort_order: initial?.sort_order ?? 0,
        is_active: fd.get("is_active") === "on",
      });
      if (result.success) {
        showToast("Saved changes", "Testimonial updated.", "success");
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
          <label className={LABEL}>Quote</label>
          <textarea name="quote" defaultValue={initial?.quote ?? ""} required rows={4} className={`${INPUT} resize-y`} placeholder="What the person said..." />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={LABEL}>Name</label>
            <input name="person_name" defaultValue={initial?.person_name ?? ""} required className={INPUT} />
          </div>
          <div>
            <label className={LABEL}>Role <span className="text-neutral-400 normal-case font-normal">(optional)</span></label>
            <input name="person_role" defaultValue={initial?.person_role ?? ""} className={INPUT} />
          </div>
          <div>
            <label className={LABEL}>Company <span className="text-neutral-400 normal-case font-normal">(optional)</span></label>
            <input name="company_name" defaultValue={initial?.company_name ?? ""} className={INPUT} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" name="is_active" id="test_active" defaultChecked={initial?.is_active ?? true} className="w-4 h-4 rounded border-neutral-300" />
          <label htmlFor="test_active" className="text-sm font-medium text-neutral-700">Active (shown on homepage)</label>
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

export function TestimonialsForm({ data }: { data: AdminTestimonialsSectionVM }) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingTestimonial, setEditingTestimonial] = useState<AdminTestimonialVM | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [avatarPickFor, setAvatarPickFor] = useState<AdminTestimonialVM | null>(null);
  const router = useRouter();
  const { showToast } = useToast();

  const headerAction = async (formData: FormData) => {
    const result = await updateTestimonialsHeaderAction(Object.fromEntries(formData.entries()));
    if (result.success) {
      showToast("Saved changes", "Testimonials settings updated.", "success");
      router.refresh();
    } else {
      showToast("Save failed", result.error, "error");
    }
  };
  const handleReorder = async (reordered: AdminTestimonialVM[]) => {
    const result = await reorderItemsAction("home_testimonials", reordered.map((t, i) => ({ id: t.id, sort_order: i * 10 })));
    if (result.success) {
      showToast("Saved order", "Testimonials reordered.", "success");
      router.refresh();
    } else {
      showToast("Reorder failed", result.error, "error");
    }
  };
  const handleDelete = async () => {
    if (!deleteId) return;
    const result = await deleteTestimonialAction(deleteId);
    setDeleteId(null);
    if (result.success) {
      showToast("Deleted", "Testimonial removed.", "success");
      router.refresh();
    } else {
      showToast("Delete failed", result.error, "error");
    }
  };
  const handleAvatarSelect = async (asset: MediaAssetVM) => {
    if (!avatarPickFor) return;
    const result = await upsertTestimonialAction({ ...avatarPickFor, avatar_asset_id: asset.id });
    setAvatarPickFor(null);
    if (result.success) {
      showToast("Image updated", "Testimonial avatar saved.", "success");
      router.refresh();
    } else {
      showToast("Image update failed", result.error, "error");
    }
  };

  const sorted = [...data.testimonials].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Page header */}
      <div className="flex items-center justify-between px-8 py-5 border-b border-white/30 bg-white/20 backdrop-blur-sm shrink-0">
        <div>
          <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-widest mb-0.5">Homepage</p>
          <h1 className="text-xl font-bold text-neutral-900">Testimonials</h1>
        </div>
        <button type="button" onClick={() => setAddOpen(true)}
          className="flex items-center gap-2 bg-neutral-900 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-neutral-800 transition-colors">
          <Plus className="w-4 h-4" /> Add Testimonial
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
          </div>
          <div className="flex justify-end mt-4"><SubmitButton /></div>
        </form>

        {/* List */}
        <div className="px-8 py-6">
          <p className={`mb-4 ${LABEL}`}>Testimonials ({data.testimonials.length})</p>
          <div className="space-y-3">
            <SortableList
              items={sorted}
              onReorder={handleReorder}
              renderItem={(t, dragHandle) => (
                <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-2xl p-5 flex items-start gap-4">
                  {dragHandle}
                  <button type="button" onClick={() => setAvatarPickFor(t)} title="Click to change avatar"
                    className="w-14 h-14 bg-white/60 rounded-xl border border-neutral-200 overflow-hidden shrink-0 hover:opacity-80 transition-opacity flex items-center justify-center">
                    {t.avatar ? <img src={t.avatar.url} alt="Avatar" className="w-full h-full object-cover" /> : <UserCircle className="w-7 h-7 text-neutral-300" />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-neutral-900">
                      {t.person_name}
                      {t.person_role && <span className="text-neutral-500 font-normal"> — {t.person_role}</span>}
                      {t.company_name && <span className="text-neutral-400 font-normal">, {t.company_name}</span>}
                    </p>
                    <p className="text-xs text-neutral-500 mt-1 line-clamp-2 italic">&ldquo;{t.quote}&rdquo;</p>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold shrink-0 ${t.is_active ? "bg-green-100 text-green-700" : "bg-neutral-100 text-neutral-500"}`}>
                    {t.is_active ? "Active" : "Off"}
                  </span>
                  <div className="flex flex-col gap-1 shrink-0">
                    <button type="button" onClick={() => setEditingTestimonial(t)} className="text-xs font-semibold text-blue-600 hover:text-blue-800 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors">Edit</button>
                    <button type="button" onClick={() => setDeleteId(t.id)} className="text-xs font-semibold text-red-500 hover:text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors">Delete</button>
                  </div>
                </div>
              )}
            />
            {sorted.length === 0 && (
              <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-2xl py-12 text-center text-neutral-400 text-sm">
                No testimonials yet. Click &quot;Add Testimonial&quot; to create one.
              </div>
            )}
          </div>
        </div>
      </div>

      <TestimonialDialog isOpen={addOpen} title="Add Testimonial" initial={{ sort_order: sorted.length * 10 }} sectionId={data.id} onClose={() => setAddOpen(false)} />
      {editingTestimonial && <TestimonialDialog isOpen title="Edit Testimonial" initial={editingTestimonial} sectionId={data.id} testimonialId={editingTestimonial.id} onClose={() => setEditingTestimonial(null)} />}
      <ConfirmDialog isOpen={!!deleteId} title="Delete Testimonial" message="Remove this testimonial from the homepage?" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
      <MediaPickerModal isOpen={!!avatarPickFor} onClose={() => setAvatarPickFor(null)} onSelect={handleAvatarSelect} />
    </div>
  );
}
