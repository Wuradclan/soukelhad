import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import {
  metaRedirectUriFromEnv,
  publicSupabaseAnonKey,
  publicSupabaseUrl,
} from '@/lib/env';
import { createServiceRoleClient } from '@/lib/supabase/service-role';
import { syncShopSlugForUser } from '@/lib/shop-slug';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);

  const hasSupabaseUrl =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ||
    !!process.env.SUPABASE_URL?.trim();
  const hasServiceRoleKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  const hasAnonKey = !!publicSupabaseAnonKey();

  if (!hasSupabaseUrl || !hasServiceRoleKey || !hasAnonKey) {
    console.error('[instagram/callback] Configuration Error — env check:', {
      NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL?.trim(),
      SUPABASE_URL: !!process.env.SUPABASE_URL?.trim(),
      resolvedPublicUrl: !!publicSupabaseUrl(),
      SUPABASE_SERVICE_ROLE_KEY: hasServiceRoleKey,
      NEXT_PUBLIC_SUPABASE_ANON_KEY:
        !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim(),
      resolvedAnon: hasAnonKey,
    });
    return NextResponse.json(
      { error: 'Configuration Error: Missing Supabase Variables' },
      { status: 500 }
    );
  }

  const { searchParams } = requestUrl;
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(new URL('/user?error=no_code', request.url));
  }

  const cookieStore = await cookies();

  const supabase = createServerClient(
    publicSupabaseUrl(),
    publicSupabaseAnonKey(),
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch (error) {}
        },
      },
    }
  );

  try {
    const redirectUri = metaRedirectUriFromEnv();
    if (!redirectUri) {
      throw new Error(
        'META redirect URI missing: set NEXT_PUBLIC_META_REDIRECT_URI or NEXT_PUBLIC_REDIRECT_URI'
      );
    }
    const shortLivedRes = await fetch(
      `https://graph.facebook.com/v19.0/oauth/access_token?client_id=${process.env.NEXT_PUBLIC_META_APP_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&client_secret=${process.env.META_APP_SECRET}&code=${code}`
    );
    const shortLivedData = await shortLivedRes.json();
    if (shortLivedData.error) throw new Error(shortLivedData.error.message);
    const shortToken = shortLivedData.access_token;

    const longLivedRes = await fetch(
      `https://graph.facebook.com/v19.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${process.env.NEXT_PUBLIC_META_APP_ID}&client_secret=${process.env.META_APP_SECRET}&fb_exchange_token=${shortToken}`
    );
    const longLivedData = await longLivedRes.json();
    if (longLivedData.error) throw new Error(longLivedData.error.message);
    const finalToken = longLivedData.access_token;

    const pagesRes = await fetch(
      `https://graph.facebook.com/v19.0/me/accounts?access_token=${finalToken}`
    );
    const pagesData = await pagesRes.json();

    const pageId = pagesData.data[0]?.id;
    if (!pageId) throw new Error('Aucune page Facebook trouvée.');

    const igAccountRes = await fetch(
      `https://graph.facebook.com/v19.0/${pageId}?fields=instagram_business_account&access_token=${finalToken}`
    );
    const igAccountData = await igAccountRes.json();

    const igBusinessId = igAccountData.instagram_business_account?.id;
    if (!igBusinessId) {
      throw new Error(
        'Aucun compte Instagram Business lié à la page Facebook.'
      );
    }

    const igUserRes = await fetch(
      `https://graph.facebook.com/v19.0/${igBusinessId}?fields=username&access_token=${finalToken}`
    );
    const igUserData = await igUserRes.json();
    const igUsername = igUserData.username || null;

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('Utilisateur non connecté');

    const admin = createServiceRoleClient();
    if (!admin) {
      throw new Error('Service role client unavailable');
    }

    const { data: shopRow } = await admin
      .from('shops')
      .select('name, slug')
      .eq('user_id', user.id)
      .maybeSingle();

    const updatePayload: Record<string, unknown> = {
      ig_access_token: finalToken,
      ig_user_id: igBusinessId,
      ig_username: igUsername,
      ig_last_refreshed: new Date().toISOString(),
    };

    if (shopRow?.name) {
      const nextSlug = await syncShopSlugForUser(admin, user.id, shopRow.name);
      if (nextSlug && nextSlug !== shopRow.slug) {
        updatePayload.slug = nextSlug;
      }
    }

    try {
      const { data: updateData, error: updateError } = await admin
        .from('shops')
        .update(updatePayload)
        .eq('user_id', user.id)
        .select('id');

      if (updateError) {
        console.error(
          '[instagram/callback] Database update failed:',
          updateError.message,
          updateError
        );
        throw updateError;
      }

      if (!updateData?.length) {
        console.error(
          '[instagram/callback] Database update: no row matched user_id',
          user.id
        );
        throw new Error('Aucune boutique trouvée pour cet utilisateur.');
      }
    } catch (dbErr: unknown) {
      const err = dbErr as { message?: string };
      console.error(
        '[instagram/callback] Database update exception:',
        err?.message ?? dbErr,
        dbErr
      );
      throw dbErr;
    }

    return NextResponse.redirect(
      new URL('/user?success=instagram_connected', request.url)
    );
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('Erreur Callback:', msg, error);
    return NextResponse.redirect(new URL(`/user?error=auth_failed`, request.url));
  }
}
