-- LEGACY: superseded by `daily_stats` + `track_activity` RPC.
-- Safe to skip on new projects. Use `remove_legacy_shop_counters.sql` after migration.
-- Counter for WhatsApp "Order" clicks from the public shop page.
ALTER TABLE public.shops
  ADD COLUMN IF NOT EXISTS wa_clicks integer NOT NULL DEFAULT 0;

COMMENT ON COLUMN public.shops.wa_clicks IS
  'Number of times visitors opened the Order on WhatsApp link for this shop.';
