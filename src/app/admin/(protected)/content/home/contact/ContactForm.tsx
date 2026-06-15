"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { updateContactSectionAction } from "@/features/admin/homepage/actions";
import type { AdminContactSectionVM } from "@/features/admin/types";
import { useToast } from "@/components/admin/Toast";

const INPUT =
  "w-full bg-white/70 border border-neutral-300 rounded-xl px-4 py-3 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 transition";
const LABEL = "block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2";

function optionsToText(data: AdminContactSectionVM["interest_options"]) {
  return data.map((option) => `${option.label}|${option.value}`).join("\n");
}

function textToOptions(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, rawValue] = line.split("|").map((part) => part.trim());
      return {
        label,
        value: rawValue || label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      };
    });
}

export function ContactForm({ data }: { data: AdminContactSectionVM }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [optionsText, setOptionsText] = useState(optionsToText(data.interest_options));
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    const formData = new FormData(event.currentTarget);
    const interestOptions = textToOptions(optionsText);

    if (interestOptions.length === 0) {
      setError("Add at least one interest option.");
      return;
    }

    startTransition(async () => {
      const result = await updateContactSectionAction({
        badge_text: (formData.get("badge_text") as string).trim(),
        title: (formData.get("title") as string).trim(),
        body_text: (formData.get("body_text") as string).trim(),
        phone_label: (formData.get("phone_label") as string).trim(),
        phone_value: (formData.get("phone_value") as string).trim(),
        email_label: (formData.get("email_label") as string).trim(),
        email_value: (formData.get("email_value") as string).trim(),
        full_name_placeholder: (formData.get("full_name_placeholder") as string).trim(),
        email_placeholder: (formData.get("email_placeholder") as string).trim(),
        phone_placeholder: (formData.get("phone_placeholder") as string).trim(),
        interest_placeholder: (formData.get("interest_placeholder") as string).trim(),
        message_placeholder: (formData.get("message_placeholder") as string).trim(),
        submit_label: (formData.get("submit_label") as string).trim(),
        sending_label: (formData.get("sending_label") as string).trim(),
        success_title: (formData.get("success_title") as string).trim(),
        success_body: (formData.get("success_body") as string).trim(),
        send_another_label: (formData.get("send_another_label") as string).trim(),
        source_path: (formData.get("source_path") as string).trim(),
        interest_options: interestOptions,
      });

      if (result.success) {
        showToast("Saved changes", "Contact section updated.");
        router.refresh();
      } else {
        setError(result.error);
        showToast("Save failed", result.error, "error");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex h-full min-h-0 flex-col">
      <div className="flex shrink-0 items-center justify-between border-b border-white/30 bg-white/20 px-8 py-5 backdrop-blur-sm">
        <div>
          <p className="mb-0.5 text-[11px] font-semibold uppercase tracking-widest text-neutral-400">Homepage</p>
          <h1 className="text-xl font-bold text-neutral-900">Contact Section</h1>
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="rounded-xl bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800 disabled:opacity-50"
        >
          {isPending ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-8 py-6">
        <div className="grid grid-cols-2 gap-5">
          <div>
            <label className={LABEL}>Badge Text</label>
            <input name="badge_text" defaultValue={data.badge_text} required className={INPUT} />
          </div>
          <div>
            <label className={LABEL}>Source Path</label>
            <input name="source_path" defaultValue={data.source_path} required className={INPUT} />
          </div>
          <div className="col-span-2">
            <label className={LABEL}>Title</label>
            <input name="title" defaultValue={data.title} required className={INPUT} />
          </div>
          <div className="col-span-2">
            <label className={LABEL}>Body Text</label>
            <textarea name="body_text" defaultValue={data.body_text} required rows={4} className={`${INPUT} resize-none`} />
          </div>
          <div>
            <label className={LABEL}>Phone Label</label>
            <input name="phone_label" defaultValue={data.phone_label} required className={INPUT} />
          </div>
          <div>
            <label className={LABEL}>Phone Value</label>
            <input name="phone_value" defaultValue={data.phone_value} required className={INPUT} />
          </div>
          <div>
            <label className={LABEL}>Email Label</label>
            <input name="email_label" defaultValue={data.email_label} required className={INPUT} />
          </div>
          <div>
            <label className={LABEL}>Email Value</label>
            <input name="email_value" defaultValue={data.email_value} required className={INPUT} />
          </div>
          <div>
            <label className={LABEL}>Full Name Placeholder</label>
            <input name="full_name_placeholder" defaultValue={data.full_name_placeholder} required className={INPUT} />
          </div>
          <div>
            <label className={LABEL}>Email Placeholder</label>
            <input name="email_placeholder" defaultValue={data.email_placeholder} required className={INPUT} />
          </div>
          <div>
            <label className={LABEL}>Phone Placeholder</label>
            <input name="phone_placeholder" defaultValue={data.phone_placeholder} required className={INPUT} />
          </div>
          <div>
            <label className={LABEL}>Interest Placeholder</label>
            <input name="interest_placeholder" defaultValue={data.interest_placeholder} required className={INPUT} />
          </div>
          <div>
            <label className={LABEL}>Message Placeholder</label>
            <input name="message_placeholder" defaultValue={data.message_placeholder} required className={INPUT} />
          </div>
          <div>
            <label className={LABEL}>Submit Label</label>
            <input name="submit_label" defaultValue={data.submit_label} required className={INPUT} />
          </div>
          <div>
            <label className={LABEL}>Sending Label</label>
            <input name="sending_label" defaultValue={data.sending_label} required className={INPUT} />
          </div>
          <div>
            <label className={LABEL}>Success Title</label>
            <input name="success_title" defaultValue={data.success_title} required className={INPUT} />
          </div>
          <div className="col-span-2">
            <label className={LABEL}>Success Body</label>
            <textarea name="success_body" defaultValue={data.success_body} required rows={3} className={`${INPUT} resize-none`} />
          </div>
          <div>
            <label className={LABEL}>Send Another Label</label>
            <input name="send_another_label" defaultValue={data.send_another_label} required className={INPUT} />
          </div>
          <div className="col-span-2">
            <label className={LABEL}>Interest Options</label>
            <textarea
              value={optionsText}
              onChange={(event) => setOptionsText(event.target.value)}
              rows={6}
              className={`${INPUT} resize-none font-mono`}
              placeholder={"Private Office|private-office\nDedicated Desk|dedicated-desk"}
            />
            <p className="mt-2 text-xs text-neutral-500">One option per line: label|value</p>
          </div>
        </div>
        {error && <p className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      </div>
    </form>
  );
}
