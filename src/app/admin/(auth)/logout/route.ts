import { NextRequest, NextResponse } from "next/server";
import { createSupabaseActionClient } from "@/server/db/client";

export async function GET(request: NextRequest) {
  const supabase = await createSupabaseActionClient();
  await supabase.auth.signOut();

  return NextResponse.redirect(new URL("/admin/login", request.url));
}
