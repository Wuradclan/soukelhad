import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(new URL('/user?error=no_code', request.url));
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
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch (error) {}
        },
      },
    }
  );

  try {
    // 1. Échange du code = Token Court
    const shortLivedRes = await fetch(
      `https://graph.facebook.com/v19.0/oauth/access_token?client_id=${process.env.NEXT_PUBLIC_META_APP_ID}&redirect_uri=${process.env.NEXT_PUBLIC_META_REDIRECT_URI}&client_secret=${process.env.META_APP_SECRET}&code=${code}`
    );
    const shortLivedData = await shortLivedRes.json();
    if (shortLivedData.error) throw new Error(shortLivedData.error.message);
    const shortToken = shortLivedData.access_token;

    // 2. Transformation = Token Long (60 jours)
    const longLivedRes = await fetch(
      `https://graph.facebook.com/v19.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${process.env.NEXT_PUBLIC_META_APP_ID}&client_secret=${process.env.META_APP_SECRET}&fb_exchange_token=${shortToken}`
    );
    const longLivedData = await longLivedRes.json();
    if (longLivedData.error) throw new Error(longLivedData.error.message);
    const finalToken = longLivedData.access_token;

    // 3. Récupération ID Business (Étape cruciale pour les photos)
    const pagesRes = await fetch(`https://graph.facebook.com/v19.0/me/accounts?access_token=${finalToken}`);
    const pagesData = await pagesRes.json();
    
    const pageId = pagesData.data[0]?.id;
    if (!pageId) throw new Error("Aucune page Facebook trouvée.");

    const igAccountRes = await fetch(`https://graph.facebook.com/v19.0/${pageId}?fields=instagram_business_account&access_token=${finalToken}`);
    const igAccountData = await igAccountRes.json();
    
    const igBusinessId = igAccountData.instagram_business_account?.id;
    if (!igBusinessId) throw new Error("Aucun compte Instagram Business lié à la page Facebook.");

    const igUserRes = await fetch(`https://graph.facebook.com/v19.0/${igBusinessId}?fields=username&access_token=${finalToken}`);
    const igUserData = await igUserRes.json();
    const igUsername = igUserData.username || null;

    // 4. Sauvegarde Base de données
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Utilisateur non connecté");

    const { error: updateError } = await supabase
      .from('shops')
      .update({ 
        ig_access_token: finalToken,
        ig_user_id: igBusinessId,
        ig_username: igUsername,
        ig_last_refreshed: new Date().toISOString()
      })
      .eq('user_id', user.id);

    if (updateError) throw updateError;

    return NextResponse.redirect(new URL('/user?success=instagram_connected', request.url));

  } catch (error: any) {
    console.error('Erreur Callback:', error.message);
    return NextResponse.redirect(new URL(`/user?error=auth_failed`, request.url));
  }
}