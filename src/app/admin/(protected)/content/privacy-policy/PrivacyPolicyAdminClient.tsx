"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import { updatePrivacyPolicyPageAction } from "@/features/admin/privacy-policy/actions";
import { useToast } from "@/components/admin/Toast";
import type { AdminPrivacyPolicyPageVM } from "@/features/admin/types";

const INPUT =
  "w-full bg-white/70 border border-neutral-300 rounded-xl px-4 py-3 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 transition";
const LABEL = "block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2";
const LIMIT_TEXT = "text-xs text-neutral-400";

function Count({ value, limit }: { value: string; limit: number }) {
  return <span className={LIMIT_TEXT}>{value.length}/{limit}</span>;
}

export default function PrivacyPolicyAdminClient({
  page,
}: {
  page: AdminPrivacyPolicyPageVM;
}) {
  const router = useRouter();
  const { showToast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [headline, setHeadline] = useState(page.headline);
  const [effectiveDateLabel, setEffectiveDateLabel] = useState(page.effective_date_label);
  const [introText, setIntroText] = useState(page.intro_text);
  const [bodyContent, setBodyContent] = useState(page.body_content);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    startTransition(async () => {
      const result = await updatePrivacyPolicyPageAction({
        headline,
        effective_date_label: effectiveDateLabel,
        intro_text: introText,
        body_content: bodyContent,
      });

      if (result.success) {
        showToast("Saved", "Privacy policy updated.", "success");
        router.refresh();
      } else {
        showToast("Save failed", result.error, "error");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex h-full min-h-0 flex-col">
      <div className="flex shrink-0 items-center justify-between border-b border-white/30 bg-white/20 px-8 py-5 backdrop-blur-sm">
        <div>
          <p className="mb-0.5 text-[11px] font-semibold uppercase tracking-widest text-neutral-400">Legal</p>
          <h1 className="text-xl font-bold text-neutral-900">Privacy Policy</h1>
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 rounded-xl bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {isPending ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-8 py-6">
        <div className="max-w-4xl space-y-5 rounded-2xl border border-white/60 bg-white/40 p-6 shadow-sm backdrop-blur-xl">
          <div>
            <div className="mb-2 flex items-center justify-between gap-3">
              <label className={`${LABEL} mb-0`}>Headline</label>
              <Count value={headline} limit={150} />
            </div>
            <input
              value={headline}
              onChange={(event) => setHeadline(event.target.value)}
              maxLength={150}
              required
              className={INPUT}
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between gap-3">
              <label className={`${LABEL} mb-0`}>Effective Date Label</label>
              <Count value={effectiveDateLabel} limit={120} />
            </div>
            <input
              value={effectiveDateLabel}
              onChange={(event) => setEffectiveDateLabel(event.target.value)}
              maxLength={120}
              required
              className={INPUT}
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between gap-3">
              <label className={`${LABEL} mb-0`}>Intro Text</label>
              <Count value={introText} limit={1000} />
            </div>
            <textarea
              value={introText}
              onChange={(event) => setIntroText(event.target.value)}
              maxLength={1000}
              required
              rows={4}
              className={`${INPUT} resize-y`}
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between gap-3">
              <label className={`${LABEL} mb-0`}>Policy Content</label>
              <Count value={bodyContent} limit={12000} />
            </div>
            <textarea
              value={bodyContent}
              onChange={(event) => setBodyContent(event.target.value)}
              maxLength={12000}
              required
              rows={18}
              className={`${INPUT} resize-y font-mono leading-relaxed`}
            />
            <p className="mt-2 text-xs text-neutral-500">
              Use lines starting with ## for section headings and - for bullet points.
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}
