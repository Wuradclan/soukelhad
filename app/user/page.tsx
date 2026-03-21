import React from 'react';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import Link from 'next/link';
import InstagramConnectButton from '@/components/InstagramConnectButton';

export default async function UserDashboard({
  searchParams,
}: {
  searchParams: { success?: string; error?: string };
}) {
  // 1. Initialisation de Supabase côté serveur (Compatible Next.js 15)
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  // 2. Récupérer l'utilisateur connecté
  const { data: { user } } = await supabase.auth.getUser();

  // 3. Récupérer les infos de la boutique liée à cet utilisateur
  const { data: shop } = await supabase
    .from('shops')
    .select('name, slug, ig_access_token')
    .eq('user_id', user?.id)
    .single();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      {/* Barre de navigation */}
      <nav className="bg-white border-b px-6 py-4 shadow-sm">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <span className="font-extrabold text-xl text-orange-600 tracking-tight">
            Souk El Had <span className="text-gray-400 uppercase text-xs ml-1 tracking-widest font-bold">Admin</span>
          </span>
          <div className="flex items-center gap-3">
             <span className="text-sm font-medium text-gray-500">{user?.email}</span>
             <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold text-xs border border-orange-200">
                {user?.email?.[0].toUpperCase()}
             </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow max-w-5xl w-full mx-auto py-10 px-6">
        <header className="mb-10">
          <h1 className="text-3xl font-black text-gray-900 leading-tight">
            Bonjour, {shop?.name || "Commerçant"} 👋
          </h1>
          <p className="text-gray-500 mt-2 text-lg">Gérez l'accès digital et la vitrine de votre boutique.</p>
        </header>

        {/* --- ALERTES DE RETOUR META --- */}
        {searchParams.success === 'instagram_connected' && (
          <div className="mb-8 p-4 bg-green-50 border border-green-200 text-green-700 rounded-2xl shadow-sm flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="bg-green-500 text-white rounded-full p-1 uppercase font-bold text-[10px]">ok</div>
            <p className="font-bold text-sm">Félicitations ! Votre vitrine Instagram est maintenant activée.</p>
          </div>
        )}

        {searchParams.error === 'auth_failed' && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl shadow-sm flex items-center gap-3">
             <span className="text-xl">⚠️</span>
             <p className="font-bold text-sm">Échec de la connexion. Vérifiez que votre Instagram est un compte Professionnel.</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* CARTE 1 : INFOS BOUTIQUE & LIEN PUBLIC */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between">
            <div>
              <h2 className="text-xs uppercase tracking-[0.2em] text-gray-400 font-black mb-8 italic underline decoration-orange-500 decoration-2 underline-offset-8">Ma Boutique</h2>
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-black mb-1">Nom affiché</p>
                  <p className="text-xl font-bold text-gray-800">{shop?.name || "Boutique sans nom"}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-black mb-2">Lien public (cliquable)</p>
                  {shop?.slug ? (
                    <Link 
                      href={`/shop/${shop.slug}`} 
                      target="_blank" 
                      className="group inline-flex items-center gap-3 text-orange-600 bg-orange-50 px-4 py-3 rounded-2xl text-sm font-bold border border-orange-100 hover:bg-orange-100 hover:scale-[1.02] transition-all"
                    >
                      <span>/shop/{shop.slug}</span>
                      <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </Link>
                  ) : (
                    <p className="text-red-500 text-sm italic font-medium">Slug non configuré en base de données.</p>
                  )}
                </div>
              </div>
            </div>
            <button className="mt-8 w-full py-3 bg-gray-50 text-gray-400 border border-gray-100 rounded-xl text-xs font-black uppercase tracking-widest cursor-not-allowed">
              Modifier le profil (Bientôt)
            </button>
          </div>

          {/* CARTE 2 : SYNCHRONISATION INSTAGRAM */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col">
            <h2 className="text-xs uppercase tracking-[0.2em] text-gray-400 font-black mb-8 italic underline decoration-orange-500 decoration-2 underline-offset-8">Réseaux Sociaux</h2>
            
            <div className="flex-grow flex flex-col justify-center">
              {shop?.ig_access_token ? (
                <div className="text-center py-6 bg-green-50/30 rounded-2xl border border-dashed border-green-200">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-green-100 text-green-600 rounded-full mb-4 shadow-inner">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-800 font-black text-lg">Instagram Connecté</p>
                  <p className="text-sm text-gray-500 mt-2 px-6">Vos photos du Souk El Had sont synchronisées avec votre vitrine.</p>
                </div>
              ) : (
                <>
                  <p className="text-sm text-gray-500 mb-8 leading-relaxed font-medium">
                    Connectez votre compte Instagram professionnel pour que vos derniers arrivages s'affichent automatiquement ici.
                  </p>
                  <InstagramConnectButton />
                </>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}