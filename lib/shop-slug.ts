import type { SupabaseClient } from '@supabase/supabase-js'

/** Latin slug from shop name (Arabic-only names yield empty → use fallback). */
export function slugFromShopName(raw: string): string {
  return raw
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

/**
 * URL-safe slug from a display name: lowercase, spaces → hyphens, strip specials.
 * Alias for {@link slugFromShopName} — use in save/update flows.
 */
export function slugifyShopName(raw: string): string {
  return slugFromShopName(raw)
}

export function fallbackSlugFromUserId(userId: string): string {
  return `boutique-${userId.replace(/-/g, '').slice(0, 12)}`
}

export type EnsureUniqueSlugOptions = {
  /** When updating an existing shop, allow keeping its current slug if it already owns the candidate. */
  excludeUserId?: string
}

/**
 * Reserves a slug unique in `shops.slug` by appending -2, -3, … if needed.
 * Pass `excludeUserId` when regenerating slug for a shop that already has a row.
 */
export async function ensureUniqueShopSlug(
  admin: SupabaseClient,
  baseSlug: string,
  userId: string,
  options?: EnsureUniqueSlugOptions
): Promise<string> {
  const base = baseSlug || fallbackSlugFromUserId(userId)
  let n = 0
  for (;;) {
    const slug = n === 0 ? base : `${base}-${n}`
    const { data } = await admin
      .from('shops')
      .select('user_id')
      .eq('slug', slug)
      .maybeSingle()
    if (!data) return slug
    if (options?.excludeUserId && data.user_id === options.excludeUserId) {
      return slug
    }
    n += 1
    if (n > 500) {
      return `${fallbackSlugFromUserId(userId)}-${Date.now()}`
    }
  }
}

/**
 * Computes the canonical slug for a shop name and ensures uniqueness (same merchant may keep their slug).
 */
export async function syncShopSlugForUser(
  admin: SupabaseClient,
  userId: string,
  shopName: string | null | undefined
): Promise<string | null> {
  const trimmed = shopName?.trim()
  if (!trimmed) return null
  return ensureUniqueShopSlug(
    admin,
    slugifyShopName(trimmed),
    userId,
    { excludeUserId: userId }
  )
}
