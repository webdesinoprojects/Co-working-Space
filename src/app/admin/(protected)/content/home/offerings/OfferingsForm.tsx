"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  updateOfferingsHeaderAction, upsertOfferingAction, deleteOfferingAction,
  upsertOfferingFeatureAction, deleteOfferingFeatureAction, reorderItemsAction,
} from "@/features/admin/homepage/actions";
import type { AdminOfferingsSectionVM, AdminOfferingVM, AdminOfferingFeatureVM } from "@/features/admin/types";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { SortableList } from "@/components/admin/SortableList";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { ItemDialog } from "@/components/admin/ItemDialog";
import { useToast } from "@/components/admin/Toast";
import { ChevronDown, ChevronUp, Plus, X } from "lucide-react";

const INPUT = "w-full bg-white/70 border border-neutral-300 rounded-xl px-4 py-3 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 transition";
const LABEL = "block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2";

const ICON_KEY_OPTIONS = [
  "user", "users", "laptop", "monitor", "briefcase", "building",
  "presentation", "video", "wifi", "coffee", "key", "shield",
  "bike", "zap", "mic", "bus", "sparkles", "printer", "droplets", "phone",
];

function OfferingDialog({ isOpen, title, initial, sectionId, offeringId, onClose }: {
  isOpen: boolean; title: string; initial?: Partial<AdminOfferingVM>;
  sectionId: string; offeringId?: string; onClose: () => void;
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
      const result = await upsertOfferingAction({
        id: offeringId, section_id: sectionId,
        title: (fd.get("title") as string).trim(),
        icon_key: fd.get("icon_key") as string,
        price_text: ((fd.get("price_text") as string).trim()) || null,
        sort_order: initial?.sort_order ?? 0,
        is_active: fd.get("is_active") === "on",
      });
      if (result.success) {
        showToast("Saved changes", "Offering updated.", "success");
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
          <label className={LABEL}>Title</label>
          <input name="title" defaultValue={initial?.title ?? ""} required className={INPUT} placeholder="e.g. Hot Desk" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={LABEL}>Icon</label>
            <select name="icon_key" defaultValue={initial?.icon_key ?? "user"} className={`${INPUT} bg-white/60`}>
              {ICON_KEY_OPTIONS.map((k) => <option key={k} value={k}>{k}</option>)}
            </select>
          </div>
          <div>
            <label className={LABEL}>Price <span className="text-neutral-400 normal-case font-normal">(optional)</span></label>
            <input name="price_text" defaultValue={initial?.price_text ?? ""} className={INPUT} placeholder="e.g. Rs. 250/day" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" name="is_active" id="offering_is_active" defaultChecked={initial?.is_active ?? true} className="w-4 h-4 rounded border-neutral-300" />
          <label htmlFor="offering_is_active" className="text-sm font-medium text-neutral-700">Active (shown on homepage)</label>
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

function OfferingFeaturesPanel({ offering }: { offering: AdminOfferingVM }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [newText, setNewText] = useState("");
  const [newIncluded, setNewIncluded] = useState(true);
  const [addPending, startAdd] = useTransition();
  const [deletePendingId, setDeletePendingId] = useState<string | null>(null);

  const handleAdd = () => {
    const text = newText.trim();
    if (!text) return;
    startAdd(async () => {
      const result = await upsertOfferingFeatureAction({ offering_id: offering.id, feature_text: text, is_included: newIncluded, sort_order: offering.features.length * 10 });
      setNewText("");
      if (result.success) {
        showToast("Saved changes", "Offering feature added.", "success");
        router.refresh();
      } else {
        showToast("Save failed", result.error, "error");
      }
    });
  };
  const handleDelete = async (featureId: string) => {
    setDeletePendingId(featureId);
    const result = await deleteOfferingFeatureAction(featureId);
    setDeletePendingId(null);
    if (result.success) {
      showToast("Deleted", "Offering feature removed.", "success");
      router.refresh();
    } else {
      showToast("Delete failed", result.error, "error");
    }
  };
  const handleReorder = async (reordered: AdminOfferingFeatureVM[]) => {
    const result = await reorderItemsAction("home_offering_features", reordered.map((f, i) => ({ id: f.id, sort_order: i * 10 })));
    if (result.success) {
      showToast("Saved order", "Offering features reordered.", "success");
      router.refresh();
    } else {
      showToast("Reorder failed", result.error, "error");
    }
  };

  return (
    <div className="border-t border-white/30 pt-3 px-5 pb-4">
      <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-2">Features ({offering.features.length})</p>
      <SortableList
        items={[...offering.features].sort((a, b) => a.sort_order - b.sort_order)}
        onReorder={handleReorder}
        renderItem={(feature, dragHandle) => (
          <div className="flex items-center gap-2 py-1.5 border-b border-white/20 last:border-0">
            {dragHandle}
            <span className={`text-[11px] px-1.5 py-0.5 rounded font-semibold shrink-0 ${feature.is_included ? "bg-green-100 text-green-700" : "bg-neutral-100 text-neutral-500"}`}>
              {feature.is_included ? "Yes" : "No"}
            </span>
            <span className="text-sm text-neutral-700 flex-1">{feature.feature_text}</span>
            <button type="button" disabled={deletePendingId === feature.id} onClick={() => handleDelete(feature.id)} className="text-neutral-400 hover:text-red-500 disabled:opacity-40 transition-colors">
              <X size={14} />
            </button>
          </div>
        )}
      />
      {offering.features.length === 0 && <p className="text-xs text-neutral-400 mb-2">No features yet.</p>}
      <div className="flex gap-2 mt-2">
        <label className="flex items-center gap-1.5 shrink-0 cursor-pointer">
          <input type="checkbox" checked={newIncluded} onChange={(e) => setNewIncluded(e.target.checked)} className="w-4 h-4 rounded border-neutral-300" />
          <span className="text-xs text-neutral-600">Included</span>
        </label>
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

export function OfferingsForm({ data }: { data: AdminOfferingsSectionVM }) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingOffering, setEditingOffering] = useState<AdminOfferingVM | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [expandedOfferingId, setExpandedOfferingId] = useState<string | null>(null);
  const router = useRouter();
  const { showToast } = useToast();

  const headerAction = async (formData: FormData) => {
    const result = await updateOfferingsHeaderAction(Object.fromEntries(formData.entries()));
    if (result.success) {
      showToast("Saved changes", "Offerings settings updated.", "success");
      router.refresh();
    } else {
      showToast("Save failed", result.error, "error");
    }
  };
  const handleReorder = async (reordered: AdminOfferingVM[]) => {
    const result = await reorderItemsAction("home_offerings", reordered.map((o, i) => ({ id: o.id, sort_order: i * 10 })));
    if (result.success) {
      showToast("Saved order", "Offerings reordered.", "success");
      router.refresh();
    } else {
      showToast("Reorder failed", result.error, "error");
    }
  };
  const handleDelete = async () => {
    if (!deleteId) return;
    const result = await deleteOfferingAction(deleteId);
    setDeleteId(null);
    if (result.success) {
      showToast("Deleted", "Offering removed.", "success");
      router.refresh();
    } else {
      showToast("Delete failed", result.error, "error");
    }
  };

  const sorted = [...data.offerings].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Page header */}
      <div className="flex items-center justify-between px-8 py-5 border-b border-white/30 bg-white/20 backdrop-blur-sm shrink-0">
        <div>
          <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-widest mb-0.5">Homepage</p>
          <h1 className="text-xl font-bold text-neutral-900">Offerings</h1>
        </div>
        <button type="button" onClick={() => setAddOpen(true)}
          className="flex items-center gap-2 bg-neutral-900 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-neutral-800 transition-colors">
          <Plus className="w-4 h-4" /> Add Offering
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

        {/* Offerings */}
        <div className="px-8 py-6">
          <p className={`mb-4 ${LABEL}`}>Offerings ({data.offerings.length})</p>
          <div className="space-y-3">
            <SortableList
              items={sorted}
              onReorder={handleReorder}
              renderItem={(offering, dragHandle) => (
                <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-2xl overflow-hidden">
                  <div className="flex items-center gap-3 p-4">
                    {dragHandle}
                    <span className="font-mono text-xs bg-white/60 border border-neutral-200 px-2 py-1 rounded-lg shrink-0">{offering.icon_key}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-neutral-900">{offering.title}</p>
                      <p className="text-xs text-neutral-500 mt-0.5">{offering.price_text || "No price"} — {offering.features.length} features</p>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold shrink-0 ${offering.is_active ? "bg-green-100 text-green-700" : "bg-neutral-100 text-neutral-500"}`}>
                      {offering.is_active ? "Active" : "Off"}
                    </span>
                    <button type="button" onClick={() => setExpandedOfferingId(expandedOfferingId === offering.id ? null : offering.id)}
                      className="text-neutral-400 hover:text-neutral-700 p-1 transition-colors">
                      {expandedOfferingId === offering.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    <button type="button" onClick={() => setEditingOffering(offering)} className="text-xs font-semibold text-blue-600 hover:text-blue-800 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors">Edit</button>
                    <button type="button" onClick={() => setDeleteId(offering.id)} className="text-xs font-semibold text-red-500 hover:text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors">Delete</button>
                  </div>
                  {expandedOfferingId === offering.id && <OfferingFeaturesPanel offering={offering} />}
                </div>
              )}
            />
            {sorted.length === 0 && (
              <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-2xl py-12 text-center text-neutral-400 text-sm">
                No offerings yet. Click &quot;Add Offering&quot; to create one.
              </div>
            )}
          </div>
        </div>
      </div>

      <OfferingDialog isOpen={addOpen} title="Add Offering" initial={{ sort_order: sorted.length * 10 }} sectionId={data.id} onClose={() => setAddOpen(false)} />
      {editingOffering && <OfferingDialog isOpen title="Edit Offering" initial={editingOffering} sectionId={data.id} offeringId={editingOffering.id} onClose={() => setEditingOffering(null)} />}
      <ConfirmDialog isOpen={!!deleteId} title="Delete Offering" message="This offering and all its features will be permanently removed. Continue?" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </div>
  );
}
