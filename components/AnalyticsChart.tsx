'use client';

import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { ActivityDayPoint } from '@/lib/analytics-types';
import type { Locale } from '@/lib/translations';

/** SoukElHad brand + semantic series colors */
const COLOR_VISITS = '#f59e0b';
const COLOR_VIEWS = '#64748b';
const COLOR_WA = '#10b981';

type ChartRow = ActivityDayPoint & { label: string };

export type AnalyticsChartProps = {
  /** Last 7 days of daily_stats-derived points */
  data: ActivityDayPoint[];
  locale: Locale;
  /** Short labels for the legend row (Visites / Vues / Clics) */
  legend: {
    visits: string;
    views: string;
    wa: string;
  };
  /** Centered message when the 7-day window has no activity */
  emptyOverlay: string;
};

function formatDayLabel(iso: string, locale: Locale) {
  try {
    return new Date(`${iso}T12:00:00.000Z`).toLocaleDateString(
      locale === 'ar' ? 'ar-MA' : 'fr-FR',
      { weekday: 'short', day: 'numeric', month: 'short' }
    );
  } catch {
    return iso;
  }
}

export function AnalyticsChart({ data, locale, legend, emptyOverlay }: AnalyticsChartProps) {
  const chartData = useMemo<ChartRow[]>(
    () =>
      data.map((d) => ({
        ...d,
        label: formatDayLabel(d.date, locale),
      })),
    [data, locale]
  );

  const isEmpty = useMemo(
    () =>
      chartData.length === 0 ||
      chartData.every((d) => d.visits + d.views + d.waClicks === 0),
    [chartData]
  );

  const chartBody = (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={chartData}
        margin={{ top: 4, right: 6, left: -16, bottom: 4 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#e2e8f0"
          vertical={false}
        />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 10, fill: '#475569' }}
          tickLine={false}
          axisLine={{ stroke: '#e2e8f0' }}
          interval={0}
          height={40}
        />
        <YAxis
          allowDecimals={false}
          tick={{ fontSize: 10, fill: '#475569' }}
          tickLine={false}
          axisLine={{ stroke: '#e2e8f0' }}
          width={36}
        />
        <Tooltip
          cursor={{ stroke: '#f59e0b', strokeWidth: 1, strokeDasharray: '4 4' }}
          contentStyle={{
            backgroundColor: '#ffffff',
            border: '1px solid #fed7aa',
            borderRadius: '12px',
            boxShadow: '0 12px 40px -12px rgba(15, 23, 42, 0.12)',
          }}
          labelStyle={{
            fontWeight: 800,
            color: '#0f172a',
            fontSize: 12,
            marginBottom: 6,
          }}
          itemStyle={{ fontSize: 12, color: '#334155' }}
        />
        <Line
          type="monotone"
          dataKey="visits"
          name={legend.visits}
          stroke={COLOR_VISITS}
          strokeWidth={isEmpty ? 1.5 : 2.5}
          strokeOpacity={isEmpty ? 0.2 : 1}
          dot={isEmpty ? false : { r: 3, strokeWidth: 2, fill: '#fff' }}
          activeDot={{ r: 6, strokeWidth: 2, fill: '#fff' }}
        />
        <Line
          type="monotone"
          dataKey="views"
          name={legend.views}
          stroke={COLOR_VIEWS}
          strokeWidth={isEmpty ? 1.5 : 2.5}
          strokeOpacity={isEmpty ? 0.2 : 1}
          dot={isEmpty ? false : { r: 3, strokeWidth: 2, fill: '#fff' }}
          activeDot={{ r: 6, strokeWidth: 2, fill: '#fff' }}
        />
        <Line
          type="monotone"
          dataKey="waClicks"
          name={legend.wa}
          stroke={COLOR_WA}
          strokeWidth={isEmpty ? 1.5 : 2.5}
          strokeOpacity={isEmpty ? 0.2 : 1}
          dot={isEmpty ? false : { r: 3, strokeWidth: 2, fill: '#fff' }}
          activeDot={{ r: 6, strokeWidth: 2, fill: '#fff' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );

  return (
    <div className="w-full min-w-0">
      {/* Legend on top — brand-forward */}
      <div className="mb-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-b border-slate-100 pb-4">
        <span className="inline-flex items-center gap-2 text-xs font-black tracking-tight text-slate-800">
          <span
            className="h-2.5 w-8 rounded-full"
            style={{ backgroundColor: COLOR_VISITS }}
            aria-hidden
          />
          {legend.visits}
        </span>
        <span className="inline-flex items-center gap-2 text-xs font-black tracking-tight text-slate-800">
          <span
            className="h-2.5 w-8 rounded-full"
            style={{ backgroundColor: COLOR_VIEWS }}
            aria-hidden
          />
          {legend.views}
        </span>
        <span className="inline-flex items-center gap-2 text-xs font-black tracking-tight text-slate-800">
          <span
            className="h-2.5 w-8 rounded-full"
            style={{ backgroundColor: COLOR_WA }}
            aria-hidden
          />
          {legend.wa}
        </span>
      </div>

      <div
        className={`relative h-[300px] w-full overflow-hidden rounded-2xl border ${
          isEmpty
            ? 'border-slate-200/80 bg-gradient-to-b from-slate-50 via-white to-orange-50/30'
            : 'border-orange-100/90 bg-white shadow-sm'
        }`}
      >
        {isEmpty && (
          <div
            className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-white/55 px-4 backdrop-blur-[2px]"
            aria-live="polite"
          >
            <p className="text-center text-sm font-semibold text-slate-600">
              {emptyOverlay}
            </p>
          </div>
        )}
        <div className="h-full w-full p-2 sm:p-3">{chartBody}</div>
      </div>
    </div>
  );
}
