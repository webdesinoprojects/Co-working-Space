"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  updateWorkspaceOverviewAction,
  createWorkspaceAction,
  deleteWorkspaceAction,
  reorderWorkspacesAction,
} from "@/features/admin/workspaces/actions";
import type {
  AdminWorkspaceListItemVM,
  AdminWorkspaceOverviewVM,
  ActionResult,
} from "@/features/admin/types";
import { SortableList } from "@/components/admin/SortableList";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { ItemDialog } from "@/components/admin/ItemDialog";
import { useToast } from "@/components/admin/Toast";
import { Plus, ImageIcon, ExternalLink } from "lucide-react";

const INPUT = "w-full bg-white/70 border border-neutral-300 rounded-xl px-4 py-3 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 transition";
const LABEL = "block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2";

function OverviewForm({ overview }: { overview: AdminWorkspaceOverviewVM | null }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await updateWorkspaceOverviewAction({
        badge_text: (fd.get("badge_text") as string).trim(),
        title: (fd.get("title") as string).trim(),
        body_text: (fd.get("body_text") as string).trim(),
      });
      if (result.success) {
        showToast("Saved", "Overview updated.", "success");
        router.refresh();
      } else {
        showToast("Save failed", result.error, "error");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="px-8 py-6 border-b border-white/20">
      <p className={LABEL}>Workspaces Overview Section</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-3">
        <div>
          <label className={LABEL}>Badge Text</label>
          <input name="badge_text" defaultValue={overview?.badge_text ?? ""} required className={INPUT} placeholder="Spaces" />
        </div>
        <div>
          <label className={LABEL}>Page Title</label>
          <input name="title" defaultValue={overview?.title ?? ""} required className={INPUT} placeholder="Workspaces tailored..." />
        </div>
        <div className="col-span-full">
          <label className={LABEL}>Body Text</label>
          <textarea name="body_text" defaultValue={overview?.body_text ?? ""} required rows={3} className={`${INPUT} resize-y`} />
        </div>
      </div>
      <div className="flex justify-end mt-4">
        <button type="submit" disabled={isPending} className="bg-neutral-900 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-neutral-800 disabled:opacity-50">
          {isPending ? "Saving..." : "Save Overview"}
        </button>
      </div>
    </form>
  );
}

function CreateWorkspaceDialog({ isOpen, onClose, nextSortOrder }: { isOpen: boolean; onClose: () => void; nextSortOrder: number }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await createWorkspaceAction({
        slug: (fd.get("slug") as string).trim(),
        nav_label: (fd.get("nav_label") as string).trim(),
        card_title: (fd.get("card_title") as string).trim(),
        card_description: (fd.get("card_description") as string).trim(),
        hero_title: (fd.get("hero_title") as string).trim(),
        hero_description: (fd.get("hero_description") as string).trim(),
        cta_label: (fd.get("cta_label") as string || "Get Started").trim(),
        cta_href: (fd.get("cta_href") as string || "/connect").trim(),
        video_label: (fd.get("video_label") as string || "Watch video").trim(),
        video_href: (fd.get("video_href") as string || "").trim() || null,
        sort_order: nextSortOrder,
        is_active: true,
        is_featured: false,
        meta_title: null,
        meta_description: null,
      });
      if (result.success) {
        showToast("Created", "Workspace created.", "success");
        onClose();
        if (result.data) router.push(`/admin/content/workspaces/${result.data.slug}`);
        else router.refresh();
      } else {
        setError((result as ActionResult).success === false ? (result as { error: string }).error : "Failed");
      }
    });
  };

  return (
    <ItemDialog isOpen={isOpen} title="Create Workspace" onClose={onClose} wide>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={LABEL}>Slug <span className="text-neutral-400 normal-case font-normal">(URL path, e.g. private-cabins)</span></label>
            <input name="slug" required className={INPUT} placeholder="private-cabins" pattern="[a-z0-9]+(?:-[a-z0-9]+)*" />
          </div>
          <div>
            <label className={LABEL}>Nav Label</label>
            <input name="nav_label" required className={INPUT} placeholder="Private Cabins" />
          </div>
          <div className="col-span-2">
            <label className={LABEL}>Card Title</label>
            <input name="card_title" required className={INPUT} placeholder="Private Cabins" />
          </div>
          <div className="col-span-2">
            <label className={LABEL}>Card Description</label>
            <textarea name="card_description" required rows={2} className={`${INPUT} resize-y`} />
          </div>
          <div className="col-span-2">
            <label className={LABEL}>Hero Title</label>
            <input name="hero_title" required className={INPUT} placeholder="Private Cabins" />
          </div>
          <div className="col-span-2">
            <label className={LABEL}>Hero Description</label>
            <textarea name="hero_description" required rows={3} className={`${INPUT} resize-y`} />
          </div>
        </div>
        {error && <p className="text-red-500 text-xs">{error}</p>}
        <div className="flex justify-end">
          <button type="submit" disabled={isPending} className="bg-neutral-900 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-neutral-800 disabled:opacity-50">
            {isPending ? "Creating..." : "Create Workspace"}
          </button>
        </div>
      </form>
    </ItemDialog>
  );
}

