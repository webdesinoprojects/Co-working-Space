"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Edit3,
  Image as ImageIcon,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import {
  assignServicesHeroImageAction,
  deleteServiceItemAction,
  reorderServicesItemsAction,
  upsertServiceItemAction,
  updateServicesPageAction,
} from "@/features/admin/services/actions";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { ItemDialog } from "@/components/admin/ItemDialog";
import { SortableList } from "@/components/admin/SortableList";
import { useToast } from "@/components/admin/Toast";
import { MediaPickerModal } from "@/components/admin/media/MediaPickerModal";
import type {
  AdminImagePreview,
  AdminServiceItemVM,
  AdminServicesPageVM,
  MediaAssetVM,
} from "@/features/admin/types";

const INPUT =
  "w-full bg-white/70 border border-neutral-300 rounded-xl px-4 py-3 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 transition";
const LABEL = "block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2";
const LIMIT_TEXT = "text-xs text-neutral-400";

const ICON_KEY_OPTIONS = [
  "building",
  "briefcase",
  "laptop",
  "monitor",
  "presentation",
  "video",
  "users",
  "key",
  "shield",
  "map-pin",
  "phone",
  "wifi",
  "coffee",
  "printer",
  "zap",
  "sparkles",
];

function Count({ value, limit }: { value: string; limit: number }) {
  return <span className={LIMIT_TEXT}>{value.length}/{limit}</span>;
}

