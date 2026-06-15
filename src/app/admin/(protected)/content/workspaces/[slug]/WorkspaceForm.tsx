"use client";

/* eslint-disable react-hooks/static-components */

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  updateWorkspaceAction, assignWorkspaceOverviewImageAction, assignWorkspaceHeroImageAction,
  upsertWorkspaceStatAction, deleteWorkspaceStatAction,
  upsertWorkspaceGalleryImageAction, deleteWorkspaceGalleryImageAction,
  upsertWorkspaceMarqueeBandAction, deleteWorkspaceMarqueeBandAction,
  upsertWorkspaceMarqueeItemAction, deleteWorkspaceMarqueeItemAction,
  upsertWorkspaceAmenityAction, deleteWorkspaceAmenityAction,
  updateWorkspacePlanSectionAction, upsertWorkspacePlanAction, deleteWorkspacePlanAction,
  upsertWorkspacePlanFeatureAction, deleteWorkspacePlanFeatureAction, reorderWorkspaceItemsAction,
} from "@/features/admin/workspaces/actions";
import type { AdminWorkspaceEditorVM, AdminWorkspaceStatVM, AdminWorkspaceAmenityVM, AdminWorkspaceMarqueeBandVM, AdminWorkspaceMarqueeItemVM, AdminWorkspacePlanVM, AdminWorkspacePlanFeatureVM, AdminWorkspaceGalleryImageVM, MediaAssetVM } from "@/features/admin/types";
import { SortableList } from "@/components/admin/SortableList";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { ItemDialog } from "@/components/admin/ItemDialog";
import { MediaPickerModal } from "@/components/admin/media/MediaPickerModal";
import { useToast } from "@/components/admin/Toast";
import { Plus, ImageIcon, ChevronDown, ChevronRight } from "lucide-react";

const INPUT = "w-full bg-white/70 border border-neutral-300 rounded-xl px-4 py-3 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 transition";
const LABEL = "block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2";

