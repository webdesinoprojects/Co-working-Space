"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  upsertFooterLinkAction,
  deleteFooterLinkAction,
  upsertFooterSocialLinkAction,
  deleteFooterSocialLinkAction,
  reorderItemsAction,
} from "@/features/admin/homepage/actions";
import type { AdminFooterLinkVM, AdminFooterSocialLinkVM } from "@/features/admin/types";
import { SortableList } from "@/components/admin/SortableList";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { ItemDialog } from "@/components/admin/ItemDialog";
import { useToast } from "@/components/admin/Toast";
import { Plus } from "lucide-react";

const INPUT = "w-full bg-white/70 border border-neutral-300 rounded-xl px-4 py-3 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 transition";
const LABEL = "block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2";

const PLATFORM_OPTIONS = ["facebook", "twitter", "instagram", "linkedin", "youtube", "whatsapp", "other"];
const ICON_KEY_OPTIONS = ["facebook", "twitter", "x", "instagram", "linkedin", "youtube", "whatsapp", "message-circle"];
const GROUP_OPTIONS = ["sitemap", "legal", "company", "locations"];

function FooterLinkDialog({ isOpen, title, initial, linkId, onClose }: {
  isOpen: boolean; title: string; initial?: Partial<AdminFooterLinkVM>;
  linkId?: string; onClose: () => void;
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
      const result = await upsertFooterLinkAction({
        id: linkId,
        group_key: fd.get("group_key") as string,
        label: (fd.get("label") as string).trim(),
        href: (fd.get("href") as string).trim(),
        sort_order: initial?.sort_order ?? 0,
        is_active: fd.get("is_active") === "on",
      });
      if (result.success) {
        showToast("Saved changes", "Footer link updated.");
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
            <label className={LABEL}>Group</label>
            <select name="group_key" defaultValue={initial?.group_key ?? "sitemap"} className={`${INPUT} bg-white/60`}>
              {GROUP_OPTIONS.map((group) => <option key={group} value={group}>{group}</option>)}
            </select>
          </div>
          <div>
            <label className={LABEL}>Label</label>
            <input name="label" defaultValue={initial?.label ?? ""} required className={INPUT} />
          </div>
        </div>
        <div>
          <label className={LABEL}>Href</label>
          <input name="href" defaultValue={initial?.href ?? ""} required className={INPUT} placeholder="/about or https://..." />
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" name="is_active" id="footer_link_is_active" defaultChecked={initial?.is_active ?? true} className="w-4 h-4 rounded border-neutral-300" />
          <label htmlFor="footer_link_is_active" className="text-sm font-medium text-neutral-700">Active (shown in footer)</label>
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

function SocialLinkDialog({ isOpen, title, initial, linkId, onClose }: {
  isOpen: boolean; title: string; initial?: Partial<AdminFooterSocialLinkVM>;
  linkId?: string; onClose: () => void;
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
      const result = await upsertFooterSocialLinkAction({
        id: linkId,
        platform: fd.get("platform") as string,
        label: (fd.get("label") as string).trim(),
        href: (fd.get("href") as string).trim(),
        icon_key: fd.get("icon_key") as string,
        sort_order: initial?.sort_order ?? 0,
        is_active: fd.get("is_active") === "on",
      });
      if (result.success) {
        showToast("Saved changes", "Social link updated.");
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
            <label className={LABEL}>Platform</label>
            <select name="platform" defaultValue={initial?.platform ?? "facebook"} className={`${INPUT} bg-white/60`}>
              {PLATFORM_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className={LABEL}>Icon Key</label>
            <select name="icon_key" defaultValue={initial?.icon_key ?? "facebook"} className={`${INPUT} bg-white/60`}>
              {ICON_KEY_OPTIONS.map((k) => <option key={k} value={k}>{k}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className={LABEL}>Aria Label</label>
          <input name="label" defaultValue={initial?.label ?? ""} required className={INPUT} placeholder="e.g. Facebook" />
        </div>
        <div>
          <label className={LABEL}>URL</label>
          <input name="href" type="url" defaultValue={initial?.href ?? ""} required className={INPUT} placeholder="https://" />
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" name="is_active" id="social_is_active" defaultChecked={initial?.is_active ?? true} className="w-4 h-4 rounded border-neutral-300" />
          <label htmlFor="social_is_active" className="text-sm font-medium text-neutral-700">Active (shown in footer)</label>
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

export function FooterSocialsForm({
  footerLinks,
  socialLinks,
}: {
  footerLinks: AdminFooterLinkVM[];
  socialLinks: AdminFooterSocialLinkVM[];
}) {
  const router = useRouter();
  const { showToast } = useToast();
  const [footerItems, setFooterItems] = useState(footerLinks);
  const [socialItems, setSocialItems] = useState(socialLinks);
  const [deleteSocialId, setDeleteSocialId] = useState<string | null>(null);
  const [deleteFooterId, setDeleteFooterId] = useState<string | null>(null);
  const [editingFooterLink, setEditingFooterLink] = useState<AdminFooterLinkVM | null>(null);
  const [editingLink, setEditingLink] = useState<AdminFooterSocialLinkVM | null>(null);
  const [addSocialOpen, setAddSocialOpen] = useState(false);
  const [addFooterOpen, setAddFooterOpen] = useState(false);

  const handleFooterReorder = async (reordered: AdminFooterLinkVM[]) => {
    setFooterItems(reordered.map((l, i) => ({ ...l, sort_order: i * 10 })));
    const result = await reorderItemsAction("footer_links", reordered.map((l, i) => ({ id: l.id, sort_order: i * 10 })));
    if (result.success) {
      showToast("Saved order", "Footer links reordered.");
      router.refresh();
    } else {
      showToast("Reorder failed", result.error, "error");
    }
  };

  const handleSocialReorder = async (reordered: AdminFooterSocialLinkVM[]) => {
    setSocialItems(reordered.map((l, i) => ({ ...l, sort_order: i * 10 })));
    const result = await reorderItemsAction("footer_social_links", reordered.map((l, i) => ({ id: l.id, sort_order: i * 10 })));
    if (result.success) {
      showToast("Saved order", "Social links reordered.");
      router.refresh();
    } else {
      showToast("Reorder failed", result.error, "error");
    }
  };

  const handleFooterDelete = async () => {
    if (!deleteFooterId) return;
    const result = await deleteFooterLinkAction(deleteFooterId);
    if (result.success) {
      setFooterItems((current) => current.filter((link) => link.id !== deleteFooterId));
      setDeleteFooterId(null);
      showToast("Deleted", "Footer link removed.");
      router.refresh();
    } else {
      showToast("Delete failed", result.error, "error");
    }
  };

  const handleSocialDelete = async () => {
    if (!deleteSocialId) return;
    const result = await deleteFooterSocialLinkAction(deleteSocialId);
    if (result.success) {
      setSocialItems((current) => current.filter((link) => link.id !== deleteSocialId));
      setDeleteSocialId(null);
      showToast("Deleted", "Social link removed.");
      router.refresh();
    } else {
      showToast("Delete failed", result.error, "error");
    }
  };

  const sortedFooterLinks = [...footerItems].sort((a, b) => a.sort_order - b.sort_order);
  const sortedSocialLinks = [...socialItems].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Page header */}
      <div className="flex items-center justify-between px-8 py-5 border-b border-white/30 bg-white/20 backdrop-blur-sm shrink-0">
        <div>
          <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-widest mb-0.5">Footer</p>
          <h1 className="text-xl font-bold text-neutral-900">Footer Links</h1>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => setAddFooterOpen(true)}
            className="flex items-center gap-2 bg-white/70 text-neutral-900 border border-white/70 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-white transition-colors">
            <Plus className="w-4 h-4" /> Add Footer Link
          </button>
          <button type="button" onClick={() => setAddSocialOpen(true)}
            className="flex items-center gap-2 bg-neutral-900 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-neutral-800 transition-colors">
            <Plus className="w-4 h-4" /> Add Social
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="px-8 py-6 space-y-8">
          <section>
          <p className={`mb-4 ${LABEL}`}>Footer Links ({footerItems.length})</p>
          <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-2xl overflow-hidden">
            <SortableList
              items={sortedFooterLinks}
              onReorder={handleFooterReorder}
              renderItem={(link, dragHandle) => (
                <div className="flex items-center gap-3 px-5 py-4 border-b border-white/30 last:border-0 hover:bg-white/20 transition-colors">
                  {dragHandle}
                  <span className="font-mono text-xs bg-white/60 border border-neutral-200 px-2 py-1 rounded-lg w-24 text-center shrink-0 truncate">{link.group_key}</span>
                  <span className="font-semibold text-sm text-neutral-900 w-32 shrink-0 truncate">{link.label}</span>
                  <span className="text-sm text-neutral-500 flex-1 truncate">{link.href}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold shrink-0 ${link.is_active ? "bg-green-100 text-green-700" : "bg-neutral-100 text-neutral-500"}`}>
                    {link.is_active ? "Active" : "Off"}
                  </span>
                  <button type="button" onClick={() => setEditingFooterLink(link)} className="text-xs font-semibold text-blue-600 hover:text-blue-800 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors">Edit</button>
                  <button type="button" onClick={() => setDeleteFooterId(link.id)} className="text-xs font-semibold text-red-500 hover:text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors">Delete</button>
                </div>
              )}
            />
            {sortedFooterLinks.length === 0 && (
              <div className="px-5 py-12 text-center text-neutral-400 text-sm">
                No footer links configured yet. Click &quot;Add Footer Link&quot; to create one.
              </div>
            )}
          </div>
          </section>

          <section>
          <p className={`mb-4 ${LABEL}`}>Social Links ({socialItems.length})</p>
          <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-2xl overflow-hidden">
            <SortableList
              items={sortedSocialLinks}
              onReorder={handleSocialReorder}
              renderItem={(link, dragHandle) => (
                <div className="flex items-center gap-3 px-5 py-4 border-b border-white/30 last:border-0 hover:bg-white/20 transition-colors">
                  {dragHandle}
                  <span className="font-mono text-xs bg-white/60 border border-neutral-200 px-2 py-1 rounded-lg w-28 text-center shrink-0 truncate">{link.icon_key}</span>
                  <span className="font-semibold text-sm text-neutral-900 w-24 shrink-0">{link.platform}</span>
                  <span className="text-sm text-neutral-500 flex-1 truncate">{link.href}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold shrink-0 ${link.is_active ? "bg-green-100 text-green-700" : "bg-neutral-100 text-neutral-500"}`}>
                    {link.is_active ? "Active" : "Off"}
                  </span>
                  <button type="button" onClick={() => setEditingLink(link)} className="text-xs font-semibold text-blue-600 hover:text-blue-800 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors">Edit</button>
                  <button type="button" onClick={() => setDeleteSocialId(link.id)} className="text-xs font-semibold text-red-500 hover:text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors">Delete</button>
                </div>
              )}
            />
            {sortedSocialLinks.length === 0 && (
              <div className="px-5 py-12 text-center text-neutral-400 text-sm">
                No social links configured yet. Click &quot;Add Link&quot; to create one.
              </div>
            )}
          </div>
          </section>
        </div>
      </div>

      <FooterLinkDialog isOpen={addFooterOpen} title="Add Footer Link" initial={{ sort_order: sortedFooterLinks.length * 10 }} onClose={() => setAddFooterOpen(false)} />
      {editingFooterLink && <FooterLinkDialog isOpen title="Edit Footer Link" initial={editingFooterLink} linkId={editingFooterLink.id} onClose={() => setEditingFooterLink(null)} />}
      <SocialLinkDialog isOpen={addSocialOpen} title="Add Social Link" initial={{ sort_order: sortedSocialLinks.length * 10 }} onClose={() => setAddSocialOpen(false)} />
      {editingLink && <SocialLinkDialog isOpen title="Edit Social Link" initial={editingLink} linkId={editingLink.id} onClose={() => setEditingLink(null)} />}
      <ConfirmDialog isOpen={!!deleteFooterId} title="Delete Footer Link" message="Remove this footer link?" onConfirm={handleFooterDelete} onCancel={() => setDeleteFooterId(null)} />
      <ConfirmDialog isOpen={!!deleteSocialId} title="Delete Social Link" message="Remove this social link from the footer?" onConfirm={handleSocialDelete} onCancel={() => setDeleteSocialId(null)} />
    </div>
  );
}
