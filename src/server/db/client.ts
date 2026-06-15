import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Canonical @supabase/ssr server client. Used by Server Components, the proxy,
// and Server Actions. In a Server Component, setAll throws (cookies are
// read-only there) and is ignored — the proxy refreshes the session on the next
// request. In a Server Action / Route Handler, setAll succeeds and the login or
// logout cookies are written to the response.
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Called from a Server Component — cookies are read-only here.
          // Safe to ignore; the proxy refreshes the session on the next request.
        }
      },
    },
  });
}

// Login/logout Server Actions use the same client.
export const createSupabaseActionClient = createSupabaseServerClient;
