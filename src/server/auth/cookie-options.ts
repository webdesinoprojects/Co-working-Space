// Shared Supabase auth cookie options.
//
// Dependency-free on purpose: this is imported by BOTH the server client
// (src/server/db/client.ts, which uses next/headers) and the proxy
// (src/proxy.ts, which runs in the proxy runtime where next/headers is not
// available). Keeping it free of other imports avoids pulling server-only or
// next/headers into the proxy bundle.
//
// Both clients MUST use the same options so they read and write the same cookie.
export const AUTH_COOKIE_OPTIONS = {
  // Keep admins signed in for 30 days instead of forcing a login every visit.
  maxAge: 60 * 60 * 24 * 30, // seconds
  path: "/",
  sameSite: "lax" as const,
};