export default function WorkspacesListPage({
  workspaces,
  overview,
}: {
  workspaces: AdminWorkspaceListItemVM[];
  overview: AdminWorkspaceOverviewVM | null;
}) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [items, setItems] = useState(workspaces);
  const router = useRouter();
  const { showToast } = useToast();

  const sorted = [...items].sort((a, b) => a.sort_order - b.sort_order);

  const handleReorder = async (reordered: AdminWorkspaceListItemVM[]) => {
    setItems(reordered.map((ws, i) => ({ ...ws, sort_order: i * 10 })));
    const result = await reorderWorkspacesAction(reordered.map((ws, i) => ({ id: ws.id, sort_order: i * 10 })));
    if (result.success) {
      showToast("Reordered", "Workspaces reordered.", "success");
      router.refresh();
    } else {
      showToast("Reorder failed", result.error, "error");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const result = await deleteWorkspaceAction(deleteId);
    setDeleteId(null);
    if (result.success) {
      setItems((current) => current.filter((ws) => ws.id !== deleteId));
      showToast("Deleted", "Workspace removed.", "success");
      router.refresh();
    } else {
      showToast("Delete failed", result.error, "error");
    }
  };

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="flex items-center justify-between px-8 py-5 border-b border-white/30 bg-white/20 backdrop-blur-sm shrink-0">
        <div>
          <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-widest mb-0.5">Content</p>
          <h1 className="text-xl font-bold text-neutral-900">Workspaces</h1>
        </div>
        <button
          type="button"
          onClick={() => setAddOpen(true)}
          className="flex items-center gap-2 bg-neutral-900 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-neutral-800 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Workspace
        </button>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0">
        <OverviewForm overview={overview} />

        <div className="px-8 py-6">
          <p className={`mb-4 ${LABEL}`}>Workspaces ({items.length})</p>
          <div className="space-y-3">
            <SortableList
              items={sorted}
              onReorder={handleReorder}
              renderItem={(ws, dragHandle) => (
                <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-2xl p-5 flex items-center gap-4">
                  {dragHandle}
                  <div className="w-14 h-14 bg-white/60 rounded-xl border border-neutral-200 overflow-hidden shrink-0 flex items-center justify-center">
                    {ws.overview_image ? (
                      <img src={ws.overview_image.url} alt={ws.overview_image.alt ?? ws.card_title} className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-5 h-5 text-neutral-300" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-neutral-900">{ws.card_title}</p>
                    <p className="text-xs text-neutral-500 mt-0.5">/{ws.slug}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${ws.is_active ? "bg-green-100 text-green-700" : "bg-neutral-100 text-neutral-500"}`}>
                      {ws.is_active ? "Active" : "Off"}
                    </span>
                    {ws.is_featured && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">Featured</span>
                    )}
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Link
                      href={`/admin/content/workspaces/${ws.slug}`}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-800 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      Edit
                    </Link>
                    <a
                      href={`/workspaces/${ws.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-semibold text-neutral-500 hover:text-neutral-700 px-3 py-1.5 rounded-lg hover:bg-neutral-50 transition-colors flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <button
                      type="button"
                      onClick={() => setDeleteId(ws.id)}
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
                No workspaces yet. Click &quot;Add Workspace&quot; to create one.
              </div>
            )}
          </div>
        </div>
      </div>

      <CreateWorkspaceDialog
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        nextSortOrder={sorted.length * 10}
      />
      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete Workspace"
        message="Remove this workspace? This will delete all associated content (stats, gallery, plans, etc.)."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}