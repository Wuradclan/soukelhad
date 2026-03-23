'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  getMessage,
  LOCALE_COOKIE,
  localeFromCookie,
} from '@/lib/translations';
import { parseMoroccanWhatsApp } from '@/lib/phone';
import { syncShopSlugForUser } from '@/lib/shop-slug';

export async function completeProfileAction(formData: FormData) {
  const cookieStore = await cookies();
  const locale = localeFromCookie(cookieStore.get(LOCALE_COOKIE)?.value);

  const rawWhatsapp = (formData.get('whatsapp') as string).trim();

  if (!rawWhatsapp) {
    redirect(
      `/complete-profile?error=${encodeURIComponent(getMessage(locale, 'completeProfile.errorRequired'))}`
    );
  }

  const parsed = parseMoroccanWhatsApp(rawWhatsapp);
  if (!parsed.ok) {
    redirect(
      `/complete-profile?error=${encodeURIComponent(getMessage(locale, 'signup.errors.whatsappInvalid'))}`
    );
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {}
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    redirect(
      `/complete-profile?error=${encodeURIComponent(getMessage(locale, 'completeProfile.errorServer'))}`
    );
  }

  const admin = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { cookies: { getAll: () => [], setAll: () => {} } }
  );

  const { data: shopRow, error: shopErr } = await admin
    .from('shops')
    .select('id, name, slug')
    .eq('user_id', user.id)
    .maybeSingle();

  if (shopErr || !shopRow) {
    console.error('completeProfileAction: shop row', shopErr?.message);
    redirect(
      `/complete-profile?error=${encodeURIComponent(getMessage(locale, 'completeProfile.errorSave'))}`
    );
  }

  const nextSlug = await syncShopSlugForUser(admin, user.id, shopRow.name);

  const update: Record<string, unknown> = {
    whatsapp_number: parsed.digits,
  };
  if (nextSlug && nextSlug !== shopRow.slug) {
    update.slug = nextSlug;
  }

  const { error } = await admin
    .from('shops')
    .update(update)
    .eq('user_id', user.id);

  if (error) {
    console.error('completeProfileAction:', error.message);
    redirect(
      `/complete-profile?error=${encodeURIComponent(getMessage(locale, 'completeProfile.errorSave'))}`
    );
  }

  redirect('/user');
}
