"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import {
  listMediaAction,
  updateMediaAssetAction,
  deleteMediaAssetAction,
} from "@/features/admin/media/actions";
import { MediaAssetVM } from "@/features/admin/types";
import { ImageUploadZone } from "./ImageUploadZone";
import { Clipboard, Save } from "lucide-react";
import { ToastStack, type ToastData } from "@/components/admin/Toast";

type ToastVariant = ToastData["variant"];

type MediaDraft = {
  alt_text: string;
  folder: string;
  is_published: boolean;
};

const PANEL =
  "bg-white/35 backdrop-blur-xl rounded-2xl border border-white/60 shadow-[0_18px_60px_rgba(0,0,0,0.08)]";
const FIELD =
  "w-full rounded-xl border border-white/60 bg-white/60 px-3 py-2 text-sm text-neutral-900 shadow-inner shadow-white/40 focus:outline-none focus:ring-2 focus:ring-neutral-900/10";
const DETAIL_LABEL =
  "text-[11px] font-semibold text-neutral-500 uppercase tracking-[0.14em] block mb-1.5";

function toastId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random()}`;
}

function fallbackCopyText(value: string) {
  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  textarea.style.top = "0";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  textarea.setSelectionRange(0, textarea.value.length);

  const copied = document.execCommand("copy");
  document.body.removeChild(textarea);

  if (!copied) {
    throw new Error("Copy command failed");
  }
}

async function copyText(value: string) {
  if (navigator.clipboard?.writeText && window.isSecureContext) {
    await navigator.clipboard.writeText(value);
    return;
  }

  fallbackCopyText(value);
}

function CopyButton({
  value,
  label,
  onToast,
}: {
  value: string;
  label: string;
  onToast: (title: string, message?: string, variant?: ToastVariant) => void;
}) {
  const [isCopying, setIsCopying] = useState(false);

  const copy = async () => {
    if (isCopying) return;
    setIsCopying(true);
    try {
      await copyText(value);
      onToast(`${label} copied`, value, "copied");
    } catch {
      onToast("Copy failed", "Select the value and copy it manually.", "error");
    } finally {
      setIsCopying(false);
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      disabled={isCopying}
      title={`Copy ${label}`}
      className="shrink-0 text-neutral-400 hover:text-neutral-800 transition-colors disabled:opacity-50"
    >
      <Clipboard size={13} />
    </button>
  );
}

function draftFromAsset(asset: MediaAssetVM): MediaDraft {
  return {
    alt_text: asset.alt_text ?? "",
    folder: asset.folder ?? "",
    is_published: asset.is_published,
  };
}

export function MediaLibrary({ isModal = false, onSelect }: { isModal?: boolean, onSelect?: (asset: MediaAssetVM) => void }) {
  const [assets, setAssets] = useState<MediaAssetVM[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [folder, setFolder] = useState("");
  const [sort, setSort] = useState<"newest" | "oldest" | "name_asc" | "name_desc">("newest");
  const [selectedAsset, setSelectedAsset] = useState<MediaAssetVM | null>(null);
  const [draft, setDraft] = useState<MediaDraft | null>(null);
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const [isSaving, startSaving] = useTransition();

  const showToast = (title: string, message?: string, variant: ToastVariant = "success") => {
    setToasts((prev) => [...prev, { id: toastId(), title, message, variant }]);
  };
  const dismissToast = (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id));

  const fetchAssets = useCallback(async () => {
    const res = await listMediaAction({ search, folder, sort });
    setAssets(res.items);
    setTotal(res.total);
    setSelectedAsset((current) => {
      if (!current) return current;
      return res.items.find((item) => item.id === current.id) ?? null;
    });
  }, [folder, search, sort]);

  useEffect(() => {
    let isCurrent = true;

    listMediaAction({ search, folder, sort }).then((res) => {
      if (!isCurrent) return;

      setAssets(res.items);
      setTotal(res.total);
      setSelectedAsset((current) => {
        if (!current) return current;
        return res.items.find((item) => item.id === current.id) ?? null;
      });
    });

    return () => {
      isCurrent = false;
    };
  }, [folder, search, sort]);

  const selectAsset = (asset: MediaAssetVM) => {
    setSelectedAsset(asset);
    setDraft(draftFromAsset(asset));
  };

  const updateSelectedAsset = (asset: MediaAssetVM) => {
    setSelectedAsset(asset);
    setDraft(draftFromAsset(asset));
    setAssets((current) =>
      current.map((item) => (item.id === asset.id ? asset : item))
    );
  };

  const handleUploadSuccess = useCallback((asset?: MediaAssetVM) => {
    if (asset) {
      setAssets((current) => {
        const exists = current.some((item) => item.id === asset.id);
        return exists
          ? current.map((item) => (item.id === asset.id ? asset : item))
          : [asset, ...current];
      });
      setTotal((current) => current + 1);
      setSelectedAsset(asset);
      setDraft(draftFromAsset(asset));
    }
    fetchAssets();
  }, [fetchAssets]);

  const handleSaveDetails = () => {
    if (!selectedAsset || !draft) return;

    startSaving(async () => {
      const result = await updateMediaAssetAction({
        id: selectedAsset.id,
        alt_text: draft.alt_text.trim() || null,
        folder: draft.folder.trim() || null,
        is_published: draft.is_published,
      });

      if (result.success && result.data) {
        updateSelectedAsset(result.data);
        showToast("Saved changes", result.data.file_name ?? result.data.id, "success");
      } else if (!result.success) {
        showToast("Save failed", result.error, "error");
      }
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this asset?")) {
      const result = await deleteMediaAssetAction(id);
      if (result.success) {
        setSelectedAsset(null);
        setDraft(null);
        showToast("Asset deleted", id, "success");
        fetchAssets();
      } else {
        showToast("Delete failed", result.error, "error");
      }
    }
  };

  return (
    <div className={`flex flex-col h-full ${isModal ? '' : 'p-8 max-w-7xl'}`}>
      {!isModal && (
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-neutral-900">Media Library</h1>
          <p className="text-sm text-neutral-500">Manage all your image assets. {total} shown.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full min-h-0">
        <div className="md:col-span-2 flex flex-col h-full min-h-0">
          <div className="mb-6">
            <ImageUploadZone onUploadSuccess={handleUploadSuccess} />
          </div>

          <div className={`${PANEL} flex flex-col min-h-0 flex-1 overflow-hidden`}>
            <div className="p-4 border-b border-white/40 flex gap-4">
              <input 
                type="search" 
                placeholder="Search by name, alt text, folder, MIME, ImageKit ID, or DB ID..."
                className="flex-1 rounded-xl border border-neutral-200 bg-white/60 px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <select 
                className="rounded-xl border border-white/60 bg-white/60 px-3 py-2 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/10"
                value={folder}
                onChange={e => setFolder(e.target.value)}
              >
                <option value="">All Folders</option>
                <option value="/admin_uploads">admin_uploads</option>
              </select>
              <select
                className="rounded-xl border border-white/60 bg-white/60 px-3 py-2 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/10"
                value={sort}
                onChange={e => setSort(e.target.value as typeof sort)}
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="name_asc">A-Z</option>
                <option value="name_desc">Z-A</option>
              </select>
            </div>
            
            <div className="p-4 overflow-y-auto flex-1 grid grid-cols-3 sm:grid-cols-4 gap-2 content-start">
              {assets.map((asset) => (
                <div 
                  key={asset.id} 
                  onClick={() => selectAsset(asset)}
                  className={`border rounded-2xl overflow-hidden cursor-pointer group relative aspect-square bg-white/50 ${selectedAsset?.id === asset.id ? 'border-neutral-900 ring-2 ring-neutral-900/10' : 'border-white/60 hover:border-neutral-300'}`}
                >
                  <img src={asset.file_url} alt={asset.alt_text || asset.file_name || 'Asset'} className="w-full h-full object-cover" />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2 text-white text-xs truncate opacity-0 group-hover:opacity-100 transition-opacity">
                    {asset.file_name}
                  </div>
                </div>
              ))}
              {assets.length === 0 && (
                <div className="col-span-full py-8 text-center text-neutral-500 text-sm">No assets found.</div>
              )}
            </div>
          </div>
        </div>

        <div className={`${PANEL} p-4 overflow-y-auto`}>
          <h3 className="font-semibold text-neutral-900 mb-4">Asset Details</h3>
          {selectedAsset ? (
            <div className="space-y-4">
              <div className="aspect-video bg-white/45 rounded-2xl overflow-hidden border border-white/60 flex items-center justify-center">
                <img src={selectedAsset.file_url} alt={selectedAsset.alt_text || ""} className="max-w-full max-h-full object-contain" />
              </div>
              
              {isModal && onSelect && (
                <button 
                  type="button"
                  onClick={() => onSelect(selectedAsset)}
                  className="w-full bg-neutral-950 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-neutral-800 transition-colors"
                >
                  Use Selected
                </button>
              )}

              <div className="space-y-3 text-sm">
                <div>
                  <label className={DETAIL_LABEL}>File Name</label>
                  <div className="flex items-start gap-1.5">
                    <span className="text-neutral-900 break-all flex-1">{selectedAsset.file_name}</span>
                    {selectedAsset.file_name && <CopyButton value={selectedAsset.file_name} label="File name" onToast={showToast} />}
                  </div>
                </div>
                <div>
                  <label className={DETAIL_LABEL}>Mime Type</label>
                  <div className="text-neutral-900">{selectedAsset.mime_type}</div>
                </div>
                <div>
                  <label className={DETAIL_LABEL}>Dimensions</label>
                  <div className="text-neutral-900">{selectedAsset.width && selectedAsset.height ? `${selectedAsset.width} x ${selectedAsset.height}` : 'Unknown'}</div>
                </div>
                <div>
                  <label className={DETAIL_LABEL}>Url</label>
                  <div className="flex items-start gap-1.5">
                    <span className="text-neutral-500 font-mono text-xs break-all flex-1">{selectedAsset.file_url}</span>
                    <CopyButton value={selectedAsset.file_url} label="URL" onToast={showToast} />
                  </div>
                </div>
                <div>
                  <label className={DETAIL_LABEL}>ImageKit ID</label>
                  <div className="flex items-start gap-1.5">
                    <span className="text-neutral-500 font-mono text-xs break-all flex-1">{selectedAsset.provider_file_id || '-'}</span>
                    {selectedAsset.provider_file_id && <CopyButton value={selectedAsset.provider_file_id} label="ImageKit ID" onToast={showToast} />}
                  </div>
                </div>
                <div>
                  <label className={DETAIL_LABEL}>DB ID</label>
                  <div className="flex items-start gap-1.5">
                    <span className="text-neutral-500 font-mono text-xs break-all flex-1">{selectedAsset.id}</span>
                    <CopyButton value={selectedAsset.id} label="DB ID" onToast={showToast} />
                  </div>
                </div>

                {!isModal && draft && (
                  <div className="pt-4 border-t border-white/50 space-y-3">
                    <div>
                      <label className={DETAIL_LABEL}>Alt Text</label>
                      <textarea
                        value={draft.alt_text}
                        onChange={(event) =>
                          setDraft((current) =>
                            current ? { ...current, alt_text: event.target.value } : current
                          )
                        }
                        rows={3}
                        className={`${FIELD} resize-none`}
                        placeholder="Describe the image for accessibility"
                      />
                    </div>
                    <div>
                      <label className={DETAIL_LABEL}>Folder</label>
                      <input
                        value={draft.folder}
                        onChange={(event) =>
                          setDraft((current) =>
                            current ? { ...current, folder: event.target.value } : current
                          )
                        }
                        className={FIELD}
                        placeholder="/admin_uploads"
                      />
                    </div>
                    <label className="flex items-center gap-2 rounded-xl border border-white/60 bg-white/45 px-3 py-2 text-sm font-medium text-neutral-700">
                      <input
                        type="checkbox"
                        checked={draft.is_published}
                        onChange={(event) =>
                          setDraft((current) =>
                            current ? { ...current, is_published: event.target.checked } : current
                          )
                        }
                        className="h-4 w-4 rounded border-neutral-300"
                      />
                      Published on public frontend
                    </label>
                    <button
                      type="button"
                      onClick={handleSaveDetails}
                      disabled={isSaving}
                      className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/50 bg-neutral-950/90 px-4 py-3 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(0,0,0,0.18)] transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Save className="h-4 w-4" />
                      {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                )}
                
                {!isModal && (
                  <div className="pt-4 border-t border-white/50">
                    <button 
                      type="button"
                      onClick={() => handleDelete(selectedAsset.id)}
                      className="text-red-600 hover:text-red-800 font-medium text-sm"
                    >
                      Delete Asset
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-sm text-neutral-500 text-center py-8">Select an asset to view details</div>
          )}
        </div>
      </div>

      <ToastStack toasts={toasts} onDone={dismissToast} />
    </div>
  );
}
