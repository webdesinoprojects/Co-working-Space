"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { getIkAuthParamsAction, persistUploadedAssetAction } from "@/features/admin/media/actions";
import type { MediaAssetVM } from "@/features/admin/types";
import { Upload, CheckCircle, XCircle, Loader2, X } from "lucide-react";

const MAX_UPLOAD_SIZE_BYTES = 5 * 1024 * 1024;
const MAX_QUEUE_SIZE = 15;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

type QueueStatus = "pending" | "uploading" | "done" | "error";

interface QueueItem {
  id: string;
  file: File;
  status: QueueStatus;
  error?: string;
  preview: string;
}

function validateFile(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) return "Only JPEG, PNG, WEBP, AVIF.";
  if (file.size > MAX_UPLOAD_SIZE_BYTES) return "Max 5 MB.";
  return null;
}

export function ImageUploadZone({
  onUploadSuccess,
}: {
  onUploadSuccess?: (asset?: MediaAssetVM) => void;
}) {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isProcessingRef = useRef(false);

  // Sequential queue processor — picks the next pending item and uploads it
  useEffect(() => {
    const next = queue.find((i) => i.status === "pending");
    if (!next || isProcessingRef.current) return;
    isProcessingRef.current = true;

    const run = async () => {
      setQueue((q) => q.map((i) => i.id === next.id ? { ...i, status: "uploading" } : i));
      try {
        const authRes = await getIkAuthParamsAction();
        if (!authRes.success) throw new Error(authRes.error);
        if (!authRes.data) throw new Error("Auth failed");

        const { token, expire, signature, publicKey } = authRes.data;
        const fd = new FormData();
        fd.append("file", next.file);
        fd.append("fileName", next.file.name);
        fd.append("publicKey", publicKey);
        fd.append("signature", signature);
        fd.append("expire", expire.toString());
        fd.append("token", token);
        fd.append("folder", "/admin_uploads");

        const uploadRes = await fetch("https://upload.imagekit.io/api/v1/files/upload", { method: "POST", body: fd });
        if (!uploadRes.ok) {
          const err = await uploadRes.json().catch(() => ({}));
          throw new Error((err as { message?: string }).message ?? "Upload failed");
        }

        const ik = await uploadRes.json();
        const persistRes = await persistUploadedAssetAction({
          fileId: ik.fileId, filePath: ik.filePath, url: ik.url,
          name: ik.name, width: ik.width, height: ik.height,
          fileType: next.file.type, size: ik.size,
        });
        if (!persistRes.success) throw new Error(persistRes.error ?? "Failed to save");

        setQueue((q) => q.map((i) => i.id === next.id ? { ...i, status: "done" } : i));
        onUploadSuccess?.(persistRes.data);
      } catch (err) {
        setQueue((q) => q.map((i) => i.id === next.id ? { ...i, status: "error", error: err instanceof Error ? err.message : "Upload failed" } : i));
      } finally {
        isProcessingRef.current = false;
      }
    };

    run();
  }, [queue, onUploadSuccess]);

  const addFiles = useCallback((files: FileList | File[]) => {
    const arr = Array.from(files);
    setQueue((q) => {
      const slots = MAX_QUEUE_SIZE - q.length;
      if (slots <= 0) return q;
      const toAdd: QueueItem[] = arr.slice(0, slots).map((file) => {
        const err = validateFile(file);
        return {
          id: crypto.randomUUID(),
          file,
          status: err ? "error" : "pending",
          error: err ?? undefined,
          preview: URL.createObjectURL(file),
        };
      });
      return [...q, ...toAdd];
    });
  }, []);

  const removeItem = (id: string) => {
    setQueue((q) => {
      const item = q.find((i) => i.id === id);
      if (item?.preview) URL.revokeObjectURL(item.preview);
      return q.filter((i) => i.id !== id);
    });
  };

  const retryItem = (id: string) => {
    setQueue((q) => q.map((i) => i.id === id ? { ...i, status: "pending", error: undefined } : i));
  };

  const clearDone = () => {
    setQueue((q) => {
      q.filter((i) => i.status === "done").forEach((i) => URL.revokeObjectURL(i.preview));
      return q.filter((i) => i.status !== "done");
    });
  };

  const onDragEnter = (e: React.DragEvent) => { e.preventDefault(); setIsDragOver(true); };
  const onDragOver = (e: React.DragEvent) => { e.preventDefault(); e.dataTransfer.dropEffect = "copy"; setIsDragOver(true); };
  const onDragLeave = (e: React.DragEvent) => { e.preventDefault(); if (!e.currentTarget.contains(e.relatedTarget as Node)) setIsDragOver(false); };
  const onDrop = (e: React.DragEvent) => { e.preventDefault(); setIsDragOver(false); addFiles(e.dataTransfer.files); };

  const doneCount = queue.filter((i) => i.status === "done").length;
  const uploadingCount = queue.filter((i) => i.status === "uploading").length;
  const pendingCount = queue.filter((i) => i.status === "pending").length;

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <div
        onDragEnter={onDragEnter} onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
          isDragOver ? "border-blue-400 bg-blue-50" : "border-neutral-300 bg-neutral-50 hover:bg-neutral-100/80"
        }`}
      >
        <input
          ref={fileInputRef} type="file" multiple
          accept="image/jpeg,image/png,image/webp,image/avif"
          className="hidden"
          onChange={(e) => { if (e.target.files) { addFiles(e.target.files); e.target.value = ""; } }}
        />
        <Upload size={22} className={`mx-auto mb-2 ${isDragOver ? "text-blue-500" : "text-neutral-400"}`} />
        <p className="text-sm font-semibold text-neutral-800">
          {isDragOver ? "Drop images to queue" : "Drag & drop or click to browse"}
        </p>
        <p className="text-xs text-neutral-500 mt-0.5">JPEG · PNG · WEBP · AVIF · max 5 MB · up to 15 files</p>
      </div>

      {/* Queue */}
      {queue.length > 0 && (
        <div className="space-y-2">
          {/* Queue header */}
          <div className="flex items-center justify-between px-0.5">
            <p className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">
              Upload Queue ({queue.length})
              {uploadingCount > 0 && (
                <span className="ml-2 text-blue-600 normal-case font-medium">
                  uploading {queue.findIndex((i) => i.status === "uploading") + 1} of {queue.length}
                </span>
              )}
              {uploadingCount === 0 && pendingCount === 0 && doneCount === queue.length && (
                <span className="ml-2 text-green-600 normal-case font-medium">all done!</span>
              )}
            </p>
            {doneCount > 0 && (
              <button type="button" onClick={clearDone}
                className="text-xs text-neutral-500 hover:text-neutral-800 font-medium transition-colors">
                Clear done ({doneCount})
              </button>
            )}
          </div>

          {/* Queue items */}
          <div className="space-y-1.5 max-h-72 overflow-y-auto pr-0.5">
            {queue.map((item) => (
              <div key={item.id} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border text-sm transition-colors ${
                item.status === "done"      ? "bg-green-50/80 border-green-200" :
                item.status === "error"     ? "bg-red-50/80 border-red-200" :
                item.status === "uploading" ? "bg-blue-50/80 border-blue-200" :
                                              "bg-white border-neutral-200"
              }`}>
                {/* Thumbnail */}
                <div className="w-9 h-9 rounded-lg overflow-hidden bg-neutral-100 shrink-0 border border-neutral-200">
                  <img src={item.preview} alt={`${item.file.name} preview`} className="w-full h-full object-cover" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-neutral-800 font-medium text-xs truncate">{item.file.name}</p>
                  <p className={`text-[11px] mt-0.5 ${
                    item.status === "done"      ? "text-green-600" :
                    item.status === "error"     ? "text-red-500" :
                    item.status === "uploading" ? "text-blue-500" :
                                                  "text-neutral-400"
                  }`}>
                    {item.status === "done"      && "Uploaded"}
                    {item.status === "error"     && (item.error ?? "Failed")}
                    {item.status === "uploading" && "Uploading..."}
                    {item.status === "pending"   && "Waiting"}
                  </p>
                </div>

                {/* Right action/icon */}
                <div className="shrink-0 flex items-center gap-1.5">
                  {item.status === "uploading" && <Loader2 size={15} className="text-blue-500 animate-spin" />}
                  {item.status === "done" && <CheckCircle size={15} className="text-green-500" />}
                  {item.status === "error" && (
                    <>
                      <XCircle size={15} className="text-red-400" />
                      <button type="button" onClick={() => retryItem(item.id)}
                        className="text-[11px] font-semibold text-red-600 hover:text-red-800 transition-colors">
                        Retry
                      </button>
                    </>
                  )}
                  {(item.status === "pending" || item.status === "done" || item.status === "error") && (
                    <button type="button" onClick={() => removeItem(item.id)}
                      className="text-neutral-300 hover:text-neutral-600 transition-colors ml-1">
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
