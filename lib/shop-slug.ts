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

export function fallbackSlugFromUserId(userId: string): string {
  return `boutique-${userId.replace(/-/g, '').slice(0, 12)}`
}

/**
 * Reserves a slug unique in `shops.slug` by appending -2, -3, … if needed.
 */
export async function ensureUniqueShopSlug(
  admin: SupabaseClient,
  baseSlug: string,
  userId: string
): Promise<string> {
  const base = baseSlug || fallbackSlugFromUserId(userId)
  let n = 0
  for (;;) {
    const slug = n === 0 ? base : `${base}-${n}`
    const { data } = await admin.from('shops').select('id').eq('slug', slug).maybeSingle()
    if (!data) return slug
    n += 1
    if (n > 500) {
      return `${fallbackSlugFromUserId(userId)}-${Date.now()}`
    }
  }
}
