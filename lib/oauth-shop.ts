import 'server-only';

import type { User } from '@supabase/supabase-js';
import { createServiceRoleClient } from '@/lib/supabase/service-role';
import {
  ensureUniqueShopSlug,
  fallbackSlugFromUserId,
  slugifyShopName,
  syncShopSlugForUser,
} from '@/lib/shop-slug';

function displayNameFromUser(user: User): string {
  const m = user.user_metadata as Record<string, unknown> | undefined;
  if (!m) return user.email?.split('@')[0] || 'Ma boutique';
  return (
    (m.full_name as string) ||
    (m.name as string) ||
    (m.display_name as string) ||
    user.email?.split('@')[0] ||
    'Ma boutique'
  );
}

function avatarFromUser(user: User): string | null {
  const m = user.user_metadata as Record<string, unknown> | undefined;
  if (!m) return null;
  const raw = m.avatar_url ?? m.picture;
  if (typeof raw === 'string') return raw;
  if (raw && typeof raw === 'object' && 'data' in raw) {
    const d = (raw as { data?: { url?: string } }).data;
    return d?.url ?? null;
  }
  return null;
}

/**
 * After Google/Facebook OAuth: create or update `shops` with name + avatar from provider.
 * New merchants get a row with `whatsapp_number` null until /complete-profile.
 */
export async function ensureShopForOAuthUser(user: User): Promise<void> {
  const admin = createServiceRoleClient();
  if (!admin) {
    console.error('ensureShopForOAuthUser: service role client unavailable');
    return;
  }

  const fullName = displayNameFromUser(user);
  const avatar = avatarFromUser(user);

  const { data: existing, error: selErr } = await admin
    .from('shops')
    .select('id, name, whatsapp_number, profile_image_url, slug')
    .eq('user_id', user.id)
    .maybeSingle();

  if (selErr) {
    console.error('ensureShopForOAuthUser: select failed', selErr.message);
    return;
  }

  if (existing) {
    const updates: Record<string, unknown> = {};
    if (avatar && !existing.profile_image_url) {
      updates.profile_image_url = avatar;
    }
    const nextSlug = await syncShopSlugForUser(admin, user.id, existing.name);
    if (nextSlug && nextSlug !== existing.slug) {
      updates.slug = nextSlug;
    }
    if (Object.keys(updates).length > 0) {
      await admin.from('shops').update(updates).eq('user_id', user.id);
    }
    return;
  }

  const baseSlug = slugifyShopName(fullName) || fallbackSlugFromUserId(user.id);
  const slug = await ensureUniqueShopSlug(admin, baseSlug, user.id);

  const insert: Record<string, unknown> = {
    user_id: user.id,
    name: fullName,
    slug,
    profile_image_url: avatar,
    whatsapp_number: null,
  };

  const { error: insErr } = await admin.from('shops').insert(insert);

  if (insErr) {
    console.error('ensureShopForOAuthUser: insert failed', insErr.message);
  }
}
