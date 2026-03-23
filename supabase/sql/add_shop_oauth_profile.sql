-- Run in Supabase SQL Editor before relying on Google/Facebook OAuth shop creation.
-- Makes WhatsApp optional until /complete-profile; stores provider avatar on shops.

ALTER TABLE public.shops
  ADD COLUMN IF NOT EXISTS profile_image_url text;

ALTER TABLE public.shops
  ALTER COLUMN whatsapp_number DROP NOT NULL;

COMMENT ON COLUMN public.shops.profile_image_url IS 'Avatar URL from Google/Facebook OAuth (optional).';
