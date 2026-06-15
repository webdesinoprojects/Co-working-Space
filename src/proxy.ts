import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

// This proxy handles UX redirects only. It is NOT the security boundary.
// All admin routes enforce auth in their layout server components and server actions.
// See: src/server/auth/guards.ts, src/app/admin/(protected)/layout.tsx
export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session if token is expiring - must happen before any redirect checks
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Redirect unauthenticated visitors away from protected admin pages
  const isProtectedAdmin =
    pathname.startsWith("/admin") && !pathname.startsWith("/admin/login");

  if (isProtectedAdmin && !user) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return supabaseResponse;
}

export const config = {
  // Exclude the auth endpoints (/admin/login, /admin/logout) from the proxy.
  //
  // Server Actions and Route Handlers run as POST/GET requests to the route
  // they live on. The login Server Action (signInWithPassword) and the logout
  // Route Handler (signOut) BOTH set Set-Cookie headers to write/clear the
  // Supabase session. If the proxy runs on those requests, it returns its own
  // NextResponse and — on Vercel, where the Edge proxy and the action run in
  // separate execution contexts — the proxy response drops the action's
  // Set-Cookie headers. The session cookie never reaches the browser, so every
  // following request is unauthenticated and bounces back to /admin/login.
  //
  // Excluding these paths at the matcher level (per Next.js proxy docs) means
  // the auth requests bypass the proxy entirely and their Set-Cookie headers
  // are delivered intact. Real auth is still enforced by requireAdmin() in the
  // protected layout, so security is unaffected.
  matcher: ["/admin/((?!login|logout).*)"],
};
