import "server-only";
import { createSupabaseServerClient } from "@/server/db/client";
import {
  PAGE_SEO_DEFAULTS,
  PUBLIC_PAGE_ROUTES,
  type PublicPageRoute,
} from "@/lib/seo-defaults";
import type { AdminPageSeoVM } from "@/features/admin/types";

type PageSeoRow = {
  route_path: PublicPageRoute;
  meta_title: string | null;
  meta_description: string | null;
};

export async function getAdminPageSeoItems(): Promise<AdminPageSeoVM[]> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("page_seo")
    .select("route_path, meta_title, meta_description")
    .in("route_path", [...PUBLIC_PAGE_ROUTES]);

  const rows = new Map(
    ((data ?? []) as PageSeoRow[]).map((row) => [row.route_path, row])
  );

  return PUBLIC_PAGE_ROUTES.map((routePath) => {
    const defaults = PAGE_SEO_DEFAULTS[routePath];
    const row = rows.get(routePath);

    return {
      route_path: routePath,
      label: defaults.label,
      fallback_title: defaults.title,
      fallback_description: defaults.description,
      meta_title: row?.meta_title ?? null,
      meta_description: row?.meta_description ?? null,
    };
  });
}
