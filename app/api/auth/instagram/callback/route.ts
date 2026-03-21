import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  // --- 1. INITIALISATION ASYNCHRONE DE SUPABASE ---
  // Dans Next.js 15+, cookies() doit être attendu avec 'await'
  const cookieStore = await cookies();
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    }
  );

  // --- 2. VÉRIFICATION DE L'IDENTITÉ ---
  // On s'assure que c'est bien le commerçant connecté qui fait la demande
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (!user || userError) {
    return NextResponse.redirect(new URL('/login?error=not_logged_in', request.url));
  }

  // --- 3. GESTION DES ERREURS META ---
  if (error || !code) {
    console.error('Erreur OAuth Meta:', searchParams.get('error_description'));
    return NextResponse.redirect(new URL('/user?error=auth_failed', request.url));
  }

  try {
    const appId = process.env.NEXT_PUBLIC_META_APP_ID;
    const appSecret = process.env.META_APP_SECRET;
    const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI;

    // --- 4. ÉCHANGE DU CODE CONTRE UN TOKEN COURT (1h) ---
    const tokenUrl = `https://graph.facebook.com/v19.0/oauth/access_token?client_id=${appId}&redirect_uri=${redirectUri}&client_secret=${appSecret}&code=${code}`;
    
    const tokenRes = await fetch(tokenUrl);
    const tokenData = await tokenRes.json();

    if (tokenData.error) throw new Error(tokenData.error.message);

    // --- 5. ÉCHANGE CONTRE UN TOKEN LONGUE DURÉE (60 JOURS) ---
    const longTokenUrl = `https://graph.facebook.com/v19.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${appId}&client_secret=${appSecret}&fb_exchange_token=${tokenData.access_token}`;
    
    const longTokenRes = await fetch(longTokenUrl);
    const longTokenData = await longTokenRes.json();

    if (longTokenData.error) throw new Error(longTokenData.error.message);

    const finalAccessToken = longTokenData.access_token;

    // --- 6. SAUVEGARDE DANS LA TABLE 'SHOPS' ---
    // On enregistre le token pour la boutique liée à cet utilisateur
    const { error: dbError } = await supabase
      .from('shops')
      .update({ 
        ig_access_token: finalAccessToken,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.id); // On vérifie que c'est bien sa boutique

    if (dbError) {
        console.error("Erreur Database:", dbError.message);
        throw dbError;
    }

    // --- 7. RETOUR AU DASHBOARD AVEC SUCCÈS ---
    return NextResponse.redirect(new URL('/user?success=instagram_connected', request.url));

  } catch (err: any) {
    console.error("Erreur critique d'intégration Instagram:", err.message);
    return NextResponse.redirect(new URL('/user?error=auth_failed', request.url));
  }
}