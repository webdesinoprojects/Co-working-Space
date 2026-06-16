import Link from "next/link";
import Navbar from "@/components/Navbar";
import { getWorkspaceOverview, getActiveWorkspaceList } from "@/server/repositories/workspaces";

export const dynamic = "force-dynamic";

export default async function WorkspacesPage() {
  const [overview, workspaces] = await Promise.all([
    getWorkspaceOverview(),
    getActiveWorkspaceList(),
  ]);

  const badge = overview?.badge_text ?? "Spaces";
  const title = overview?.title ?? "Workspaces tailored for ambitious teams.";
  const body = overview?.body_text ?? "From private suites to dedicated desks, discover environments engineered for focus, collaboration, and growth.";

  const FALLBACK_IMG = "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800";

  return (
    <main className="min-h-screen bg-[#F5F5F5] font-sans">
      <Navbar />

      {/* HEADER SECTION */}
      <section className="pt-32 pb-16 px-5 sm:px-8 lg:px-12 max-w-[1440px] mx-auto">
        <div className="flex flex-col gap-6 max-w-4xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center overflow-hidden hover:scale-105 transition-transform border border-gray-200">
              <img src="/alley_logo.png" alt="Alley Workspace Logo" className="w-[70%] h-[70%] object-contain" />
            </div>
            <div className="text-[13px] sm:text-[14px] font-medium bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full px-4 py-1.5 text-gray-900 shadow-sm">
              {badge}
            </div>
          </div>
          <h1 className="text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-[1.05] tracking-tight text-gray-900">
            {title}
          </h1>
          <p className="text-[16px] sm:text-[18px] text-gray-600 leading-relaxed max-w-2xl">
            {body}
          </p>
        </div>
      </section>

      {/* WORKSPACES GRID */}
      <section className="pb-32 px-5 sm:px-8 lg:px-12 max-w-[1440px] mx-auto">
        {workspaces.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workspaces.map((ws) => (
              <Link
                key={ws.id}
                href={`/workspaces/${ws.slug}`}
                className="bg-white rounded-3xl p-6 h-[400px] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300 flex flex-col group"
              >
                <div className="w-full h-[60%] bg-gray-100 rounded-2xl mb-6 overflow-hidden flex-shrink-0">
                  <img
                    src={ws.overview_image?.url ?? FALLBACK_IMG}
                    alt={ws.overview_image?.alt ?? ws.card_title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="flex flex-col gap-2 flex-1">
                  <span className="text-xs font-semibold text-[#F26522] uppercase tracking-widest">
                    {ws.nav_label}
                  </span>
                  <h2 className="font-bold text-lg text-gray-900 leading-snug">
                    {ws.card_title}
                  </h2>
                  <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
                    {ws.card_description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-3xl p-6 h-[400px] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] animate-pulse">
                <div className="w-full h-[60%] bg-gray-100 rounded-2xl mb-6"></div>
                <div className="w-1/2 h-6 bg-gray-200 rounded-full mb-3"></div>
                <div className="w-3/4 h-4 bg-gray-100 rounded-full"></div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
