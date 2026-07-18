import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import { getPrivacyPolicyPage } from "@/server/repositories/privacy-policy";
import { getPublicPageMetadata } from "@/server/seo";

type PolicyBlock =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] };

function parsePolicyContent(content: string): PolicyBlock[] {
  const blocks: PolicyBlock[] = [];
  const paragraphLines: string[] = [];
  const listItems: string[] = [];

  const flushParagraph = () => {
    if (paragraphLines.length === 0) return;
    blocks.push({ type: "paragraph", text: paragraphLines.join(" ") });
    paragraphLines.length = 0;
  };

  const flushList = () => {
    if (listItems.length === 0) return;
    blocks.push({ type: "list", items: [...listItems] });
    listItems.length = 0;
  };

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) {
      flushParagraph();
      flushList();
      continue;
    }

    if (line.startsWith("## ")) {
      flushParagraph();
      flushList();
      blocks.push({ type: "heading", text: line.replace(/^##\s+/, "") });
      continue;
    }

    if (line.startsWith("- ")) {
      flushParagraph();
      listItems.push(line.replace(/^-\s+/, ""));
      continue;
    }

    flushList();
    paragraphLines.push(line);
  }

  flushParagraph();
  flushList();
  return blocks;
}

export async function generateMetadata(): Promise<Metadata> {
  return getPublicPageMetadata("/privacy-policy");
}

export default async function PrivacyPolicyPage() {
  const page = await getPrivacyPolicyPage();
  const blocks = parsePolicyContent(page.body_content);

  return (
    <main className="min-h-screen bg-[#faf8f5] font-sans text-gray-900">
      <Navbar />

      <section className="px-5 pb-20 pt-40 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12">
            <p className="mb-4 text-[12px] font-bold uppercase tracking-widest text-[#F26522]">
              {page.effective_date_label}
            </p>
            <h1 className="text-[clamp(2.5rem,6vw,4.75rem)] font-extrabold leading-[1.05] tracking-tight">
              {page.headline}
            </h1>
            <p className="mt-6 max-w-3xl text-[17px] leading-8 text-gray-600">
              {page.intro_text}
            </p>
          </div>

          <div className="space-y-8 border-t border-gray-200 pt-10">
            {blocks.map((block, index) => {
              if (block.type === "heading") {
                return (
                  <h2
                    key={`${block.type}-${index}`}
                    className="pt-4 text-2xl font-bold tracking-tight text-gray-900"
                  >
                    {block.text}
                  </h2>
                );
              }

              if (block.type === "list") {
                return (
                  <ul
                    key={`${block.type}-${index}`}
                    className="list-disc space-y-3 pl-6 text-[16px] leading-8 text-gray-600"
                  >
                    {block.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                );
              }

              return (
                <p
                  key={`${block.type}-${index}`}
                  className="text-[16px] leading-8 text-gray-600"
                >
                  {block.text}
                </p>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
