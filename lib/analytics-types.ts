/** Shared types for dashboard analytics (safe to import from client components). */

export type ActivityDayPoint = {
  date: string;
  visits: number;
  /** Product views; mapped from DB `product_view_count` in `normalizeRow`. */
  views: number;
  waClicks: number;
};

export type ActivityTotals = {
  visits: number;
  /** Sum of daily `product_view_count` (via `views` in normalized rows). */
  views: number;
  waClicks: number;
};

export type ActivityType = 'visit' | 'view' | 'wa_click';
