-- Optional one-off: normalize slugs that still contain spaces or mismatch the shop name.
-- Prefer letting the app run (complete-profile, Instagram callback, OAuth sync) to avoid duplicate slug conflicts.
-- Review results in a SELECT before UPDATE.

/*
SELECT id, name, slug,
  trim(both '-' FROM regexp_replace(lower(trim(name)), '[^a-z0-9]+', '-', 'g')) AS suggested_slug
FROM public.shops
WHERE slug ~ '\s' OR slug <> trim(both '-' FROM regexp_replace(lower(trim(name)), '[^a-z0-9]+', '-', 'g'));
*/
