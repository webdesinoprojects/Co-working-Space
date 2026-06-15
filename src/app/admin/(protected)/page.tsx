import { getAdminProfile } from "@/server/auth/session";
import { createSupabaseServerClient } from "@/server/db/client";
import { DashboardClient } from "./DashboardClient";

export default async function AdminDashboardPage() {
  const [profile, data] = await Promise.all([getAdminProfile(), fetchDashboardData()]);

  const displayName =
    profile?.display_name ??
    (profile?.email ? profile.email.split("@")[0] : null);

  return <DashboardClient name={displayName} {...data} />;
}

async function fetchDashboardData() {
  const supabase = await createSupabaseServerClient();

  const yearAgo = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString();

  const [msgRes, mediaRes, recentRes, workspacesRes, faqRes] = await Promise.all([
    supabase
      .from("contact_messages")
      .select("id, status, interest, created_at")
      .gte("created_at", yearAgo)
      .order("created_at", { ascending: true }),
    supabase.from("media_assets").select("id", { count: "exact", head: true }),
    supabase
      .from("contact_messages")
      .select("id, full_name, email, interest, status, created_at")
      .order("created_at", { ascending: false })
      .limit(4),
    supabase.from("workspaces").select("id", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("faq_items").select("id", { count: "exact", head: true }).eq("is_active", true),
  ]);

  const messages = msgRes.data ?? [];
  const mediaCount = mediaRes.error ? 0 : (mediaRes.count ?? 0);
  const activeWorkspaces = workspacesRes.error ? 0 : (workspacesRes.count ?? 0);
  const activeFaqItems = faqRes.error ? 0 : (faqRes.count ?? 0);

  // Aggregate counts
  const statusMap: Record<string, number> = {};
  const interestMap: Record<string, number> = {};
  const dayMap: Record<string, number> = {};

  for (const m of messages) {
    statusMap[m.status] = (statusMap[m.status] ?? 0) + 1;
    const key = m.interest?.trim() || "Other";
    interestMap[key] = (interestMap[key] ?? 0) + 1;
    const day = (m.created_at as string).slice(0, 10);
    dayMap[day] = (dayMap[day] ?? 0) + 1;
  }

  // Build 365 days of daily points
  const dailyData: { date: string; label: string; shortLabel: string; count: number }[] = [];
  for (let i = 364; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    const dateStr = d.toISOString().slice(0, 10);
    dailyData.push({
      date: dateStr,
      label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      shortLabel: d.toLocaleDateString("en-US", { weekday: "short" }),
      count: dayMap[dateStr] ?? 0,
    });
  }

  // Monthly aggregation for 1Y view
  const monthMap: Record<string, number> = {};
  for (const pt of dailyData) {
    const monthKey = pt.date.slice(0, 7); // YYYY-MM
    monthMap[monthKey] = (monthMap[monthKey] ?? 0) + pt.count;
  }
  const monthlyData = Object.entries(monthMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, count]) => {
      const d = new Date(key + "-01");
      return {
        date: key,
        label: d.toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
        count,
      };
    });

  const byInterest = Object.entries(interestMap)
    .map(([interest, count]) => ({ interest, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    totalMessages: messages.length,
    newMessages: statusMap["new"] ?? 0,
    inProgress: statusMap["in_progress"] ?? 0,
    resolved: statusMap["resolved"] ?? 0,
    spam: statusMap["spam"] ?? 0,
    mediaCount,
    activeWorkspaces,
    activeFaqItems,
    dailyData,
    monthlyData,
    byInterest,
    recentMessages: (recentRes.data ?? []) as {
      id: string;
      full_name: string;
      email: string;
      interest: string | null;
      status: string;
      created_at: string;
    }[],
  };
}
