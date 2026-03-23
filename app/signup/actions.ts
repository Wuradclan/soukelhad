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
import { ensureUniqueShopSlug, slugifyShopName } from '@/lib/shop-slug';

export async function signUpAction(formData: FormData) {
  const cookieStore = await cookies();
  const locale = localeFromCookie(cookieStore.get(LOCALE_COOKIE)?.value);

  const email = (formData.get('email') as string).trim();
  const password = formData.get('password') as string;
  const rawShopName = (formData.get('shopName') as string).trim();
  const rawWhatsapp = (formData.get('whatsapp') as string).trim();

  if (!email || !password || !rawShopName || !rawWhatsapp) {
    redirect(`/signup?error=${encodeURIComponent(getMessage(locale, 'signup.errors.required'))}`);
  }
  if (rawShopName.length < 2) {
    redirect(`/signup?error=${encodeURIComponent(getMessage(locale, 'signup.errors.shopNameShort'))}`);
  }
  const whatsappParsed = parseMoroccanWhatsApp(rawWhatsapp);
  if (!whatsappParsed.ok) {
    redirect(`/signup?error=${encodeURIComponent(getMessage(locale, 'signup.errors.whatsappInvalid'))}`);
  }
  if (password.length < 8) {
    redirect(`/signup?error=${encodeURIComponent(getMessage(locale, 'signup.errors.passwordShort'))}`);
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch (error) {}
        },
      },
    }
  );

  await supabase.auth.signOut();

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) {
    redirect(`/signup?error=${encodeURIComponent(authError.message)}`);
  }

  if (authData.user) {
    const supabaseAdmin = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { cookies: { getAll() { return []; }, setAll() {} } }
    );

    const baseSlug = slugifyShopName(rawShopName);
    const slug = await ensureUniqueShopSlug(
      supabaseAdmin,
      baseSlug,
      authData.user.id
    );

    const { error: shopError } = await supabaseAdmin.from('shops').insert({
      user_id: authData.user.id,
      name: rawShopName,
      slug,
      whatsapp_number: whatsappParsed.digits,
    });

    if (shopError) {
      console.error('Erreur critique création boutique:', shopError.message);
    }
  }

  redirect('/user?success=welcome');
}
