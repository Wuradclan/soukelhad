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

    // --- 1. DÉCODER ET VÉRIFIER LA SIGNATURE ---
    const [encodedSig, payload] = signedRequest.split('.');
    const appSecret = process.env.META_APP_SECRET!;

    const sig = Buffer.from(encodedSig.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('hex');
    const expectedSig = crypto.createHmac('sha256', appSecret).update(payload).digest('hex');

    if (sig !== expectedSig) {
      return NextResponse.json({ error: 'Signature invalide' }, { status: 400 });
    }

    const data = JSON.parse(Buffer.from(payload.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString());
    const userId = data.user_id; // L'ID utilisateur chez Meta

    // --- 2. SUPPRESSION DES DONNÉES DANS SUPABASE ---
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { get(name: string) { return cookieStore.get(name)?.value } } }
    );

    // On vide le token et les infos Instagram de la boutique
    // Si tu as stocké l'ID Instagram, utilise .eq('ig_user_id', userId)
    const { error } = await supabase
      .from('shops')
      .update({
        ig_access_token: null,
        ig_last_refreshed: null,
      })
      .not('ig_access_token', 'is', null);

    if (error) throw error;

    // --- 3. RÉPONSE REQUISE PAR META ---
    // 'url' doit être une page où l'utilisateur peut vérifier le statut (ex: son profil)
    // 'confirmation_code' est un ID unique de ta transaction
    const confirmationCode = `DEL-${userId}-${Date.now()}`;
    
    return NextResponse.json({
      url: `https://soukelhadagadir.com/user?status=deleted&code=${confirmationCode}`,
      confirmation_code: confirmationCode
    });

  } catch (err: any) {
    console.error('Erreur Deletion Request:', err.message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}