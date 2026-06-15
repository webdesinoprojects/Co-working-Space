import "server-only";
import { createClient } from "@supabase/supabase-js";

// This client bypasses RLS. Only use in Server Actions and Route Handlers
// that have already verified the caller is an authenticated admin.
// NEVER import this file from client components.
export function createSupabaseAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
