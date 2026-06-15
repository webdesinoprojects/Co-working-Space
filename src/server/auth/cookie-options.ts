// Shared Supabase auth cookie options.
//
// Dependency-free on purpose: this is imported by BOTH the server client
// (src/server/db/client.ts, which uses next/headers) and the proxy
// (src/proxy.ts, which runs in the proxy runtime where next/headers is not
// available). Keeping it free of other imports avoids pulling server-only or
// next/headers into the proxy bundle.
//
// Both clients MUST use the same options so they read and write the same cookie.

const isProduction = process.env.NODE_ENV === "production";

// These are passed to createServerClient's `cookieOptions` so Supabase uses
// them as DEFAULTS for all cookies it creates.
export const AUTH_COOKIE_OPTIONS = {
  maxAge: 60 * 60 * 24 * 30, // 30 days
  path: "/",
  sameSite: "lax" as const,
  secure: isProduction,
};

// These are the options we FORCE on every Set-Cookie in the setAll callback.
// IMPORTANT: Do NOT include maxAge here! Supabase uses maxAge: 0 to delete
// stale cookie chunks during token rotation. Overriding it prevents cleanup
// and corrupts the session.
export const COOKIE_WRITE_OPTIONS = {
  path: "/",
  sameSite: "lax" as const,
  secure: isProduction,
};
