import 'server-only';

import type { ActivityDayPoint, ActivityTotals } from '@/lib/analytics-types';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

export type { ActivityDayPoint, ActivityTotals } from '@/lib/analytics-types';

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
