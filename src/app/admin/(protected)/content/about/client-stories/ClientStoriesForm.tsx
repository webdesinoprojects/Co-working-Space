"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  upsertAboutClientStoryAction,
  deleteAboutClientStoryAction,
  reorderAboutItemsAction,
} from "@/features/admin/about/actions";
import type { AdminAboutClientStoryVM } from "@/features/admin/types";
import { SortableList } from "@/components/admin/SortableList";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { ItemDialog } from "@/components/admin/ItemDialog";
import { useToast } from "@/components/admin/Toast";
import { Plus, Orbit } from "lucide-react";

const INPUT =
  "w-full bg-white/70 border border-neutral-300 rounded-xl px-4 py-3 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 transition";
const LABEL =
  "block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2";

const ICON_OPTIONS = "orbit, fingerprint, gem, radar, aperture, satellite";

function ClientStoryDialog({
  isOpen,
  title,
  initial,
  storyId,
  onClose,
}: {
  isOpen: boolean;
  title: string;
  initial?: Partial<AdminAboutClientStoryVM>;
  storyId?: string;
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
      const result = await upsertAboutClientStoryAction({
        id: storyId,
        sort_order: initial?.sort_order ?? 0,
        tag: (fd.get("tag") as string).trim(),
        author: (fd.get("author") as string).trim(),
        title: (fd.get("title") as string).trim(),
        description: (fd.get("description") as string).trim(),
        icon_key: (fd.get("icon_key") as string).trim(),
        is_active: fd.get("is_active") === "on",
      });
      if (result.success) {
        showToast("Saved", "Client story updated.", "success");
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
            <label className={LABEL}>Tag</label>
            <input
              name="tag"
              defaultValue={initial?.tag ?? ""}
              required
              className={INPUT}
              placeholder="Team Growth"
            />
          </div>
          <div>
            <label className={LABEL}>Author</label>
            <input
              name="author"
              defaultValue={initial?.author ?? ""}
              required
              className={INPUT}
              placeholder="Startup Operations Team"
            />
          </div>
          <div className="col-span-2">
            <label className={LABEL}>Title</label>
            <input
              name="title"
              defaultValue={initial?.title ?? ""}
              required
              className={INPUT}
              placeholder="Startup Team Finds Room to Grow"
            />
          </div>
          <div className="col-span-2">
            <label className={LABEL}>Description</label>
            <textarea
              name="description"
              defaultValue={initial?.description ?? ""}
              required
              rows={3}
              className={`${INPUT} resize-y`}
            />
          </div>
          <div>
            <label className={LABEL}>Icon Key</label>
            <input
              name="icon_key"
              defaultValue={initial?.icon_key ?? "orbit"}
              required
              className={INPUT}
            />
            <p className="text-[11px] text-neutral-400 mt-1">{ICON_OPTIONS}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="is_active"
            id="story_active"
            defaultChecked={initial?.is_active ?? true}
            className="w-4 h-4 rounded border-neutral-300"
          />
          <label htmlFor="story_active" className="text-sm font-medium text-neutral-700">
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

export function ClientStoriesForm({ stories }: { stories: AdminAboutClientStoryVM[] }) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<AdminAboutClientStoryVM | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  const sorted = [...stories].sort((a, b) => a.sort_order - b.sort_order);

  const handleReorder = async (reordered: AdminAboutClientStoryVM[]) => {
    const result = await reorderAboutItemsAction(
      "about_client_stories",
      reordered.map((s, i) => ({ id: s.id, sort_order: i * 10 }))
    );
    if (result.success) {
      showToast("Reordered", "Client stories reordered.", "success");
      router.refresh();
    } else {
      showToast("Reorder failed", result.error, "error");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const result = await deleteAboutClientStoryAction(deleteId);
    setDeleteId(null);
    if (result.success) {
      showToast("Deleted", "Client story removed.", "success");
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
          <h1 className="text-xl font-bold text-neutral-900">Client Stories</h1>
        </div>
        <button
          type="button"
          onClick={() => setAddOpen(true)}
          className="flex items-center gap-2 bg-neutral-900 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-neutral-800 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Story
        </button>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 px-8 py-6">
        <p className={`mb-4 ${LABEL}`}>Stories ({stories.length})</p>
        <div className="space-y-3">
          <SortableList
            items={sorted}
            onReorder={handleReorder}
            renderItem={(story, dragHandle) => (
              <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-2xl p-5 flex items-start gap-4">
                {dragHandle}
                <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0">
                  <Orbit className="w-5 h-5 text-[#F26522]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-bold text-[#F26522] uppercase tracking-widest mb-0.5">
                    {story.tag}
                  </div>
                  <p className="font-semibold text-sm text-neutral-900">{story.title}</p>
                  <p className="text-xs text-neutral-500 mt-0.5">by {story.author}</p>
                  <p className="text-xs text-neutral-400 mt-1 line-clamp-2">
                    {story.description}
                  </p>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-semibold shrink-0 ${
                    story.is_active
                      ? "bg-green-100 text-green-700"
                      : "bg-neutral-100 text-neutral-500"
                  }`}
                >
                  {story.is_active ? "Active" : "Off"}
                </span>
                <div className="flex flex-col gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => setEditing(story)}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteId(story.id)}
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
              No client stories yet. Click &quot;Add Story&quot; to create one.
            </div>
          )}
        </div>
      </div>

      <ClientStoryDialog
        isOpen={addOpen}
        title="Add Client Story"
        initial={{ sort_order: sorted.length * 10 }}
        onClose={() => setAddOpen(false)}
      />
      {editing && (
        <ClientStoryDialog
          isOpen
          title="Edit Client Story"
          initial={editing}
          storyId={editing.id}
          onClose={() => setEditing(null)}
        />
      )}
      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete Client Story"
        message="Remove this client story from the about page?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
