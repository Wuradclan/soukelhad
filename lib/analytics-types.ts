/** Shared types for dashboard analytics (safe to import from client components). */

export type ActivityDayPoint = {
  date: string;
  visits: number;
  views: number;
  waClicks: number;
};

export type ActivityTotals = {
  visits: number;
  views: number;
  waClicks: number;
};

export type ActivityType = 'visit' | 'view' | 'wa_click';
