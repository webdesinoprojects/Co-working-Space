"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  updateMembershipsHeaderAction, upsertMembershipPlanAction, deleteMembershipPlanAction,
  upsertMembershipPlanFeatureAction, deleteMembershipPlanFeatureAction, reorderItemsAction,
} from "@/features/admin/homepage/actions";
import type { AdminMembershipSectionVM, AdminMembershipPlanVM, AdminMembershipPlanFeatureVM } from "@/features/admin/types";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { SortableList } from "@/components/admin/SortableList";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { ItemDialog } from "@/components/admin/ItemDialog";
import { useToast } from "@/components/admin/Toast";
import { ChevronDown, ChevronUp, Plus, X } from "lucide-react";

const INPUT = "w-full bg-white/70 border border-neutral-300 rounded-xl px-4 py-3 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 transition";
const LABEL = "block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2";

function PlanDialog({ isOpen, title, initial, sectionId, planId, onClose }: {
  isOpen: boolean; title: string; initial?: Partial<AdminMembershipPlanVM>;
  sectionId: string; planId?: string; onClose: () => void;
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
      const result = await upsertMembershipPlanAction({
        id: planId, section_id: sectionId,
        title: (fd.get("title") as string).trim(),
        description: ((fd.get("description") as string).trim()) || null,
        price_text: (fd.get("price_text") as string).trim(),
        cta_label: (fd.get("cta_label") as string).trim(),
        highlight_badge_text: ((fd.get("highlight_badge_text") as string).trim()) || null,
        is_featured: fd.get("is_featured") === "on",
        sort_order: initial?.sort_order ?? 0,
        is_active: fd.get("is_active") === "on",
      });
      if (result.success) {
        showToast("Saved changes", "Membership plan updated.", "success");
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
            <label className={LABEL}>Plan Name</label>
            <input name="title" defaultValue={initial?.title ?? ""} required className={INPUT} />
          </div>
          <div>
            <label className={LABEL}>Price</label>
            <input name="price_text" defaultValue={initial?.price_text ?? ""} required className={INPUT} placeholder="e.g. Rs. 250/mo" />
          </div>
          <div>
            <label className={LABEL}>CTA Label</label>
            <input name="cta_label" defaultValue={initial?.cta_label ?? "Select Plan"} required className={INPUT} />
          </div>
          <div>
            <label className={LABEL}>Badge <span className="text-neutral-400 normal-case font-normal">(optional)</span></label>
            <input name="highlight_badge_text" defaultValue={initial?.highlight_badge_text ?? ""} className={INPUT} placeholder="e.g. Most Popular" />
          </div>
        </div>
        <div>
          <label className={LABEL}>Description <span className="text-neutral-400 normal-case font-normal">(optional)</span></label>
          <textarea name="description" defaultValue={initial?.description ?? ""} rows={2} className={`${INPUT} resize-none`} />
        </div>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="is_featured" defaultChecked={initial?.is_featured ?? false} className="w-4 h-4 rounded border-neutral-300" />
            <span className="text-sm font-medium text-neutral-700">Featured (dark card)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="is_active" defaultChecked={initial?.is_active ?? true} className="w-4 h-4 rounded border-neutral-300" />
            <span className="text-sm font-medium text-neutral-700">Active</span>
          </label>
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

function PlanFeaturesPanel({ plan }: { plan: AdminMembershipPlanVM }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [newText, setNewText] = useState("");
  const [addPending, startAdd] = useTransition();
  const [deletePendingId, setDeletePendingId] = useState<string | null>(null);

  const handleAdd = () => {
    const text = newText.trim();
    if (!text) return;
    startAdd(async () => {
      const result = await upsertMembershipPlanFeatureAction({ plan_id: plan.id, feature_text: text, sort_order: plan.features.length * 10 });
      setNewText("");
      if (result.success) {
        showToast("Saved changes", "Plan feature added.", "success");
        router.refresh();
      } else {
        showToast("Save failed", result.error, "error");
      }
    });
  };
  const handleDelete = async (featureId: string) => {
    setDeletePendingId(featureId);
    const result = await deleteMembershipPlanFeatureAction(featureId);
    setDeletePendingId(null);
    if (result.success) {
      showToast("Deleted", "Plan feature removed.", "success");
      router.refresh();
    } else {
      showToast("Delete failed", result.error, "error");
    }
  };
  const handleFeatureReorder = async (reordered: AdminMembershipPlanFeatureVM[]) => {
    const result = await reorderItemsAction("home_membership_plan_features", reordered.map((f, i) => ({ id: f.id, sort_order: i * 10 })));
    if (result.success) {
      showToast("Saved order", "Plan features reordered.", "success");
      router.refresh();
    } else {
      showToast("Reorder failed", result.error, "error");
    }
  };

  return (
    <div className="border-t border-white/30 mt-0 pt-3 px-5 pb-4">
      <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-2">Features ({plan.features.length})</p>
      <SortableList
        items={[...plan.features].sort((a, b) => a.sort_order - b.sort_order)}
        onReorder={handleFeatureReorder}
        renderItem={(feature, dragHandle) => (
          <div className="flex items-center gap-2 py-1.5 border-b border-white/20 last:border-0">
            {dragHandle}
            <span className="text-sm text-neutral-700 flex-1">{feature.feature_text}</span>
            <button type="button" disabled={deletePendingId === feature.id} onClick={() => handleDelete(feature.id)} className="text-neutral-400 hover:text-red-500 disabled:opacity-40 transition-colors">
              <X size={14} />
            </button>
          </div>
        )}
      />
      {plan.features.length === 0 && <p className="text-xs text-neutral-400 mb-2">No features yet.</p>}
      <div className="flex gap-2 mt-2">
        <input value={newText} onChange={(e) => setNewText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAdd())}
          placeholder="New feature..." className="flex-1 bg-white/60 border border-neutral-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/10" />
        <button type="button" onClick={handleAdd} disabled={addPending || !newText.trim()}
          className="bg-neutral-800 text-white px-3 py-2 text-xs rounded-xl hover:bg-neutral-700 disabled:opacity-40 transition-colors">
          {addPending ? "..." : "Add"}
        </button>
      </div>
    </div>
  );
}

export function MembershipsForm({ data }: { data: AdminMembershipSectionVM }) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingPlan, setEditingPlan] = useState<AdminMembershipPlanVM | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [expandedPlanId, setExpandedPlanId] = useState<string | null>(null);
  const router = useRouter();
  const { showToast } = useToast();

  const headerAction = async (formData: FormData) => {
    const result = await updateMembershipsHeaderAction(Object.fromEntries(formData.entries()));
    if (result.success) {
      showToast("Saved changes", "Membership settings updated.", "success");
      router.refresh();
    } else {
      showToast("Save failed", result.error, "error");
    }
  };
  const handleReorder = async (reordered: AdminMembershipPlanVM[]) => {
    const result = await reorderItemsAction("home_membership_plans", reordered.map((p, i) => ({ id: p.id, sort_order: i * 10 })));
    if (result.success) {
      showToast("Saved order", "Membership plans reordered.", "success");
      router.refresh();
    } else {
      showToast("Reorder failed", result.error, "error");
    }
  };
  const handleDelete = async () => {
    if (!deleteId) return;
    const result = await deleteMembershipPlanAction(deleteId);
    setDeleteId(null);
    if (result.success) {
      showToast("Deleted", "Membership plan removed.", "success");
      router.refresh();
    } else {
      showToast("Delete failed", result.error, "error");
    }
  };

  const sorted = [...data.plans].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Page header */}
      <div className="flex items-center justify-between px-8 py-5 border-b border-white/30 bg-white/20 backdrop-blur-sm shrink-0">
        <div>
          <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-widest mb-0.5">Homepage</p>
          <h1 className="text-xl font-bold text-neutral-900">Memberships</h1>
        </div>
        <button type="button" onClick={() => setAddOpen(true)}
          className="flex items-center gap-2 bg-neutral-900 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-neutral-800 transition-colors">
          <Plus className="w-4 h-4" /> Add Plan
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

          {/* Show / hide the whole section on the public site */}
          <label className="flex items-center gap-3 mt-5 cursor-pointer select-none">
            <input
              type="checkbox"
              name="is_enabled"
              defaultChecked={data.is_enabled}
              className="w-4 h-4 rounded border-neutral-300"
            />
            <span className="text-sm font-medium text-neutral-700">
              Show this section on the website
            </span>
            <span className="text-xs text-neutral-400">
              (off = hidden completely, no placeholder)
            </span>
          </label>

          <div className="flex justify-end mt-4"><SubmitButton /></div>
        </form>

        {/* Plans */}
        <div className="px-8 py-6">
          <p className={`mb-4 ${LABEL}`}>Plans ({data.plans.length})</p>
          <div className="space-y-3">
            <SortableList
              items={sorted}
              onReorder={handleReorder}
              renderItem={(plan, dragHandle) => (
                <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-2xl overflow-hidden">
                  <div className="flex items-center gap-3 p-4">
                    {dragHandle}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm text-neutral-900">{plan.title}</span>
                        {plan.is_featured && <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full">Featured</span>}
                        {plan.highlight_badge_text && <span className="bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-0.5 rounded-full">{plan.highlight_badge_text}</span>}
                      </div>
                      <p className="text-xs text-neutral-500 mt-0.5">{plan.price_text} — {plan.features.length} features</p>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold shrink-0 ${plan.is_active ? "bg-green-100 text-green-700" : "bg-neutral-100 text-neutral-500"}`}>
                      {plan.is_active ? "Active" : "Off"}
                    </span>
                    <button type="button" onClick={() => setExpandedPlanId(expandedPlanId === plan.id ? null : plan.id)}
                      className="text-neutral-400 hover:text-neutral-700 p-1 transition-colors">
                      {expandedPlanId === plan.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    <button type="button" onClick={() => setEditingPlan(plan)} className="text-xs font-semibold text-blue-600 hover:text-blue-800 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors">Edit</button>
                    <button type="button" onClick={() => setDeleteId(plan.id)} className="text-xs font-semibold text-red-500 hover:text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors">Delete</button>
                  </div>
                  {expandedPlanId === plan.id && <PlanFeaturesPanel plan={plan} />}
                </div>
              )}
            />
            {sorted.length === 0 && (
              <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-2xl py-12 text-center text-neutral-400 text-sm">
                No plans yet. Click &quot;Add Plan&quot; to create one.
              </div>
            )}
          </div>
        </div>
      </div>

      <PlanDialog isOpen={addOpen} title="Add Plan" initial={{ sort_order: sorted.length * 10 }} sectionId={data.id} onClose={() => setAddOpen(false)} />
      {editingPlan && <PlanDialog isOpen title="Edit Plan" initial={editingPlan} sectionId={data.id} planId={editingPlan.id} onClose={() => setEditingPlan(null)} />}
      <ConfirmDialog isOpen={!!deleteId} title="Delete Plan" message="This plan and all its features will be permanently removed. Continue?" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </div>
  );
}
