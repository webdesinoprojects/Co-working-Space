"use client";

import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import { ContactSection } from "@/components/ContactSection";
import type { ContactSectionVM } from "@/features/homepage/types";

export function ConnectPageContent({ data }: { data?: ContactSectionVM }) {
  const params = useSearchParams();
  const interest = params.get("interest") ?? undefined;
  return (
    <main className="min-h-screen bg-white font-sans">
      <Navbar />
      <ContactSection data={data} initialInterest={interest} sourcePath="/connect" />
    </main>
  );
}
