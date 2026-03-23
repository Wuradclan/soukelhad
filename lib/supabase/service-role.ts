import { createServerClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import { publicSupabaseUrl } from '@/lib/env';

/** Server-only client with the service role (bypasses RLS). Returns null if the key is missing. */
export function createServiceRoleClient(): SupabaseClient | null {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return null;
  }
  return createServerClient(
    publicSupabaseUrl(),
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { cookies: { getAll: () => [], setAll: () => {} } }
  );
}