type Tab = "basic" | "hero" | "stats" | "gallery" | "marquee" | "amenities" | "plans";
const TABS: { key: Tab; label: string }[] = [
  { key: "basic", label: "Basic" }, { key: "hero", label: "Hero" }, { key: "stats", label: "Stats" },
  { key: "gallery", label: "Gallery" }, { key: "marquee", label: "Marquee" },
  { key: "amenities", label: "Amenities" }, { key: "plans", label: "Plans" },
];
// -- Basic Tab -----------------------------------------------------------------
function BasicTab({ data }: { data: AdminWorkspaceEditorVM }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await updateWorkspaceAction({
        id: data.id, slug: data.slug,
        nav_label: (fd.get("nav_label") as string).trim(),
        card_title: (fd.get("card_title") as string).trim(),
        card_description: (fd.get("card_description") as string).trim(),
        hero_title: data.hero_title,
        hero_description: data.hero_description,
        cta_label: (fd.get("cta_label") as string).trim(),
        cta_href: (fd.get("cta_href") as string).trim(),
        video_label: (fd.get("video_label") as string).trim(),
        video_href: ((fd.get("video_href") as string).trim()) || null,
        sort_order: parseInt(fd.get("sort_order") as string, 10),
        is_active: fd.get("is_active") === "on",
        is_featured: fd.get("is_featured") === "on",
        meta_title: ((fd.get("meta_title") as string).trim()) || null,
        meta_description: ((fd.get("meta_description") as string).trim()) || null,
      });
      if (result.success) { showToast("Saved", "Workspace updated.", "success"); router.refresh(); }
      else showToast("Save failed", result.error, "error");
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-8">
      <div className="grid grid-cols-2 gap-5">
        <div><label className={LABEL}>Slug (read-only)</label><input value={data.slug} readOnly className={`${INPUT} opacity-60 cursor-not-allowed`} /></div>
        <div><label className={LABEL}>Nav Label</label><input name="nav_label" defaultValue={data.nav_label} required className={INPUT} /></div>
        <div><label className={LABEL}>Card Title</label><input name="card_title" defaultValue={data.card_title} required className={INPUT} /></div>
        <div><label className={LABEL}>Sort Order</label><input name="sort_order" type="number" defaultValue={data.sort_order} className={INPUT} /></div>
        <div className="col-span-2"><label className={LABEL}>Card Description</label><textarea name="card_description" defaultValue={data.card_description} required rows={2} className={`${INPUT} resize-y`} /></div>
        <div><label className={LABEL}>CTA Label</label><input name="cta_label" defaultValue={data.cta_label} required className={INPUT} /></div>
        <div><label className={LABEL}>CTA Href</label><input name="cta_href" defaultValue={data.cta_href} required className={INPUT} /></div>
        <div><label className={LABEL}>Video Label</label><input name="video_label" defaultValue={data.video_label} required className={INPUT} /></div>
        <div><label className={LABEL}>Video Href</label><input name="video_href" defaultValue={data.video_href ?? ""} className={INPUT} /></div>
        <div><label className={LABEL}>Meta Title</label><input name="meta_title" defaultValue={data.meta_title ?? ""} className={INPUT} /></div>
        <div><label className={LABEL}>Meta Description</label><input name="meta_description" defaultValue={data.meta_description ?? ""} className={INPUT} /></div>
      </div>
      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="is_active" defaultChecked={data.is_active} className="w-4 h-4" /> Active</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="is_featured" defaultChecked={data.is_featured} className="w-4 h-4" /> Featured</label>
      </div>
      <div className="flex justify-end">
        <button type="submit" disabled={isPending} className="bg-neutral-900 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-neutral-800 disabled:opacity-50">
          {isPending ? "Saving..." : "Save Basic Info"}
        </button>
      </div>
    </form>
  );
}
// -- Hero Tab ------------------------------------------------------------------
function HeroTab({ data }: { data: AdminWorkspaceEditorVM }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [heroImages, setHeroImages] = useState(data.hero_images);
  const [overviewImage, setOverviewImage] = useState(data.overview_image);
  const [activeSlot, setActiveSlot] = useState<number | null>(null);
  const [overviewPicking, setOverviewPicking] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleTextSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await updateWorkspaceAction({
        id: data.id, slug: data.slug, nav_label: data.nav_label, card_title: data.card_title,
        card_description: data.card_description, cta_label: data.cta_label, cta_href: data.cta_href,
        video_label: data.video_label, video_href: data.video_href, sort_order: data.sort_order,
        is_active: data.is_active, is_featured: data.is_featured, meta_title: data.meta_title,
        meta_description: data.meta_description,
        hero_title: (fd.get("hero_title") as string).trim(),
        hero_description: (fd.get("hero_description") as string).trim(),
      });
      if (result.success) { showToast("Saved", "Hero text updated.", "success"); router.refresh(); }
      else showToast("Save failed", result.error, "error");
    });
  };

  const handleHeroImageSelect = async (asset: MediaAssetVM) => {
    if (activeSlot === null) return;
    const slot = activeSlot; setActiveSlot(null);
    setHeroImages((prev) => prev.map((img) => img.slot === slot ? { ...img, image_asset_id: asset.id, image: { asset_id: asset.id, url: asset.file_url, alt: asset.alt_text, width: asset.width, height: asset.height } } : img));
    const result = await assignWorkspaceHeroImageAction({ workspace_id: data.id, slot, image_asset_id: asset.id });
    if (result.success) showToast("Image saved", "", "success");
    else { setHeroImages(data.hero_images); showToast("Failed", result.error, "error"); }
  };

  const handleOverviewImageSelect = async (asset: MediaAssetVM) => {
    setOverviewPicking(false);
    setOverviewImage({ asset_id: asset.id, url: asset.file_url, alt: asset.alt_text, width: asset.width, height: asset.height });
    const result = await assignWorkspaceOverviewImageAction({ workspace_id: data.id, image_asset_id: asset.id });
    if (result.success) showToast("Overview image saved", "", "success");
    else { setOverviewImage(data.overview_image); showToast("Failed", result.error, "error"); }
  };

  return (
    <div className="p-8 space-y-8">
      <form onSubmit={handleTextSubmit} className="space-y-5">
        <p className={LABEL}>Hero Text</p>
        <div><label className={LABEL}>Hero Title</label><input name="hero_title" defaultValue={data.hero_title} required className={INPUT} /></div>
        <div><label className={LABEL}>Hero Description</label><textarea name="hero_description" defaultValue={data.hero_description} required rows={4} className={`${INPUT} resize-y`} /></div>
        <div className="flex justify-end"><button type="submit" disabled={isPending} className="bg-neutral-900 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-neutral-800 disabled:opacity-50">{isPending ? "Saving..." : "Save Hero Text"}</button></div>
      </form>
      <div>
        <p className={`mb-3 ${LABEL}`}>Overview Card Image</p>
        <button type="button" onClick={() => setOverviewPicking(true)} className="w-48 h-32 rounded-xl border-2 border-dashed border-neutral-300 relative overflow-hidden group hover:border-neutral-500 transition-colors">
          {overviewImage ? (<><img src={overviewImage.url} alt="" className="absolute inset-0 w-full h-full object-cover" /><div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><span className="text-white text-xs font-semibold">Change</span></div></>) : (<div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-neutral-400"><ImageIcon className="w-6 h-6" /><span className="text-xs">Overview image</span></div>)}
        </button>
      </div>
      <div>
        <p className={`mb-3 ${LABEL}`}>Hero Images (3 slots)</p>
        <div className="grid grid-cols-3 gap-4">
          {heroImages.map((imgSlot) => (
            <div key={imgSlot.slot}>
              <p className="text-xs text-neutral-600 mb-1.5 font-medium">Slot {imgSlot.slot}</p>
              <button type="button" onClick={() => setActiveSlot(imgSlot.slot)} className="w-full aspect-[4/3] rounded-xl border-2 border-dashed border-neutral-300 bg-white/40 relative overflow-hidden group hover:border-neutral-500 transition-colors">
                {imgSlot.image ? (<><img src={imgSlot.image.url} alt="" className="absolute inset-0 w-full h-full object-cover" /><div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><span className="text-white text-xs font-semibold">Change</span></div></>) : (<div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-neutral-400"><ImageIcon className="w-6 h-6" /><span className="text-xs">Click to select</span></div>)}
              </button>
            </div>
          ))}
        </div>
      </div>
      <MediaPickerModal isOpen={activeSlot !== null} onClose={() => setActiveSlot(null)} onSelect={handleHeroImageSelect} />
      <MediaPickerModal isOpen={overviewPicking} onClose={() => setOverviewPicking(false)} onSelect={handleOverviewImageSelect} />
    </div>
  );
}
// -- Stats Tab -----------------------------------------------------------------
function StatsTab({ data }: { data: AdminWorkspaceEditorVM }) {
  const [stats, setStats] = useState<AdminWorkspaceStatVM[]>(data.stats);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<AdminWorkspaceStatVM | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const router = useRouter(); const { showToast } = useToast();
  const sorted = [...stats].sort((a, b) => a.sort_order - b.sort_order);

  function StatDialog({ isOpen, title, initial, statId, onClose }: { isOpen: boolean; title: string; initial?: Partial<AdminWorkspaceStatVM>; statId?: string; onClose: () => void }) {
    const [isPending, startTransition] = useTransition();
    const [err, setErr] = useState<string | null>(null);
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault(); const fd = new FormData(e.currentTarget);
      startTransition(async () => {
        const result = await upsertWorkspaceStatAction({ id: statId, workspace_id: data.id, value: (fd.get("value") as string).trim(), label: (fd.get("label") as string).trim(), sort_order: initial?.sort_order ?? sorted.length * 10, is_active: fd.get("is_active") === "on" });
        if (result.success) { showToast("Saved", "", "success"); onClose(); router.refresh(); } else setErr(result.error);
      });
    };
    return (<ItemDialog isOpen={isOpen} title={title} onClose={onClose}><form onSubmit={handleSubmit} className="space-y-4"><div><label className={LABEL}>Value</label><input name="value" defaultValue={initial?.value ?? ""} required className={INPUT} placeholder="500+" /></div><div><label className={LABEL}>Label</label><input name="label" defaultValue={initial?.label ?? ""} required className={INPUT} placeholder="Members" /></div><label className="flex items-center gap-2 text-sm"><input type="checkbox" name="is_active" defaultChecked={initial?.is_active ?? true} className="w-4 h-4" /> Active</label>{err && <p className="text-red-500 text-xs">{err}</p>}<div className="flex justify-end"><button type="submit" disabled={isPending} className="bg-neutral-900 text-white px-4 py-2 rounded-xl text-sm">{isPending ? "Saving..." : "Save"}</button></div></form></ItemDialog>);
  }

  const handleDelete = async () => { if (!deleteId) return; const result = await deleteWorkspaceStatAction(deleteId); setDeleteId(null); if (result.success) { setStats((s) => s.filter((x) => x.id !== deleteId)); showToast("Deleted", "", "success"); router.refresh(); } else showToast("Delete failed", result.error, "error"); };
  const handleReorder = async (reordered: AdminWorkspaceStatVM[]) => { const result = await reorderWorkspaceItemsAction("workspace_stats", reordered.map((s, i) => ({ id: s.id, sort_order: i * 10 }))); if (result.success) { showToast("Reordered", "", "success"); router.refresh(); } else showToast("Reorder failed", result.error, "error"); };

  return (<div className="p-8"><div className="flex items-center justify-between mb-4"><p className={LABEL}>Stats ({stats.length})</p><button type="button" onClick={() => setAddOpen(true)} className="flex items-center gap-1 bg-neutral-900 text-white px-3 py-2 rounded-xl text-xs font-semibold"><Plus className="w-3 h-3" /> Add</button></div><SortableList items={sorted} onReorder={handleReorder} renderItem={(stat, handle) => (<div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-2xl p-4 flex items-center gap-3">{handle}<div className="flex-1"><p className="font-bold text-neutral-900">{stat.value}</p><p className="text-xs text-neutral-500">{stat.label}</p></div><button type="button" onClick={() => setEditing(stat)} className="text-xs text-blue-600 px-2 py-1 rounded-lg hover:bg-blue-50">Edit</button><button type="button" onClick={() => setDeleteId(stat.id)} className="text-xs text-red-500 px-2 py-1 rounded-lg hover:bg-red-50">Del</button></div>)} />{sorted.length === 0 && <p className="text-neutral-400 text-sm text-center py-8">No stats yet.</p>}<StatDialog isOpen={addOpen} title="Add Stat" initial={{ sort_order: sorted.length * 10 }} onClose={() => setAddOpen(false)} />{editing && <StatDialog isOpen title="Edit Stat" initial={editing} statId={editing.id} onClose={() => setEditing(null)} />}<ConfirmDialog isOpen={!!deleteId} title="Delete Stat" message="Remove this stat?" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} /></div>);
}

// -- Gallery Tab ---------------------------------------------------------------
function GalleryTab({ data }: { data: AdminWorkspaceEditorVM }) {
  const [gallery, setGallery] = useState<AdminWorkspaceGalleryImageVM[]>(data.gallery);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [picking, setPicking] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const router = useRouter(); const { showToast } = useToast();
  const sorted = [...gallery].sort((a, b) => a.sort_order - b.sort_order);

  const handleAddImage = async (asset: MediaAssetVM) => { setPicking(false); const result = await upsertWorkspaceGalleryImageAction({ workspace_id: data.id, sort_order: gallery.length * 10, image_asset_id: asset.id, caption: null, is_active: true }); if (result.success) { showToast("Added", "", "success"); router.refresh(); } else showToast("Failed", result.error, "error"); };
  const handleChangeImage = async (asset: MediaAssetVM) => { if (!editingId) return; const existing = gallery.find((g) => g.id === editingId); if (!existing) return; setEditingId(null); const result = await upsertWorkspaceGalleryImageAction({ id: existing.id, workspace_id: data.id, sort_order: existing.sort_order, image_asset_id: asset.id, caption: existing.caption, is_active: existing.is_active }); if (result.success) { showToast("Updated", "", "success"); router.refresh(); } else showToast("Failed", result.error, "error"); };
  const handleDelete = async () => { if (!deleteId) return; const result = await deleteWorkspaceGalleryImageAction(deleteId); setDeleteId(null); if (result.success) { setGallery((g) => g.filter((x) => x.id !== deleteId)); showToast("Deleted", "", "success"); router.refresh(); } else showToast("Delete failed", result.error, "error"); };
  const handleReorder = async (reordered: AdminWorkspaceGalleryImageVM[]) => { const result = await reorderWorkspaceItemsAction("workspace_gallery_images", reordered.map((g, i) => ({ id: g.id, sort_order: i * 10 }))); if (result.success) { showToast("Reordered", "", "success"); router.refresh(); } else showToast("Reorder failed", result.error, "error"); };

  return (<div className="p-8"><div className="flex items-center justify-between mb-4"><p className={LABEL}>Gallery ({gallery.length})</p><button type="button" onClick={() => setPicking(true)} className="flex items-center gap-1 bg-neutral-900 text-white px-3 py-2 rounded-xl text-xs font-semibold"><Plus className="w-3 h-3" /> Add Image</button></div><SortableList items={sorted} onReorder={handleReorder} renderItem={(img, handle) => (<div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-2xl p-4 flex items-center gap-3">{handle}<button type="button" onClick={() => setEditingId(img.id)} className="w-16 h-12 rounded-lg border border-neutral-200 overflow-hidden flex-shrink-0">{img.image ? <img src={img.image.url} alt="" className="w-full h-full object-cover" /> : <ImageIcon className="w-4 h-4 text-neutral-300 m-auto" />}</button><div className="flex-1 min-w-0"><p className="text-xs text-neutral-500 truncate">{img.caption ?? "No caption"}</p></div><button type="button" onClick={() => setDeleteId(img.id)} className="text-xs text-red-500 px-2 py-1 rounded-lg hover:bg-red-50">Del</button></div>)} />{sorted.length === 0 && <p className="text-neutral-400 text-sm text-center py-8">No gallery images yet.</p>}<MediaPickerModal isOpen={picking} onClose={() => setPicking(false)} onSelect={handleAddImage} /><MediaPickerModal isOpen={!!editingId} onClose={() => setEditingId(null)} onSelect={handleChangeImage} /><ConfirmDialog isOpen={!!deleteId} title="Remove Image" message="Remove this image from the gallery?" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} /></div>);
}
// -- Amenities Tab -------------------------------------------------------------
function AmenitiesTab({ data }: { data: AdminWorkspaceEditorVM }) {
  const [amenities, setAmenities] = useState<AdminWorkspaceAmenityVM[]>(data.amenities);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<AdminWorkspaceAmenityVM | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const router = useRouter(); const { showToast } = useToast();
  const sorted = [...amenities].sort((a, b) => a.sort_order - b.sort_order);

  function AmenityDialog({ isOpen, title, initial, amenityId, onClose }: { isOpen: boolean; title: string; initial?: Partial<AdminWorkspaceAmenityVM>; amenityId?: string; onClose: () => void }) {
    const [isPending, startTransition] = useTransition();
    const [err, setErr] = useState<string | null>(null);
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault(); const fd = new FormData(e.currentTarget);
      startTransition(async () => {
        const result = await upsertWorkspaceAmenityAction({ id: amenityId, workspace_id: data.id, icon_key: (fd.get("icon_key") as string).trim(), label: (fd.get("label") as string).trim(), sort_order: initial?.sort_order ?? sorted.length * 10, is_active: fd.get("is_active") === "on" });
        if (result.success) { showToast("Saved", "", "success"); onClose(); router.refresh(); } else setErr(result.error);
      });
    };
    return (<ItemDialog isOpen={isOpen} title={title} onClose={onClose}><form onSubmit={handleSubmit} className="space-y-4"><div><label className={LABEL}>Icon Key (e.g. wifi, coffee)</label><input name="icon_key" defaultValue={initial?.icon_key ?? ""} required className={INPUT} /></div><div><label className={LABEL}>Label</label><input name="label" defaultValue={initial?.label ?? ""} required className={INPUT} /></div><label className="flex items-center gap-2 text-sm"><input type="checkbox" name="is_active" defaultChecked={initial?.is_active ?? true} className="w-4 h-4" /> Active</label>{err && <p className="text-red-500 text-xs">{err}</p>}<div className="flex justify-end"><button type="submit" disabled={isPending} className="bg-neutral-900 text-white px-4 py-2 rounded-xl text-sm">{isPending ? "Saving..." : "Save"}</button></div></form></ItemDialog>);
  }

  const handleDelete = async () => { if (!deleteId) return; const result = await deleteWorkspaceAmenityAction(deleteId); setDeleteId(null); if (result.success) { setAmenities((a) => a.filter((x) => x.id !== deleteId)); showToast("Deleted", "", "success"); router.refresh(); } else showToast("Delete failed", result.error, "error"); };
  const handleReorder = async (reordered: AdminWorkspaceAmenityVM[]) => { const result = await reorderWorkspaceItemsAction("workspace_amenities", reordered.map((a, i) => ({ id: a.id, sort_order: i * 10 }))); if (result.success) { showToast("Reordered", "", "success"); router.refresh(); } else showToast("Reorder failed", result.error, "error"); };

  return (<div className="p-8"><div className="flex items-center justify-between mb-4"><p className={LABEL}>Amenities ({amenities.length})</p><button type="button" onClick={() => setAddOpen(true)} className="flex items-center gap-1 bg-neutral-900 text-white px-3 py-2 rounded-xl text-xs font-semibold"><Plus className="w-3 h-3" /> Add</button></div><SortableList items={sorted} onReorder={handleReorder} renderItem={(a, handle) => (<div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-2xl p-4 flex items-center gap-3">{handle}<div className="flex-1"><p className="font-semibold text-sm text-neutral-900">{a.label}</p><p className="text-xs text-neutral-500">{a.icon_key}</p></div><button type="button" onClick={() => setEditing(a)} className="text-xs text-blue-600 px-2 py-1 rounded-lg hover:bg-blue-50">Edit</button><button type="button" onClick={() => setDeleteId(a.id)} className="text-xs text-red-500 px-2 py-1 rounded-lg hover:bg-red-50">Del</button></div>)} />{sorted.length === 0 && <p className="text-neutral-400 text-sm text-center py-8">No amenities yet.</p>}<AmenityDialog isOpen={addOpen} title="Add Amenity" onClose={() => setAddOpen(false)} />{editing && <AmenityDialog isOpen title="Edit Amenity" initial={editing} amenityId={editing.id} onClose={() => setEditing(null)} />}<ConfirmDialog isOpen={!!deleteId} title="Delete Amenity" message="Remove this amenity?" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} /></div>);
}

// -- Marquee Tab ---------------------------------------------------------------
function MarqueeTab({ data }: { data: AdminWorkspaceEditorVM }) {
  const [bands, setBands] = useState<AdminWorkspaceMarqueeBandVM[]>(data.marquee_bands);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [editItem, setEditItem] = useState<{ bandId: string; item?: AdminWorkspaceMarqueeItemVM } | null>(null);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const router = useRouter(); const { showToast } = useToast();
  const sorted = [...bands].sort((a, b) => a.sort_order - b.sort_order);

  function BandDialog({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [isPending, startTransition] = useTransition();
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault(); const fd = new FormData(e.currentTarget);
      startTransition(async () => {
        const result = await upsertWorkspaceMarqueeBandAction({ workspace_id: data.id, theme: fd.get("theme") as "light" | "dark", reverse: fd.get("reverse") === "on", sort_order: sorted.length * 10, is_active: true });
        if (result.success) { showToast("Created", "", "success"); onClose(); router.refresh(); } else showToast("Failed", result.error, "error");
      });
    };
    return (<ItemDialog isOpen={isOpen} title="Add Marquee Band" onClose={onClose}><form onSubmit={handleSubmit} className="space-y-4"><div><label className={LABEL}>Theme</label><select name="theme" className={INPUT}><option value="dark">Dark (orange)</option><option value="light">Light (lime)</option></select></div><label className="flex items-center gap-2 text-sm"><input type="checkbox" name="reverse" className="w-4 h-4" /> Reverse direction</label><div className="flex justify-end"><button type="submit" disabled={isPending} className="bg-neutral-900 text-white px-4 py-2 rounded-xl text-sm">Create</button></div></form></ItemDialog>);
  }

  function MarqueeItemDialog({ isOpen, bandId, item, onClose }: { isOpen: boolean; bandId: string; item?: AdminWorkspaceMarqueeItemVM; onClose: () => void }) {
    const [isPending, startTransition] = useTransition();
    const band = bands.find((b) => b.id === bandId);
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault(); const fd = new FormData(e.currentTarget);
      startTransition(async () => {
        const result = await upsertWorkspaceMarqueeItemAction({ id: item?.id, band_id: bandId, item_text: (fd.get("item_text") as string).trim(), sort_order: item?.sort_order ?? (band?.items.length ?? 0) * 10, is_active: true });
        if (result.success) { showToast("Saved", "", "success"); onClose(); router.refresh(); } else showToast("Failed", result.error, "error");
      });
    };
    return (<ItemDialog isOpen={isOpen} title={item ? "Edit Item" : "Add Item"} onClose={onClose}><form onSubmit={handleSubmit} className="space-y-4"><div><label className={LABEL}>Item Text</label><input name="item_text" defaultValue={item?.item_text ?? ""} required className={INPUT} placeholder="Coworking Spaces" /></div><div className="flex justify-end"><button type="submit" disabled={isPending} className="bg-neutral-900 text-white px-4 py-2 rounded-xl text-sm">{isPending ? "Saving..." : "Save"}</button></div></form></ItemDialog>);
  }

  const handleDeleteBand = async () => { if (!deleteId) return; const result = await deleteWorkspaceMarqueeBandAction(deleteId); setDeleteId(null); if (result.success) { setBands((b) => b.filter((x) => x.id !== deleteId)); showToast("Deleted", "", "success"); router.refresh(); } else showToast("Delete failed", result.error, "error"); };
  const handleDeleteItem = async () => { if (!deleteItemId) return; const result = await deleteWorkspaceMarqueeItemAction(deleteItemId); setDeleteItemId(null); if (result.success) { showToast("Deleted", "", "success"); router.refresh(); } else showToast("Delete failed", result.error, "error"); };

  return (<div className="p-8"><div className="flex items-center justify-between mb-4"><p className={LABEL}>Marquee Bands ({bands.length})</p><button type="button" onClick={() => setAddOpen(true)} className="flex items-center gap-1 bg-neutral-900 text-white px-3 py-2 rounded-xl text-xs font-semibold"><Plus className="w-3 h-3" /> Add Band</button></div><div className="space-y-3">{sorted.map((band) => (<div key={band.id} className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-2xl overflow-hidden"><div className="p-4 flex items-center gap-3 cursor-pointer" onClick={() => setExpanded(expanded === band.id ? null : band.id)}><div className="flex-1"><p className="font-semibold text-sm">{band.theme === "dark" ? "Dark (Orange)" : "Light (Lime)"}</p><p className="text-xs text-neutral-500">{band.reverse ? "Reversed" : "Forward"} — {band.items.length} items</p></div><button type="button" onClick={(e) => { e.stopPropagation(); setDeleteId(band.id); }} className="text-xs text-red-500 px-2 py-1 rounded-lg hover:bg-red-50">Del</button>{expanded === band.id ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}</div>{expanded === band.id && (<div className="border-t border-white/30 p-4 space-y-2"><div className="flex items-center justify-between mb-2"><p className={LABEL}>Items</p><button type="button" onClick={() => setEditItem({ bandId: band.id })} className="flex items-center gap-1 bg-neutral-800 text-white px-3 py-1.5 rounded-lg text-xs font-semibold"><Plus className="w-3 h-3" /> Add Item</button></div>{band.items.map((item) => (<div key={item.id} className="bg-white/60 rounded-xl p-3 flex items-center gap-2"><p className="flex-1 text-sm">{item.item_text}</p><button type="button" onClick={() => setEditItem({ bandId: band.id, item })} className="text-xs text-blue-600 px-2 py-1 rounded-lg hover:bg-blue-50">Edit</button><button type="button" onClick={() => setDeleteItemId(item.id)} className="text-xs text-red-500 px-2 py-1 rounded-lg hover:bg-red-50">Del</button></div>))}{band.items.length === 0 && <p className="text-neutral-400 text-xs text-center py-3">No items yet.</p>}</div>)}</div>))}{sorted.length === 0 && <p className="text-neutral-400 text-sm text-center py-8">No marquee bands yet.</p>}</div><BandDialog isOpen={addOpen} onClose={() => setAddOpen(false)} />{editItem && <MarqueeItemDialog isOpen bandId={editItem.bandId} item={editItem.item} onClose={() => setEditItem(null)} />}<ConfirmDialog isOpen={!!deleteId} title="Delete Band" message="Delete this marquee band and all its items?" onConfirm={handleDeleteBand} onCancel={() => setDeleteId(null)} /><ConfirmDialog isOpen={!!deleteItemId} title="Delete Item" message="Remove this item?" onConfirm={handleDeleteItem} onCancel={() => setDeleteItemId(null)} /></div>);
}
// -- Plans Tab -----------------------------------------------------------------
function PlansTab({ data }: { data: AdminWorkspaceEditorVM }) {
  const [plans, setPlans] = useState<AdminWorkspacePlanVM[]>(data.plan_section?.plans ?? []);
  const [sectionEdit, setSectionEdit] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<AdminWorkspacePlanVM | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [expandedPlan, setExpandedPlan] = useState<string | null>(null);
  const [addFeatureFor, setAddFeatureFor] = useState<string | null>(null);
  const [editFeature, setEditFeature] = useState<AdminWorkspacePlanFeatureVM | null>(null);
  const [deleteFeatureId, setDeleteFeatureId] = useState<string | null>(null);
  const router = useRouter(); const { showToast } = useToast();
  const sorted = [...plans].sort((a, b) => a.sort_order - b.sort_order);

  function PlanDialog({ isOpen, title, initial, planId, onClose }: { isOpen: boolean; title: string; initial?: Partial<AdminWorkspacePlanVM>; planId?: string; onClose: () => void }) {
    const [isPending, startTransition] = useTransition();
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault(); if (!data.plan_section) return; const fd = new FormData(e.currentTarget);
      startTransition(async () => {
        const result = await upsertWorkspacePlanAction({ id: planId, section_id: data.plan_section!.id, title: (fd.get("title") as string).trim(), icon_key: (fd.get("icon_key") as string).trim(), price_text: ((fd.get("price_text") as string).trim()) || null, sort_order: initial?.sort_order ?? sorted.length * 10, is_active: fd.get("is_active") === "on" });
        if (result.success) { showToast("Saved", "", "success"); onClose(); router.refresh(); } else showToast("Failed", result.error, "error");
      });
    };
    return (<ItemDialog isOpen={isOpen} title={title} onClose={onClose}><form onSubmit={handleSubmit} className="space-y-4"><div><label className={LABEL}>Title</label><input name="title" defaultValue={initial?.title ?? ""} required className={INPUT} /></div><div><label className={LABEL}>Icon Key</label><input name="icon_key" defaultValue={initial?.icon_key ?? "briefcase"} required className={INPUT} /></div><div><label className={LABEL}>Price Text</label><input name="price_text" defaultValue={initial?.price_text ?? ""} className={INPUT} /></div><label className="flex items-center gap-2 text-sm"><input type="checkbox" name="is_active" defaultChecked={initial?.is_active ?? true} className="w-4 h-4" /> Active</label><div className="flex justify-end"><button type="submit" className="bg-neutral-900 text-white px-4 py-2 rounded-xl text-sm">Save</button></div></form></ItemDialog>);
  }

  function FeatureDialog({ isOpen, planId, feature, onClose }: { isOpen: boolean; planId: string; feature?: AdminWorkspacePlanFeatureVM; onClose: () => void }) {
    const [isPending, startTransition] = useTransition();
    const plan = plans.find((p) => p.id === planId);
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault(); const fd = new FormData(e.currentTarget);
      startTransition(async () => {
        const result = await upsertWorkspacePlanFeatureAction({ id: feature?.id, plan_id: planId, feature_text: (fd.get("feature_text") as string).trim(), is_included: fd.get("is_included") === "on", sort_order: feature?.sort_order ?? (plan?.features.length ?? 0) * 10 });
        if (result.success) { showToast("Saved", "", "success"); onClose(); router.refresh(); } else showToast("Failed", result.error, "error");
      });
    };
    return (<ItemDialog isOpen={isOpen} title={feature ? "Edit Feature" : "Add Feature"} onClose={onClose}><form onSubmit={handleSubmit} className="space-y-4"><div><label className={LABEL}>Feature Text</label><input name="feature_text" defaultValue={feature?.feature_text ?? ""} required className={INPUT} /></div><label className="flex items-center gap-2 text-sm"><input type="checkbox" name="is_included" defaultChecked={feature?.is_included ?? true} className="w-4 h-4" /> Included</label><div className="flex justify-end"><button type="submit" disabled={isPending} className="bg-neutral-900 text-white px-4 py-2 rounded-xl text-sm">{isPending ? "Saving..." : "Save"}</button></div></form></ItemDialog>);
  }

  const handleDeletePlan = async () => { if (!deleteId) return; const result = await deleteWorkspacePlanAction(deleteId); setDeleteId(null); if (result.success) { setPlans((p) => p.filter((x) => x.id !== deleteId)); showToast("Deleted", "", "success"); router.refresh(); } else showToast("Delete failed", result.error, "error"); };
  const handleDeleteFeature = async () => { if (!deleteFeatureId) return; const result = await deleteWorkspacePlanFeatureAction(deleteFeatureId); setDeleteFeatureId(null); if (result.success) { showToast("Deleted", "", "success"); router.refresh(); } else showToast("Delete failed", result.error, "error"); };

  if (!data.plan_section) return <div className="p-8 text-neutral-500 text-sm">No plan section found.</div>;

  return (<div className="p-8">
    {sectionEdit ? (
      <form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); const [isPending, startTransition] = [false, (fn: () => Promise<void>) => fn()]; startTransition(async () => { const result = await updateWorkspacePlanSectionAction({ id: data.plan_section!.id, badge_text: (fd.get("badge_text") as string).trim(), title: (fd.get("title") as string).trim() }); if (result.success) { showToast("Saved", "", "success"); setSectionEdit(false); router.refresh(); } else showToast("Failed", result.error, "error"); }); }} className="mb-6 space-y-3 p-4 bg-white/40 rounded-2xl border border-white/60">
        <p className={LABEL}>Plan Section Header</p>
        <div className="grid grid-cols-2 gap-3"><div><label className={LABEL}>Badge Text</label><input name="badge_text" defaultValue={data.plan_section.badge_text} required className={INPUT} /></div><div><label className={LABEL}>Title</label><input name="title" defaultValue={data.plan_section.title} required className={INPUT} /></div></div>
        <div className="flex gap-2 justify-end"><button type="button" onClick={() => setSectionEdit(false)} className="text-sm text-neutral-500 px-3 py-1.5 rounded-lg">Cancel</button><button type="submit" className="bg-neutral-900 text-white px-4 py-1.5 rounded-xl text-sm">Save</button></div>
      </form>
    ) : (
      <div className="flex items-center justify-between mb-4"><div><p className="font-semibold text-neutral-900">{data.plan_section.title}</p><p className="text-xs text-neutral-500">{data.plan_section.badge_text}</p></div><button type="button" onClick={() => setSectionEdit(true)} className="text-xs text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-50">Edit Header</button></div>
    )}
    <div className="flex items-center justify-between mb-3"><p className={LABEL}>Plans ({plans.length})</p><button type="button" onClick={() => setAddOpen(true)} className="flex items-center gap-1 bg-neutral-900 text-white px-3 py-2 rounded-xl text-xs font-semibold"><Plus className="w-3 h-3" /> Add Plan</button></div>
    <div className="space-y-3">{sorted.map((plan) => (<div key={plan.id} className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-2xl overflow-hidden"><div className="p-4 flex items-center gap-3 cursor-pointer" onClick={() => setExpandedPlan(expandedPlan === plan.id ? null : plan.id)}><div className="flex-1"><p className="font-semibold text-sm">{plan.title}</p><p className="text-xs text-neutral-500">{plan.price_text ?? "No price"} — {plan.features.length} features</p></div><button type="button" onClick={(e) => { e.stopPropagation(); setEditing(plan); }} className="text-xs text-blue-600 px-2 py-1 rounded-lg hover:bg-blue-50">Edit</button><button type="button" onClick={(e) => { e.stopPropagation(); setDeleteId(plan.id); }} className="text-xs text-red-500 px-2 py-1 rounded-lg hover:bg-red-50">Del</button>{expandedPlan === plan.id ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}</div>{expandedPlan === plan.id && (<div className="border-t border-white/30 p-4 space-y-2"><div className="flex items-center justify-between mb-2"><p className={LABEL}>Features</p><button type="button" onClick={() => setAddFeatureFor(plan.id)} className="flex items-center gap-1 bg-neutral-800 text-white px-3 py-1.5 rounded-lg text-xs font-semibold"><Plus className="w-3 h-3" /> Add Feature</button></div>{plan.features.map((feat) => (<div key={feat.id} className="bg-white/60 rounded-xl p-3 flex items-center gap-2"><span className={`w-4 h-4 rounded-full flex-shrink-0 ${feat.is_included ? "bg-green-500" : "bg-neutral-300"}`} /><p className="flex-1 text-sm">{feat.feature_text}</p><button type="button" onClick={() => setEditFeature(feat)} className="text-xs text-blue-600 px-2 py-1 rounded-lg hover:bg-blue-50">Edit</button><button type="button" onClick={() => setDeleteFeatureId(feat.id)} className="text-xs text-red-500 px-2 py-1 rounded-lg hover:bg-red-50">Del</button></div>))}{plan.features.length === 0 && <p className="text-neutral-400 text-xs text-center py-3">No features yet.</p>}</div>)}</div>))}{sorted.length === 0 && <p className="text-neutral-400 text-sm text-center py-8">No plans yet.</p>}</div>
    <PlanDialog isOpen={addOpen} title="Add Plan" onClose={() => setAddOpen(false)} />{editing && <PlanDialog isOpen title="Edit Plan" initial={editing} planId={editing.id} onClose={() => setEditing(null)} />}{addFeatureFor && <FeatureDialog isOpen planId={addFeatureFor} onClose={() => setAddFeatureFor(null)} />}{editFeature && <FeatureDialog isOpen planId={editFeature.plan_id} feature={editFeature} onClose={() => setEditFeature(null)} />}<ConfirmDialog isOpen={!!deleteId} title="Delete Plan" message="Delete this plan and all its features?" onConfirm={handleDeletePlan} onCancel={() => setDeleteId(null)} /><ConfirmDialog isOpen={!!deleteFeatureId} title="Delete Feature" message="Remove this feature?" onConfirm={handleDeleteFeature} onCancel={() => setDeleteFeatureId(null)} />
  </div>);
}

// -- Main WorkspaceForm --------------------------------------------------------
export function WorkspaceForm({ data }: { data: AdminWorkspaceEditorVM }) {
  const [activeTab, setActiveTab] = useState<Tab>("basic");
  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="flex items-center justify-between px-8 py-5 border-b border-white/30 bg-white/20 backdrop-blur-sm shrink-0">
        <div>
          <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-widest mb-0.5">Workspaces</p>
          <h1 className="text-xl font-bold text-neutral-900">{data.card_title}</h1>
          <p className="text-xs text-neutral-400 mt-0.5">/{data.slug}</p>
        </div>
        <a href={`/workspaces/${data.slug}`} target="_blank" rel="noreferrer" className="text-xs text-neutral-500 underline">View public page</a>
      </div>
      <div className="flex border-b border-white/20 bg-white/10 shrink-0 overflow-x-auto">
        {TABS.map((tab) => (
          <button key={tab.key} type="button" onClick={() => setActiveTab(tab.key)} className={`px-5 py-3 text-sm font-semibold whitespace-nowrap transition-colors ${activeTab === tab.key ? "border-b-2 border-neutral-900 text-neutral-900" : "text-neutral-500 hover:text-neutral-700"}`}>{tab.label}</button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto min-h-0">
        {activeTab === "basic" && <BasicTab data={data} />}
        {activeTab === "hero" && <HeroTab data={data} />}
        {activeTab === "stats" && <StatsTab data={data} />}
        {activeTab === "gallery" && <GalleryTab data={data} />}
        {activeTab === "marquee" && <MarqueeTab data={data} />}
        {activeTab === "amenities" && <AmenitiesTab data={data} />}
        {activeTab === "plans" && <PlansTab data={data} />}
      </div>
    </div>
  );
}
