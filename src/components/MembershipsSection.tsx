"use client";

import type { MembershipSectionVM } from "@/features/homepage/types";

const STATIC_PLANS = [
  {
    title: "Hot Desk",
    description: "Flexible access to any open desk.",
    price_text: "Rs. 250/mo",
    cta_label: "Select Plan",
    highlight_badge_text: null,
    is_featured: false,
    features: [
      "Access during business hours",
      "Ultra-fast WiFi",
      "Specialty coffee & tea",
    ],
  },
  {
    title: "Dedicated Desk",
    description: "Your own permanent desk setup.",
    price_text: "Rs. 400/mo",
    cta_label: "Select Plan",
    highlight_badge_text: "Most Popular",
    is_featured: true,
    features: [
      "24/7 building access",
      "Ergonomic chair & locking cabinet",
      "Mail & package handling",
      "5 meeting room credits/mo",
    ],
  },
  {
    title: "Private Office",
    description: "Secure space for teams of 2-50.",
    price_text: "From Rs. 900/mo",
    cta_label: "Contact Us",
    highlight_badge_text: null,
    is_featured: false,
    features: [
      "Everything in Dedicated",
      "Fully furnished & branded",
      "Priority IT support",
    ],
  },
];

function PlanCard({
  isFeatured,
  badgeText,
  title,
  description,
  price,
  ctaLabel,
  features,
}: {
  isFeatured: boolean;
  badgeText: string | null;
  title: string;
  description: string | null;
  price: string;
  ctaLabel: string;
  features: string[];
}) {
  if (isFeatured) {
    return (
      <div className="bg-gray-900 rounded-3xl p-8 border border-gray-900 shadow-xl relative flex flex-col transform md:-translate-y-4">
        {badgeText && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#F26522] text-white text-[11px] font-bold tracking-wider uppercase px-3 py-1 rounded-full whitespace-nowrap">
            {badgeText}
          </div>
        )}
        <h3 className="text-[18px] font-semibold text-white mb-2">{title}</h3>
        {description && (
          <p className="text-[14px] text-gray-400 mb-6">{description}</p>
        )}
        <div className="text-4xl font-bold text-white mb-8">{price}</div>
        <ul className="flex-1 space-y-3 mb-8">
          {features.map((feat) => (
            <li key={feat} className="flex items-center gap-3 text-[14px] text-gray-300">
              <div className="w-1.5 h-1.5 rounded-full bg-[#F26522] flex-shrink-0" />
              {feat}
            </li>
          ))}
        </ul>
        <button
          type="button"
          className="w-full py-3 rounded-full bg-[#F26522] text-white font-medium hover:bg-[#e05a1a] transition-colors duration-300"
        >
          {ctaLabel}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-8 border border-gray-200 hover:border-[#F26522] transition-colors duration-300 flex flex-col">
      <h3 className="text-[18px] font-semibold text-gray-900 mb-2">{title}</h3>
      {description && <p className="text-[14px] text-gray-600 mb-6">{description}</p>}
      <div className="text-4xl font-bold text-gray-900 mb-8">{price}</div>
      <ul className="flex-1 space-y-3 mb-8">
        {features.map((feat) => (
          <li key={feat} className="flex items-center gap-3 text-[14px] text-gray-700">
            <div className="w-1.5 h-1.5 rounded-full bg-[#F26522] flex-shrink-0" />
            {feat}
          </li>
        ))}
      </ul>
      <button
        type="button"
        className="w-full py-3 rounded-full border border-gray-900 text-gray-900 font-medium hover:bg-gray-900 hover:text-white transition-colors duration-300"
      >
        {ctaLabel}
      </button>
    </div>
  );
}

export function MembershipsSection({ data }: { data?: MembershipSectionVM }) {
  const badge = data?.badge_text ?? "Memberships";
  const title = data?.title ?? "Plans for every stage of growth";
  const hasDynamic = data && data.plans.length > 0;

  return (
    <section className="bg-[#EFEFEF] pt-16 sm:pt-20 lg:pt-28 pb-16 sm:pb-20 lg:pb-28">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="flex items-center justify-center gap-3 mb-6 sm:mb-8">
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gray-900 text-white text-[11px] sm:text-[12px] font-semibold flex items-center justify-center">
            4
          </div>
          <div className="text-[12px] sm:text-[13px] font-medium border border-gray-300 rounded-full px-3 sm:px-4 py-1 sm:py-1.5 text-gray-900">
            {badge}
          </div>
        </div>

        <h2 className="text-center text-[clamp(1.75rem,5vw,3.2rem)] font-medium leading-[1.08] tracking-[-0.03em] text-gray-900 mb-10 sm:mb-16">
          {title}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {hasDynamic
            ? data.plans.map((plan) => (
                <PlanCard
                  key={plan.id}
                  isFeatured={plan.is_featured}
                  badgeText={plan.highlight_badge_text}
                  title={plan.title}
                  description={plan.description}
                  price={plan.price_text}
                  ctaLabel={plan.cta_label}
                  features={plan.features.map((feature) => feature.feature_text)}
                />
              ))
            : STATIC_PLANS.map((plan) => (
                <PlanCard
                  key={plan.title}
                  isFeatured={plan.is_featured}
                  badgeText={plan.highlight_badge_text}
                  title={plan.title}
                  description={plan.description}
                  price={plan.price_text}
                  ctaLabel={plan.cta_label}
                  features={plan.features}
                />
              ))}
        </div>
      </div>
    </section>
  );
}
