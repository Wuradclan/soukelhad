import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { ensureShopForOAuthUser } from '@/lib/oauth-shop';

/**
 * Supabase OAuth redirect handler (Google / Facebook).
 * Add the same URL in Supabase Dashboard → Authentication → URL Configuration → Redirect URLs:
 *   https://<your-domain>/auth/callback
 */
function safeNextPath(raw: string | null, fallback: string): string {
  if (!raw || !raw.startsWith('/') || raw.startsWith('//')) {
    return fallback;
  }
  return raw;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const origin = url.origin;
  const nextPath = safeNextPath(url.searchParams.get('next'), '/user');

  if (!code) {
    return NextResponse.redirect(new URL('/login?error=oauth', origin));
  }

  const cookieStore = await cookies();
  const redirectUrl = new URL(nextPath, origin);
  const response = NextResponse.redirect(redirectUrl);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
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

  return response;
}
