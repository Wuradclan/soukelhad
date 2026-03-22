-- Reference: RPC expected by `trackActivity` in app/shop/actions.ts
-- Params (PostgREST / Supabase JS): { p_shop_id: uuid, p_activity: text }
-- Values for p_activity: 'visit' | 'view' | 'wa_click'
--
-- If your function already exists in Supabase, ensure the argument names match PostgREST.

/*
CREATE OR REPLACE FUNCTION public.track_activity(p_shop_id uuid, p_activity text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  d date := (timezone('utc', now()))::date;
  v int := 0;
  w int := 0;
  c int := 0;
BEGIN
  IF p_activity = 'visit' THEN v := 1; END IF;
  IF p_activity = 'view' THEN w := 1; END IF;
  IF p_activity = 'wa_click' THEN c := 1; END IF;

  INSERT INTO public.daily_stats (shop_id, stat_date, visits, views, wa_clicks)
  VALUES (p_shop_id, d, v, w, c)
  ON CONFLICT (shop_id, stat_date) DO UPDATE SET
    visits = public.daily_stats.visits + EXCLUDED.visits,
    views = public.daily_stats.views + EXCLUDED.views,
    wa_clicks = public.daily_stats.wa_clicks + EXCLUDED.wa_clicks;
END;
$$;

REVOKE ALL ON FUNCTION public.track_activity(uuid, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.track_activity(uuid, text) TO service_role;
*/
