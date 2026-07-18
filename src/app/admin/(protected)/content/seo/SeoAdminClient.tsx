"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import { updatePageSeoAction } from "@/features/admin/page-seo/actions";
import { useToast } from "@/components/admin/Toast";
import type { AdminPageSeoVM } from "@/features/admin/types";

const INPUT =
  "w-full bg-white/70 border border-neutral-300 rounded-xl px-4 py-3 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 transition";
const LABEL = "block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2";
const PANEL = "bg-white/40 backdrop-blur-xl border border-white/60 rounded-2xl p-6 shadow-sm";
const TITLE_LIMIT = 200;
const DESCRIPTION_LIMIT = 400;

function CharacterLimit({
  text,
  limit,
}: {
  text: string;
  limit: number;
}) {
  return (
    <span className="text-xs text-neutral-400">
      {text.length}/{limit}
    </span>
  );
}

function SeoForm({ item }: { item: AdminPageSeoVM }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState(item.meta_title ?? "");
  const [description, setDescription] = useState(item.meta_description ?? "");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await updatePageSeoAction({
        route_path: item.route_path,
        meta_title: ((fd.get("meta_title") as string).trim()) || null,
        meta_description: ((fd.get("meta_description") as string).trim()) || null,
      });

      if (result.success) {
        showToast("Saved", `${item.label} metadata updated.`, "success");
        router.refresh();
      } else {
        showToast("Save failed", result.error, "error");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className={PANEL}>
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <h2 className="text-base font-semibold text-neutral-900">{item.label}</h2>
          <p className="text-xs text-neutral-500 mt-1">{item.route_path}</p>
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 bg-neutral-900 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-neutral-800 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {isPending ? "Saving..." : "Save"}
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between gap-3 mb-2">
            <label className={`${LABEL} mb-0`}>Meta Title</label>
            <CharacterLimit text={title} limit={TITLE_LIMIT} />
          </div>
          <input
            name="meta_title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={item.fallback_title}
            maxLength={TITLE_LIMIT}
            className={INPUT}
          />
          <p className="text-xs text-neutral-400 mt-2">
            Limit {TITLE_LIMIT} characters. Fallback: {item.fallback_title}
          </p>
        </div>

        <div>
          <div className="flex items-center justify-between gap-3 mb-2">
            <label className={`${LABEL} mb-0`}>Meta Description</label>
            <CharacterLimit text={description} limit={DESCRIPTION_LIMIT} />
          </div>
          <textarea
            name="meta_description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={item.fallback_description}
            maxLength={DESCRIPTION_LIMIT}
            rows={3}
            className={`${INPUT} resize-y`}
          />
          <p className="text-xs text-neutral-400 mt-2">
            Limit {DESCRIPTION_LIMIT} characters. Fallback: {item.fallback_description}
          </p>
        </div>
      </div>
    </form>
  );
}

export default function SeoAdminClient({ items }: { items: AdminPageSeoVM[] }) {
  return (
    <div className="p-8 space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-semibold text-neutral-900">SEO</h1>
        <p className="text-sm text-neutral-400 mt-1">
          Edit public page titles and descriptions. Canonicals are generated from each route.
        </p>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <SeoForm key={item.route_path} item={item} />
        ))}
      </div>
    </div>
  );
}
