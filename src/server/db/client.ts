import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * @param opts.canSetCookies - Pass `true` ONLY from Server Actions (login).
 *   Server Components must never write cookies — doing so overwrites the
 *   session with bad options and kills auth on HTTPS deployments.
 */
export async function createSupabaseServerClient(
  opts?: { canSetCookies?: boolean }
) {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          // No-op by default — prevents Server Components from
          // overwriting the auth cookie during page renders.
          if (!opts?.canSetCookies) return;

          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, {
              ...options,
              secure: process.env.NODE_ENV === "production",
            });
          });
        },
      },
    }
  );
}
