'use client';

import React from 'react';
import { useTranslation } from '@/components/LanguageProvider';
import {
  metaAppId,
  resolveInstagramRedirectUriClient,
} from '@/lib/env';

/** Keys relevant to Instagram OAuth + Supabase (for debugging "missing env" alerts). */
function logInstagramEnvCheck(context: string) {
  const payload = {
    NEXT_PUBLIC_META_APP_ID: !!process.env.NEXT_PUBLIC_META_APP_ID?.trim(),
    NEXT_PUBLIC_META_REDIRECT_URI: !!process.env.NEXT_PUBLIC_META_REDIRECT_URI?.trim(),
    NEXT_PUBLIC_REDIRECT_URI: !!process.env.NEXT_PUBLIC_REDIRECT_URI?.trim(),
    NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL?.trim(),
    SUPABASE_URL: !!process.env.SUPABASE_URL?.trim(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim(),
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
      !!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim(),
    SUPABASE_ANON_KEY: !!process.env.SUPABASE_ANON_KEY?.trim(),
  };
  console.log(`[InstagramConnect] CHECKING ${context}:`, payload);
}

/**
 * Facebook Login for Instagram API — manual OAuth URL (not Supabase signInWithOAuth).
 * Mirrors Meta’s recommended query params: reauthenticate + popup + fresh state each run.
 */
export function signInWithInstagram(onConfigError: () => void): void {
  logInstagramEnvCheck('signInWithInstagram');

  const appId = metaAppId();
  const { uri: redirectUri, usedOriginFallback } =
    resolveInstagramRedirectUriClient();

  console.log('[InstagramConnect] RESOLVED:', {
    appId: !!appId,
    redirectUri: !!redirectUri,
    usedOriginFallback,
    redirectUriPreview: redirectUri
      ? `${redirectUri.slice(0, 48)}${redirectUri.length > 48 ? '…' : ''}`
      : '(empty)',
  });

  if (!appId || !redirectUri) {
    console.error(
      '[InstagramConnect] Missing Meta OAuth config. Need NEXT_PUBLIC_META_APP_ID and a redirect URI (NEXT_PUBLIC_META_REDIRECT_URI or NEXT_PUBLIC_REDIRECT_URI, or browser origin fallback).'
    );
    onConfigError();
    return;
  }

  if (usedOriginFallback) {
    console.warn(
      '[InstagramConnect] Using redirect URI from current origin. Add this exact URL to Meta → Valid OAuth Redirect URIs:',
      redirectUri
    );
  }

  const scope = [
    'instagram_basic',
    'instagram_manage_insights',
    'pages_show_list',
    'pages_read_engagement',
    'business_management',
  ].join(',');

  // Fresh OAuth: new state on every click (CSRF + avoids stale dialog cache).
  const state =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? `ig-${crypto.randomUUID()}`
      : `ig-${Date.now()}-${Math.random().toString(36).slice(2)}`;

  const params = new URLSearchParams({
    client_id: appId,
    redirect_uri: redirectUri,
    scope,
    response_type: 'code',
    // Same intent as signInWithOAuth queryParams for Facebook: force password / Switch account
    auth_type: 'reauthenticate',
    display: 'popup',
    state,
  });

  const authUrl = `https://www.facebook.com/v19.0/dialog/oauth?${params.toString()}`;

  // Best-effort: avoid reusing any in-tab FB session hints before full navigation.
  try {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem('fb_sso_status');
    }
  } catch {
    /* ignore */
  }

  window.location.assign(authUrl);
}

export default function InstagramConnectButton() {
  const { t } = useTranslation();

  return (
    <button
      onClick={() =>
        signInWithInstagram(() => alert(t('instagramConnect.configError')))
      }
      type="button"
      className="group relative inline-flex items-center justify-center px-8 py-4 font-black text-white transition-all duration-300 bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] rounded-2xl hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl overflow-hidden"
    >
      <div className="absolute inset-0 w-full h-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
      <svg className="w-5 h-5 me-3" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
      {t('instagramConnect.button')}
    </button>
  );
}
