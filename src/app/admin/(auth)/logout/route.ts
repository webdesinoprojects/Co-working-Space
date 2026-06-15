import { NextRequest, NextResponse } from "next/server";
import { createSupabaseActionClient } from "@/server/db/client";

// Logout MUST be POST, never GET. Next.js prefetches every <Link> in the
// viewport in production — a GET logout route gets prefetched and silently signs
// the user out right after they log in. A POST is never prefetched.
export async function POST(request: NextRequest) {
  const supabase = await createSupabaseActionClient();
  await supabase.auth.signOut();

  // 303 so the browser follows the redirect with a GET (not a repeated POST).
  return NextResponse.redirect(new URL("/admin/login", request.url), {
    status: 303,
  });
}
