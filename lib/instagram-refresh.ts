/**
 * Long-lived Instagram / Facebook user tokens should be re-exchanged before expiry.
 * Meta recommends refreshing before ~60 days; we refresh if last refresh is older than 45 days.
 */

import type { SupabaseClient } from '@supabase/supabase-js';

const FORTY_FIVE_DAYS_MS = 45 * 24 * 60 * 60 * 1000;

export function instagramTokenNeedsRefresh(
  igLastRefreshed: string | null | undefined
): boolean {
  if (!igLastRefreshed) return true;
  const t = new Date(igLastRefreshed).getTime();
  if (Number.isNaN(t)) return true;
  return Date.now() - t > FORTY_FIVE_DAYS_MS;
}

async function exchangeLongLivedToken(currentToken: string): Promise<string | null> {
  const appId = process.env.NEXT_PUBLIC_META_APP_ID;
  const secret = process.env.META_APP_SECRET;
  if (!appId || !secret) {
    console.error('instagram-refresh: missing NEXT_PUBLIC_META_APP_ID or META_APP_SECRET');
    return null;
  }

  const url = new URL('https://graph.facebook.com/v19.0/oauth/access_token');
  url.searchParams.set('grant_type', 'fb_exchange_token');
  url.searchParams.set('client_id', appId);
  url.searchParams.set('client_secret', secret);
  url.searchParams.set('fb_exchange_token', currentToken);

  const res = await fetch(url.toString());
  const data = (await res.json()) as {
    access_token?: string;
    error?: { message?: string };
  };

  if (data.error) {
    console.error('instagram-refresh: Graph error', data.error.message);
    return null;
  }
  return data.access_token ?? null;
}

type ShopTokenRow = {
  id: string;
  ig_access_token: string | null;
  ig_last_refreshed: string | null;
};

/**
 * If the token is stale, exchanges it for a new long-lived token and updates `shops` (service role).
 * Returns the access token to use for Graph API calls (new or existing).
 */
export async function ensureInstagramAccessTokenFresh(
  shop: ShopTokenRow,
  supabaseService: SupabaseClient
): Promise<string | null> {
  const current = shop.ig_access_token;
  if (!current) return null;

  if (!instagramTokenNeedsRefresh(shop.ig_last_refreshed)) {
    return current;
  }

  const newToken = await exchangeLongLivedToken(current);
  if (!newToken) {
    return current;
  }

  const now = new Date().toISOString();
  const { error } = await supabaseService
    .from('shops')
    .update({
      ig_access_token: newToken,
      ig_last_refreshed: now,
    })
    .eq('id', shop.id);

  if (error) {
    console.error('instagram-refresh: Supabase update failed', error.message);
    return current;
  }

  return newToken;
}
