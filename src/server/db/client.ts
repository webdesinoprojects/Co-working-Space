import "server-only";
import { createServerClient, createBrowserClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * For Server Components — reads cookie manually, creates a plain Supabase
 * client with the access token as a Bearer header. NEVER calls setAll,
 * NEVER uses @supabase/ssr's cookie adapter, NEVER modifies cookies.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  const all = cookieStore.getAll();

  // Reconstruct session from chunked cookies
  const prefix = all
    .filter((c) => c.name.startsWith("sb-") && c.name.includes("auth-token"))
    .sort((a, b) => a.name.localeCompare(b.name));

  let accessToken = "";
  if (prefix.length > 0) {
    try {
      const raw = prefix.map((c) => c.value).join("");
      const json = raw.startsWith("base64-")
        ? Buffer.from(raw.slice(7), "base64").toString()
        : raw;
      const session = JSON.parse(json);
      accessToken = session.access_token ?? "";
    } catch {
      // Malformed cookie — treat as unauthenticated
    }
  }

  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: {
      headers: accessToken
        ? { Authorization: `Bearer ${accessToken}` }
        : {},
    },
  });
}

/**
 * For Server Actions (login/logout) — uses @supabase/ssr with full cookie
 * read/write via next/headers. This is the ONLY place cookies are modified.
 */
export async function createSupabaseActionClient() {
  const cookieStore = await cookies();

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, {
            ...options,
            path: "/",
            sameSite: "lax" as const,
            secure: true,
            httpOnly: false,
          });
        });
      },
    },
  });
}
