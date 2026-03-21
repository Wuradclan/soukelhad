import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const signedRequest = formData.get('signed_request') as string;

    if (!signedRequest) {
      return NextResponse.json({ error: 'No signed request' }, { status: 400 });
    }

    // --- 1. DÉCODER LE SIGNED_REQUEST ---
    // Meta envoie une chaîne signée pour prouver que la requête vient d'eux
    const [encodedSig, payload] = signedRequest.split('.');
    const appSecret = process.env.META_APP_SECRET!;

    const sig = Buffer.from(encodedSig.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('hex');
    const expectedSig = crypto.createHmac('sha256', appSecret).update(payload).digest('hex');

    if (sig !== expectedSig) {
      return NextResponse.json({ error: 'Signature invalide' }, { status: 400 });
    }

    const data = JSON.parse(Buffer.from(payload.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString());
    const instagramUserId = data.user_id; // L'ID Meta de l'utilisateur qui s'en va

    // --- 2. NETTOYAGE SUPABASE ---
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) { return cookieStore.get(name)?.value; },
        },
      }
    );

    // On vide le token pour que le dashboard du commerçant revienne à l'état "Déconnecté"
    await supabase
      .from('shops')
      .update({ 
        ig_access_token: null,
        ig_last_refreshed: null 
      })
      .eq('ig_user_id', instagramUserId); // Assure-toi d'avoir cette colonne en base

    console.log(`Utilisateur ${instagramUserId} désautorisé avec succès.`);

    return NextResponse.json({ status: 'success' });

  } catch (err: any) {
    console.error('Erreur Deauthorize:', err.message);
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}