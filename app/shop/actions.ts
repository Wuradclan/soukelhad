'use server';

import { createServerClient } from '@supabase/ssr';
import type { ActivityType } from '@/lib/analytics-types';

/**
 * Unified analytics: increments the correct counter for today in `daily_stats`
 * via the Supabase `track_activity` RPC (atomic, no race).
 */
export async function trackActivity(shopId: string, activity: ActivityType) {
  if (!shopId || !process.env.SUPABASE_SERVICE_ROLE_KEY) return;

  const admin = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { cookies: { getAll: () => [], setAll: () => {} } }
  );

  const { error } = await admin.rpc('track_activity', {
    p_shop_id: shopId,
    p_activity: activity,
  });

  if (error) {
    console.error('trackActivity: rpc failed', error.message, { shopId, activity });
  }
}
