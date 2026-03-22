-- Run AFTER `daily_stats` + `track_activity` are verified in production.
-- Removes the old non-historical counter on `shops` and the obsolete RPC.

ALTER TABLE public.shops
  DROP COLUMN IF EXISTS wa_clicks;

DROP FUNCTION IF EXISTS public.increment_wa_clicks(uuid);
