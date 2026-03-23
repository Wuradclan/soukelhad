import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { ensureShopForOAuthUser } from '@/lib/oauth-shop';

/**
 * Supabase OAuth redirect handler (Google / Facebook).
 * Configure the same URL in Supabase Dashboard → Authentication → URL Configuration → Redirect URLs.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const next = url.searchParams.get('next') ?? '/user';
  const origin = url.origin;

  if (!code) {
    return NextResponse.redirect(new URL('/login?error=oauth', origin));
  }

  const cookieStore = await cookies();

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
          } catch {
            // setAll from Server Component edge case
          }
        },
      },
    }
  );

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error('auth/callback: exchangeCodeForSession', error.message);
    return NextResponse.redirect(new URL('/login?error=oauth', origin));
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    await ensureShopForOAuthUser(user);
  }

  return NextResponse.redirect(new URL(next, origin));
}
