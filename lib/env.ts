/**
 * Env resolution with Vercel / dashboard naming fallbacks.
 * Prefer `NEXT_PUBLIC_*` names documented in `.env.example`.
 */

export function publicSupabaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ||
    process.env.SUPABASE_URL?.trim() ||
    ''
  )
}

export function publicSupabaseAnonKey(): string {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ||
    process.env.SUPABASE_ANON_KEY?.trim() ||
    ''
  )
}

/** Meta App ID for Instagram / Facebook Login (server + client). */
export function metaAppId(): string {
  return process.env.NEXT_PUBLIC_META_APP_ID?.trim() || ''
}

/**
 * OAuth redirect URI registered in Meta app. Accepts common dashboard typos:
 * `NEXT_PUBLIC_META_REDIRECT_URI` or `NEXT_PUBLIC_REDIRECT_URI`.
 */
export function metaRedirectUriFromEnv(): string {
  return (
    process.env.NEXT_PUBLIC_META_REDIRECT_URI?.trim() ||
    process.env.NEXT_PUBLIC_REDIRECT_URI?.trim() ||
    ''
  )
}

/**
 * Client-only: if Meta redirect env vars are missing, use current origin + Instagram callback path.
 * You must register this exact URL in the Meta app (same as `NEXT_PUBLIC_*` in production).
 */
export function resolveInstagramRedirectUriClient(): {
  uri: string;
  usedOriginFallback: boolean;
} {
  const fromEnv = metaRedirectUriFromEnv();
  if (fromEnv) {
    return { uri: fromEnv, usedOriginFallback: false };
  }
  if (typeof window !== 'undefined') {
    return {
      uri: `${window.location.origin}/api/auth/instagram/callback`,
      usedOriginFallback: true,
    };
  }
  return { uri: '', usedOriginFallback: false };
}
