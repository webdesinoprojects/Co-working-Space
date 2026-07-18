import "server-only";
import { createSupabaseServerClient } from "@/server/db/client";
import type { PublicPageRoute } from "@/lib/seo-defaults";

export type PageSeoRow = {
  route_path: PublicPageRoute;
  meta_title: string | null;
  meta_description: string | null;
};

export async function getPageSeo(routePath: PublicPageRoute): Promise<PageSeoRow | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("page_seo")
    .select("route_path, meta_title, meta_description")
    .eq("route_path", routePath)
    .single();

  if (error || !data) return null;
  return data as PageSeoRow;
}
