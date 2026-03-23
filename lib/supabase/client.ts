import { createBrowserClient } from '@supabase/ssr'
import { publicSupabaseAnonKey, publicSupabaseUrl } from '@/lib/env'

export function createClient() {
  const url = publicSupabaseUrl()
  const key = publicSupabaseAnonKey()

  if (process.env.NODE_ENV === 'development') {
    console.log('[Supabase client] CHECKING:', {
      NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL?.trim(),
      SUPABASE_URL: !!process.env.SUPABASE_URL?.trim(),
      resolvedUrl: !!url,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim(),
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
        !!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim(),
      SUPABASE_ANON_KEY: !!process.env.SUPABASE_ANON_KEY?.trim(),
      resolvedKey: !!key,
    })
  }

  if (!url || !key) {
    console.warn(
      '[Supabase client] Missing URL or anon key. Prefer NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY (fallbacks: SUPABASE_URL, publishable/anon).'
    );
  }

  return createBrowserClient(url, key)
}
