import React from 'react';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';

// --- ACTION SERVEUR SÉCURISÉE ---
async function signUpAction(formData: FormData) {
  'use server';
  
  const email = (formData.get('email') as string).trim();
  const password = formData.get('password') as string;
  const rawShopName = (formData.get('shopName') as string).trim();

  // 1. Validations
  if (!email || !password || !rawShopName) {
    redirect('/signup?error=Veuillez remplir tous les champs obligatoires.');
  }
  if (rawShopName.length < 2) {
    redirect('/signup?error=Le nom de la boutique doit contenir au moins 2 caractères.');
  }
  if (password.length < 8) {
    redirect('/signup?error=Le mot de passe doit contenir au moins 8 caractères pour votre sécurité.');
  }

  const cookieStore = await cookies();
  
  // 2. Initialisation
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

  // 🧹 Nettoyage de la session fantôme
  await supabase.auth.signOut();

  // 3. Création du compte
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) {
    redirect(`/signup?error=${encodeURIComponent(authError.message)}`);
  }

  // 4. Création de la boutique avec un SLUG PROPRE (sans les numéros)
  if (authData.user) {
    const supabaseAdmin = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { cookies: { getAll() { return []; }, setAll() {} } }
    );

    // Le commerçant tape "Bazar Al Anwar", le lien devient "bazar-al-anwar"
    // Noms entièrement en arabe : slug vide après sanitisation → fallback unique
    let slug = rawShopName
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    if (!slug) {
      slug = `boutique-${authData.user.id.replace(/-/g, '').slice(0, 12)}`;
    }

    const { error: shopError } = await supabaseAdmin
      .from('shops')
      .insert([
        {
          user_id: authData.user.id,
          name: rawShopName,
          slug: slug,
        }
      ]);

    if (shopError) {
      console.error("Erreur critique création boutique:", shopError.message);
    }
  }

  redirect('/user?success=welcome');
}

// --- INTERFACE (UI) ---
export default async function SignUpPage(props: {
  searchParams: Promise<{ error?: string }>;
}) {
  const searchParams = await props.searchParams;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans text-slate-900">
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-16 h-16 bg-orange-600 rounded-2xl flex items-center justify-center text-white font-black text-3xl mx-auto mb-6 shadow-xl shadow-orange-200">S</div>
        <h2 className="text-3xl font-black tracking-tight uppercase italic text-slate-950">
          Créer ma vitrine
        </h2>
        <p className="mt-2 text-sm text-slate-500 font-medium">
          Rejoignez le marché numérique d'Agadir en 2 minutes.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-10 px-6 shadow-xl shadow-slate-200/50 sm:rounded-[2.5rem] sm:px-10 border border-slate-100">
          
          {searchParams.error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-3">
              <span className="text-rose-500 mt-0.5">⚠️</span>
              <p className="text-sm font-bold text-rose-800">{searchParams.error}</p>
            </div>
          )}

          <form action={signUpAction} className="space-y-6">
            
            {/* NOM DE LA BOUTIQUE (Avec blocage de l'autofill) */}
            <div>
              <label htmlFor="shopName" className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                Nom de votre commerce au Souk — سمية البوتيك
              </label>
              <div className="mt-1">
                <input
                  id="shopName"
                  name="shopName"
                  type="text"
                  required
                  minLength={2}
                  autoComplete="off" /* LE BLOCAGE EST ICI */
                  placeholder="Ex: Bazar Al Anwar ou بالعربية"
                  className="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-xl shadow-sm placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent font-medium transition-all"
                />
              </div>
            </div>

            {/* EMAIL */}
            <div>
              <label htmlFor="email" className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                Adresse Email professionnelle
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="contact@maboutique.com"
                  className="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-xl shadow-sm placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent font-medium transition-all"
                />
              </div>
            </div>

            {/* MOT DE PASSE */}
            <div>
              <label htmlFor="password" className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                Mot de passe sécurisé
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  placeholder="8 caractères minimum"
                  className="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-xl shadow-sm placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent font-medium transition-all"
                />
              </div>
            </div>

            {/* BOUTON SOUMISSION */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-2xl shadow-lg shadow-orange-200 text-sm font-black uppercase tracking-wide text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all hover:scale-[1.02]"
              >
                Ouvrir ma boutique
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
             <p className="text-sm text-slate-500 font-medium">
                Vous avez déjà une vitrine ?{' '}
                <Link href="/login" className="font-bold text-orange-600 hover:text-orange-500">
                  Connectez-vous ici.
                </Link>
             </p>
          </div>

        </div>
      </div>
    </div>
  );
}