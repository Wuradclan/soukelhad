import 'server-only';

import type { SupabaseClient } from '@supabase/supabase-js';
import type { ActivityDayPoint, ActivityTotals } from '@/lib/analytics-types';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

export type { ActivityDayPoint, ActivityTotals } from '@/lib/analytics-types';

function numVisits(row: Record<string, unknown>): number {
  return Number(row.visits ?? 0) || 0;
}

function numViews(row: Record<string, unknown>): number {
  return Number(row.product_view_count ?? row.views ?? row.view_count ?? 0) || 0;
}

function numWa(row: Record<string, unknown>): number {
  return Number(row.wa_clicks ?? row.wa_click_count ?? 0) || 0;
}

/**
 * Moves or merges `daily_stats` rows from `sourceShopId` into `targetShopId` (same stat_date summed).
 */
async function mergeDailyStatsFromShopToShop(
  admin: SupabaseClient,
  sourceShopId: string,
  targetShopId: string
): Promise<void> {
  if (sourceShopId === targetShopId) return;

  const { data: sourceRows, error: fetchErr } = await admin
    .from('daily_stats')
    .select('*')
    .eq('shop_id', sourceShopId);

  if (fetchErr) {
    console.error('mergeDailyStatsFromShopToShop: fetch source', fetchErr.message);
    return;
  }
  if (!sourceRows?.length) return;

  for (const raw of sourceRows) {
    const row = raw as Record<string, unknown>;
    const statDate = row.stat_date;
    if (statDate == null) continue;

    const { data: targetRow } = await admin
      .from('daily_stats')
      .select('*')
      .eq('shop_id', targetShopId)
      .eq('stat_date', statDate)
      .maybeSingle();

    const t = targetRow as Record<string, unknown> | null;

    if (t) {
      const visits = numVisits(row) + numVisits(t);
      const views = numViews(row) + numViews(t);
      const wa = numWa(row) + numWa(t);

      const patch: Record<string, unknown> = {
        visits,
        wa_clicks: wa,
      };
      if ('product_view_count' in row || 'product_view_count' in t) {
        patch.product_view_count = views;
      }
      if ('views' in row || 'views' in t) {
        patch.views = views;
      }
      if (!('product_view_count' in patch) && !('views' in patch)) {
        patch.views = views;
      }

      const { error: upErr } = await admin
        .from('daily_stats')
        .update(patch)
        .eq('shop_id', targetShopId)
        .eq('stat_date', statDate);

      if (upErr) {
        console.error(
          'mergeDailyStatsFromShopToShop: merge update failed',
          upErr.message
        );
        continue;
      }

      const rowId = row.id;
      if (rowId != null) {
        await admin.from('daily_stats').delete().eq('id', rowId);
      } else {
        await admin
          .from('daily_stats')
          .delete()
          .eq('shop_id', sourceShopId)
          .eq('stat_date', statDate);
      }
    } else {
      const rowId = row.id;
      if (rowId != null) {
        const { error: mvErr } = await admin
          .from('daily_stats')
          .update({ shop_id: targetShopId })
          .eq('id', rowId);
        if (mvErr) {
          console.error(
            'mergeDailyStatsFromShopToShop: move by id failed',
            mvErr.message
          );
        }
      } else {
        const { error: mvErr } = await admin
          .from('daily_stats')
          .update({ shop_id: targetShopId })
          .eq('shop_id', sourceShopId)
          .eq('stat_date', statDate);
        if (mvErr) {
          console.error(
            'mergeDailyStatsFromShopToShop: move failed',
            mvErr.message
          );
        }
      }
    }
  }
}

/**
 * If the user has multiple `shops` rows or stats tied to an older shop id, merge into `activeShopId`.
 * Safe to call on every dashboard load (no-op when a single shop exists).
 */
export async function reconcileDailyStatsForUser(
  userId: string,
  activeShopId: string
): Promise<void> {
  const admin = createServiceRoleClient();
  if (!admin) return;

  const { data: shops, error } = await admin
    .from('shops')
    .select('id')
    .eq('user_id', userId);

  if (error) {
    console.error('reconcileDailyStatsForUser: shops query', error.message);
    return;
  }

  const ids = (shops ?? []).map((s) => s.id as string);
  const otherIds = ids.filter((id) => id !== activeShopId);

  for (const oldId of otherIds) {
    await mergeDailyStatsFromShopToShop(admin, oldId, activeShopId);
  }
}

function normalizeRow(row: Record<string, unknown>): {
  date: string;
  visits: number;
  views: number;
  waClicks: number;
} {
  const rawDate = row.stat_date ?? row.date ?? row.day;
  const ds = rawDate
    ? new Date(String(rawDate)).toISOString().slice(0, 10)
    : '';
  return {
    date: ds,
    visits: Number(row.visits ?? row.visit_count ?? 0) || 0,
    // DB source of truth: `product_view_count` (legacy / RPC may still expose `views`)
    views:
      Number(
        row.product_view_count ?? row.views ?? row.view_count ?? 0
      ) || 0,
    waClicks: Number(row.wa_clicks ?? row.wa_click_count ?? 0) || 0,
  };
}

function buildLast7Days(
  byDay: Map<string, { visits: number; views: number; waClicks: number }>
): ActivityDayPoint[] {
  const out: ActivityDayPoint[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const v = byDay.get(key);
    out.push({
      date: key,
      visits: v?.visits ?? 0,
      views: v?.views ?? 0,
      waClicks: v?.waClicks ?? 0,
    });
  }
  return out;
}

/**
 * Loads all `daily_stats` rows for a shop, sums lifetime totals, and builds a last-7-days series (zeros for missing days).
 * Expects columns: shop_id, stat_date (or date/day), visits, product_view_count (or views), wa_clicks (see normalizeRow).
 */
export async function getShopAnalytics(shopId: string): Promise<{
  totals: ActivityTotals;
  last7Days: ActivityDayPoint[];
}> {
  try {
    const admin = createServiceRoleClient();
    if (!admin) {
      console.error('getShopAnalytics: SUPABASE_SERVICE_ROLE_KEY missing');
      return {
        totals: { visits: 0, views: 0, waClicks: 0 },
        last7Days: buildLast7Days(new Map()),
      };
    }
    const { data, error } = await admin.from('daily_stats').select('*').eq('shop_id', shopId);

    if (error) {
      console.error('getShopAnalytics: query failed', error.message);
      return {
        totals: { visits: 0, views: 0, waClicks: 0 },
        last7Days: buildLast7Days(new Map()),
      };
    }

    const rows = (data ?? []).map((r) => normalizeRow(r as Record<string, unknown>));

    const totals = rows.reduce<ActivityTotals>(
      (acc, r) => ({
        visits: acc.visits + r.visits,
        views: acc.views + r.views,
        waClicks: acc.waClicks + r.waClicks,
      }),
      { visits: 0, views: 0, waClicks: 0 }
    );

    const byDay = new Map<string, { visits: number; views: number; waClicks: number }>();
    for (const r of rows) {
      if (!r.date) continue;
      const prev = byDay.get(r.date) ?? { visits: 0, views: 0, waClicks: 0 };
      byDay.set(r.date, {
        visits: prev.visits + r.visits,
        views: prev.views + r.views,
        waClicks: prev.waClicks + r.waClicks,
      });
    }

    return {
      totals,
      last7Days: buildLast7Days(byDay),
    };
  } catch (e) {
    console.error('getShopAnalytics:', e);
    return {
      totals: { visits: 0, views: 0, waClicks: 0 },
      last7Days: buildLast7Days(new Map()),
    };
  }
}
