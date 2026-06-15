import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Lightweight auth gate: only checks if the Supabase auth cookie EXISTS.
// Does NOT create a Supabase client or call getUser() — those operations
// trigger token rotation and setAll which can corrupt cookies on some hosts.
// Actual session validation happens server-side in layouts/actions.
export async function proxy(request: NextRequest) {
  const hasAuthCookie = request.cookies
    .getAll()
    .some((c) => c.name.startsWith("sb-") && c.name.includes("auth-token"));

  if (!hasAuthCookie) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/((?!login|logout).*)"],
};
