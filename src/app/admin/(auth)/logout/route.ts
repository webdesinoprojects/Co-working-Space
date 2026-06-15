import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/server/db/client";

export async function GET(request: NextRequest) {
  const supabase = await createSupabaseServerClient({ canSetCookies: true });
  await supabase.auth.signOut();

  return NextResponse.redirect(new URL("/admin/login", request.url));
}
