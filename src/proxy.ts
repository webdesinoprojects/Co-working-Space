import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { AUTH_COOKIE_OPTIONS, COOKIE_WRITE_OPTIONS } from "@/server/auth/cookie-options";

// This proxy refreshes the Supabase session on every protected admin request and
// redirects unauthenticated visitors to the login page.
//
// It is ALSO the only place that can durably persist a refreshed/rotated session
// token back to the browser: Supabase refresh tokens are single-use and rotate on
// every refresh, but Server Components cannot write cookies (see
// src/server/db/client.ts). If the proxy did not cover a protected route, the
// layout's getUser() would rotate the refresh token without being able to save the
// new one — terminating the session on the next request. So the proxy MUST run on
// every protected admin route (including the bare /admin dashboard).
export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions: AUTH_COOKIE_OPTIONS,
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
            supabaseResponse.cookies.set(name, value, {
              ...options,
              ...COOKIE_WRITE_OPTIONS,
            })
          );
        },
      },
    }
  );

  // IMPORTANT: Do not run any logic between createServerClient and getUser().
  // getUser() revalidates the token with the Supabase Auth server and, when the
  // access token is expiring, refreshes it and writes the rotated cookies onto
  // supabaseResponse via setAll above.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  if (!user) {
    // Unauthenticated: redirect to login, but copy the (possibly refreshed or
    // cleared) cookies from supabaseResponse onto the redirect. Supabase warns
    // that returning a fresh response WITHOUT these cookies makes the browser and
    // server go out of sync and terminates the session prematurely.
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    const redirectResponse = NextResponse.redirect(loginUrl);
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie);
    });
    return redirectResponse;
  }

  // IMPORTANT: return supabaseResponse as-is so the refreshed session cookies
  // reach the browser.
  return supabaseResponse;
}

export const config = {
  // Run on the bare /admin dashboard and every /admin/* route EXCEPT the auth
  // endpoints (/admin/login, /admin/logout).
  //
  // Why /admin must be covered: see the file header — the proxy is the only place
  // that can persist a rotated refresh token.
  //
  // Why login/logout must be EXCLUDED: Server Actions and Route Handlers run as
  // requests to the route they live on. The login Server Action (signInWithPassword)
  // and the logout Route Handler (signOut) both set Set-Cookie headers to write or
  // clear the session. If the proxy runs on those requests it returns its own
  // NextResponse and — on Vercel, where the proxy and the action execute in separate
  // contexts — drops the action's Set-Cookie. The session cookie then never reaches
  // the browser. Excluding these paths at the matcher level (per Next.js proxy docs)
  // lets the auth requests bypass the proxy so their Set-Cookie is delivered intact.
  //
  // Entry 1 covers the bare /admin dashboard (exact match). Entry 2 covers every
  // /admin/<segment> EXCEPT login and logout (negative lookahead, same form as the
  // documented `/((?!api).*)` pattern).
  matcher: ["/admin", "/admin/((?!login|logout).*)"],
};