function splitLines(value: string): string[] {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function toAdminPreview(asset: MediaAssetVM): AdminImagePreview {
  return {
    asset_id: asset.id,
    url: asset.file_url,
    alt: asset.alt_text,
    width: asset.width,
    height: asset.height,
  };
}

function ServiceItemDialog({
  isOpen,
  title,
  initial,
  serviceId,
  sortOrder,
  onClose,
}: {
  isOpen: boolean;
  title: string;
  initial?: Partial<AdminServiceItemVM>;
  serviceId?: string;
  sortOrder: number;
  onClose: () => void;
}) {
  const router = useRouter();
  const { showToast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [imageAssetId, setImageAssetId] = useState<string | null>(
    initial?.image_asset_id ?? null
  );
  const [imagePreview, setImagePreview] = useState<AdminImagePreview | null>(
    initial?.image ?? null
  );
  const [pickingImage, setPickingImage] = useState(false);

  const defaultFeatures = (initial?.features ?? []).join("\n");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    startTransition(async () => {
      const result = await upsertServiceItemAction({
        id: serviceId,
        title: (formData.get("title") as string).trim(),
        description: (formData.get("description") as string).trim(),
        icon_key: formData.get("icon_key") as string,
        image_asset_id: imageAssetId,
        features: splitLines(formData.get("features") as string),
        cta_label: (formData.get("cta_label") as string).trim(),
        cta_href: (formData.get("cta_href") as string).trim(),
        sort_order: initial?.sort_order ?? sortOrder,
        is_active: formData.get("is_active") === "on",
      });

      if (result.success) {
        showToast("Saved", "Service updated.", "success");
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
        <div>
          <label className={LABEL}>Title</label>
          <input
            name="title"
            defaultValue={initial?.title ?? ""}
            maxLength={150}
            required
            className={INPUT}
            placeholder="e.g. Coworking Desks"
          />
        </div>

        <div>
          <label className={LABEL}>Description</label>
          <textarea
            name="description"
            defaultValue={initial?.description ?? ""}
            maxLength={900}
            required
            rows={4}
            className={`${INPUT} resize-y`}
            placeholder="Explain the service in one short paragraph."
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={LABEL}>Icon</label>
            <select
              name="icon_key"
              defaultValue={initial?.icon_key ?? "building"}
              className={`${INPUT} bg-white/60`}
            >
              {ICON_KEY_OPTIONS.map((key) => (
                <option key={key} value={key}>{key}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={LABEL}>CTA Label</label>
            <input
              name="cta_label"
              defaultValue={initial?.cta_label ?? "Enquire Now"}
              maxLength={80}
              required
              className={INPUT}
            />
          </div>
        </div>

        <div>
          <label className={LABEL}>CTA Href</label>
          <input
            name="cta_href"
            defaultValue={initial?.cta_href ?? "/connect"}
            maxLength={500}
            required
            className={INPUT}
            placeholder="/connect?interest=service-name"
          />
        </div>

        <div>
          <label className={LABEL}>Feature Bullets</label>
          <textarea
            name="features"
            defaultValue={defaultFeatures}
            maxLength={2200}
            rows={5}
            className={`${INPUT} resize-y`}
            placeholder="One feature per line"
          />
          <p className="mt-2 text-xs text-neutral-500">One feature per line. Up to 10 bullets.</p>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className={`${LABEL} mb-0`}>Service Image</label>
            <button
              type="button"
              onClick={() => setPickingImage(true)}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800"
            >
              Choose Image
            </button>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white/50 p-3">
            <div className="grid h-20 w-28 shrink-0 place-items-center overflow-hidden rounded-lg bg-neutral-100">
              {imagePreview ? (
                <img
                  src={imagePreview.url}
                  alt={imagePreview.alt || `${initial?.title ?? "Service"} preview`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <ImageIcon className="h-5 w-5 text-neutral-300" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-neutral-800">
                {imagePreview?.alt || "No image selected"}
              </p>
              <p className="text-xs text-neutral-500">Optional. Used on the public Services page.</p>
            </div>
            {imagePreview && (
              <button
                type="button"
                onClick={() => {
                  setImageAssetId(null);
                  setImagePreview(null);
                }}
                className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-100 hover:text-red-500"
                aria-label="Remove service image"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="is_active"
            id="service_is_active"
            defaultChecked={initial?.is_active ?? true}
            className="h-4 w-4 rounded border-neutral-300"
          />
          <label htmlFor="service_is_active" className="text-sm font-medium text-neutral-700">
            Active (shown on public Services page)
          </label>
        </div>

        {error && <p className="text-xs text-red-500">{error}</p>}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isPending}
            className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
          >
            {isPending ? "Saving..." : "Save Service"}
          </button>
        </div>
      </form>

      <MediaPickerModal
        isOpen={pickingImage}
        onClose={() => setPickingImage(false)}
        onSelect={(asset) => {
          setImageAssetId(asset.id);
          setImagePreview(toAdminPreview(asset));
        }}
      />
    </ItemDialog>
  );
}

export default function ServicesAdminClient({
  page,
}: {
  page: AdminServicesPageVM;
}) {
  const router = useRouter();
  const { showToast } = useToast();
  const [isSavingPage, startSavingPage] = useTransition();
  const [isSavingHero, startSavingHero] = useTransition();
  const [badgeText, setBadgeText] = useState(page.badge_text);
  const [headline, setHeadline] = useState(page.headline);
  const [introText, setIntroText] = useState(page.intro_text);
  const [primaryCtaLabel, setPrimaryCtaLabel] = useState(page.primary_cta_label);
  const [primaryCtaHref, setPrimaryCtaHref] = useState(page.primary_cta_href);
  const [secondaryCtaLabel, setSecondaryCtaLabel] = useState(page.secondary_cta_label);
  const [secondaryCtaHref, setSecondaryCtaHref] = useState(page.secondary_cta_href);
  const [highlightsText, setHighlightsText] = useState(page.highlights.join("\n"));
  const [servicesBadgeText, setServicesBadgeText] = useState(page.services_badge_text);
  const [servicesTitle, setServicesTitle] = useState(page.services_title);
  const [servicesIntroText, setServicesIntroText] = useState(page.services_intro_text);
  const [heroImage, setHeroImage] = useState<AdminImagePreview | null>(page.hero_image);
  const [pickingHero, setPickingHero] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AdminServiceItemVM | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const sortedItems = useMemo(
    () => [...page.items].sort((a, b) => a.sort_order - b.sort_order),
    [page.items]
  );

  const handlePageSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    startSavingPage(async () => {
      const result = await updateServicesPageAction({
        badge_text: badgeText,
        headline,
        intro_text: introText,
        primary_cta_label: primaryCtaLabel,
        primary_cta_href: primaryCtaHref,
        secondary_cta_label: secondaryCtaLabel,
        secondary_cta_href: secondaryCtaHref,
        highlights: splitLines(highlightsText),
        services_badge_text: servicesBadgeText,
        services_title: servicesTitle,
        services_intro_text: servicesIntroText,
      });

      if (result.success) {
        showToast("Saved", "Services page content updated.", "success");
        router.refresh();
      } else {
        showToast("Save failed", result.error, "error");
      }
    });
  };

  const handleHeroSelect = (asset: MediaAssetVM) => {
    startSavingHero(async () => {
      const result = await assignServicesHeroImageAction({ asset_id: asset.id });
      if (result.success) {
        setHeroImage(toAdminPreview(asset));
        showToast("Saved", "Hero image updated.", "success");
        router.refresh();
      } else {
        showToast("Image failed", result.error, "error");
      }
    });
  };

  const handleHeroRemove = () => {
    startSavingHero(async () => {
      const result = await assignServicesHeroImageAction({ asset_id: null });
      if (result.success) {
        setHeroImage(null);
        showToast("Saved", "Hero image removed.", "success");
        router.refresh();
      } else {
        showToast("Image failed", result.error, "error");
      }
    });
  };

  const handleReorder = async (reordered: AdminServiceItemVM[]) => {
    const result = await reorderServicesItemsAction(
      reordered.map((item, index) => ({ id: item.id, sort_order: index * 10 }))
    );
    if (result.success) {
      showToast("Saved order", "Services reordered.", "success");
      router.refresh();
    } else {
      showToast("Reorder failed", result.error, "error");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const result = await deleteServiceItemAction(deleteId);
    setDeleteId(null);
    if (result.success) {
      showToast("Deleted", "Service removed.", "success");
      router.refresh();
    } else {
      showToast("Delete failed", result.error, "error");
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex shrink-0 items-center justify-between border-b border-white/30 bg-white/20 px-8 py-5 backdrop-blur-sm">
        <div>
          <p className="mb-0.5 text-[11px] font-semibold uppercase tracking-widest text-neutral-400">Public Page</p>
          <h1 className="text-xl font-bold text-neutral-900">Services</h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setAddOpen(true)}
            className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white/70 px-4 py-2.5 text-sm font-semibold text-neutral-900 hover:bg-white"
          >
            <Plus className="h-4 w-4" />
            Add Service
          </button>
          <button
            type="submit"
            form="services-page-form"
            disabled={isSavingPage}
            className="flex items-center gap-2 rounded-xl bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {isSavingPage ? "Saving..." : "Save Page"}
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-8 py-6">
        <form
          id="services-page-form"
          onSubmit={handlePageSubmit}
          className="max-w-6xl space-y-6"
        >
          <div className="rounded-2xl border border-white/60 bg-white/40 p-6 shadow-sm backdrop-blur-xl">
            <p className={LABEL}>Hero Content</p>
            <div className="mt-3 grid gap-5 lg:grid-cols-[1fr_320px]">
              <div className="space-y-5">
                <div>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <label className={`${LABEL} mb-0`}>Badge Text</label>
                    <Count value={badgeText} limit={80} />
                  </div>
                  <input
                    value={badgeText}
                    onChange={(event) => setBadgeText(event.target.value)}
                    maxLength={80}
                    required
                    className={INPUT}
                  />
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <label className={`${LABEL} mb-0`}>Headline</label>
                    <Count value={headline} limit={240} />
                  </div>
                  <textarea
                    value={headline}
                    onChange={(event) => setHeadline(event.target.value)}
                    maxLength={240}
                    required
                    rows={3}
                    className={`${INPUT} resize-y text-lg font-semibold leading-snug`}
                  />
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <label className={`${LABEL} mb-0`}>Intro Text</label>
                    <Count value={introText} limit={900} />
                  </div>
                  <textarea
                    value={introText}
                    onChange={(event) => setIntroText(event.target.value)}
                    maxLength={900}
                    required
                    rows={4}
                    className={`${INPUT} resize-y`}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={LABEL}>Primary CTA Label</label>
                    <input
                      value={primaryCtaLabel}
                      onChange={(event) => setPrimaryCtaLabel(event.target.value)}
                      maxLength={80}
                      required
                      className={INPUT}
                    />
                  </div>
                  <div>
                    <label className={LABEL}>Primary CTA Href</label>
                    <input
                      value={primaryCtaHref}
                      onChange={(event) => setPrimaryCtaHref(event.target.value)}
                      maxLength={500}
                      required
                      className={INPUT}
                    />
                  </div>
                  <div>
                    <label className={LABEL}>Secondary CTA Label</label>
                    <input
                      value={secondaryCtaLabel}
                      onChange={(event) => setSecondaryCtaLabel(event.target.value)}
                      maxLength={80}
                      required
                      className={INPUT}
                    />
                  </div>
                  <div>
                    <label className={LABEL}>Secondary CTA Href</label>
                    <input
                      value={secondaryCtaHref}
                      onChange={(event) => setSecondaryCtaHref(event.target.value)}
                      maxLength={500}
                      required
                      className={INPUT}
                    />
                  </div>
                </div>

                <div>
                  <label className={LABEL}>Hero Highlights</label>
                  <textarea
                    value={highlightsText}
                    onChange={(event) => setHighlightsText(event.target.value)}
                    maxLength={1200}
                    required
                    rows={4}
                    className={`${INPUT} resize-y`}
                  />
                  <p className="mt-2 text-xs text-neutral-500">One highlight per line. Up to 6 highlights.</p>
                </div>
              </div>

              <div className="rounded-2xl border border-white/60 bg-white/45 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className={LABEL}>Hero Image</p>
                  <button
                    type="button"
                    onClick={() => setPickingHero(true)}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                  >
                    Choose
                  </button>
                </div>
                <div className="grid aspect-[4/5] place-items-center overflow-hidden rounded-xl bg-neutral-100">
                  {heroImage ? (
                    <img
                      src={heroImage.url}
                      alt={heroImage.alt || "Services hero preview"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="h-8 w-8 text-neutral-300" />
                  )}
                </div>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <p className="min-w-0 truncate text-xs text-neutral-500">
                    {heroImage?.alt || "No image selected"}
                  </p>
                  {heroImage && (
                    <button
                      type="button"
                      disabled={isSavingHero}
                      onClick={handleHeroRemove}
                      className="rounded-lg px-2 py-1 text-xs font-semibold text-red-500 hover:bg-red-50 disabled:opacity-50"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/60 bg-white/40 p-6 shadow-sm backdrop-blur-xl">
            <p className={LABEL}>Services Section</p>
            <div className="mt-3 grid gap-5 sm:grid-cols-2">
              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label className={`${LABEL} mb-0`}>Badge Text</label>
                  <Count value={servicesBadgeText} limit={80} />
                </div>
                <input
                  value={servicesBadgeText}
                  onChange={(event) => setServicesBadgeText(event.target.value)}
                  maxLength={80}
                  required
                  className={INPUT}
                />
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label className={`${LABEL} mb-0`}>Section Title</label>
                  <Count value={servicesTitle} limit={240} />
                </div>
                <input
                  value={servicesTitle}
                  onChange={(event) => setServicesTitle(event.target.value)}
                  maxLength={240}
                  required
                  className={INPUT}
                />
              </div>
            </div>
            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between gap-3">
                <label className={`${LABEL} mb-0`}>Section Intro</label>
                <Count value={servicesIntroText} limit={900} />
              </div>
              <textarea
                value={servicesIntroText}
                onChange={(event) => setServicesIntroText(event.target.value)}
                maxLength={900}
                required
                rows={4}
                className={`${INPUT} resize-y`}
              />
            </div>
          </div>
        </form>

        <div className="mt-6 max-w-6xl rounded-2xl border border-white/60 bg-white/40 p-6 shadow-sm backdrop-blur-xl">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <p className={LABEL}>Service Cards</p>
              <p className="text-xs text-neutral-500">{sortedItems.length} services configured.</p>
            </div>
            <button
              type="button"
              onClick={() => setAddOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800"
            >
              <Plus className="h-4 w-4" />
              Add Service
            </button>
          </div>

          <div className="space-y-3">
            <SortableList
              items={sortedItems}
              onReorder={handleReorder}
              renderItem={(item, dragHandle) => (
                <div className="flex items-center gap-4 rounded-2xl border border-white/60 bg-white/45 p-4">
                  {dragHandle}
                  <div className="grid h-16 w-20 shrink-0 place-items-center overflow-hidden rounded-xl bg-neutral-100">
                    {item.image ? (
                      <img
                        src={item.image.url}
                        alt={item.image.alt || `${item.title} preview`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="h-5 w-5 text-neutral-300" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-semibold text-neutral-900">{item.title}</p>
                      <span className="rounded-lg bg-white/70 px-2 py-0.5 text-[11px] font-mono text-neutral-500">
                        {item.icon_key}
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs text-neutral-500">{item.description}</p>
                    <div className="mt-2 flex items-center gap-2 text-[11px] text-neutral-500">
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                      {item.features.length} feature bullets
                    </div>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${item.is_active ? "bg-green-100 text-green-700" : "bg-neutral-100 text-neutral-500"}`}>
                    {item.is_active ? "Active" : "Off"}
                  </span>
                  <button
                    type="button"
                    onClick={() => setEditingItem(item)}
                    className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                    aria-label={`Edit ${item.title}`}
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteId(item.id)}
                    className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                    aria-label={`Delete ${item.title}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              )}
            />
            {sortedItems.length === 0 && (
              <div className="rounded-2xl border border-white/60 bg-white/45 py-12 text-center text-sm text-neutral-400">
                No services yet. Add the first service card.
              </div>
            )}
          </div>
        </div>
      </div>

      <ServiceItemDialog
        isOpen={addOpen}
        title="Add Service"
        sortOrder={sortedItems.length * 10}
        onClose={() => setAddOpen(false)}
      />
      {editingItem && (
        <ServiceItemDialog
          isOpen
          title="Edit Service"
          initial={editingItem}
          serviceId={editingItem.id}
          sortOrder={editingItem.sort_order}
          onClose={() => setEditingItem(null)}
        />
      )}
      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete Service"
        message="Remove this service from the Services page?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
      <MediaPickerModal
        isOpen={pickingHero}
        onClose={() => setPickingHero(false)}
        onSelect={handleHeroSelect}
      />
    </div>
  );
}
