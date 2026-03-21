import React from 'react';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import InstagramConnectButton from '@/components/InstagramConnectButton';

// Next.js 15+ : Les props sont des Promises
export default async function UserDashboard(props: {
  searchParams: Promise<{ success?: string; error?: string }>;
}) {
  // 1. On attend les paramètres de recherche (Next.js 15/16)
  const searchParams = await props.searchParams;
  
  // 2. Initialisation de Supabase
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

  // 3. Vérification de l'utilisateur (Sécurité Business)
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login'); // On protège la route si pas de session
  }

  // 4. Récupérer les infos de la boutique
  const { data: shop } = await supabase
    .from('shops')
    .select('name, slug, ig_access_token, ig_username')
    .eq('user_id', user.id)
    .single();

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-900">
      {/* Barre de navigation ultra-pro */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center text-white font-black text-xs">S</div>
            <span className="font-black text-xl tracking-tighter">
              SOUK EL HAD <span className="text-orange-600">CONNECT</span>
            </span>
          </div>
          <div className="flex items-center gap-4 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
             <span className="text-xs font-bold text-slate-500">{user.email}</span>
             <div className="w-7 h-7 bg-white shadow-sm text-orange-600 rounded-full flex items-center justify-center font-bold text-[10px] border border-slate-200">
                {user.email?.[0].toUpperCase()}
             </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow max-w-6xl w-full mx-auto py-12 px-6">
        <header className="mb-12">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Bonjour, {shop?.name || "Commerçant"} 👋
          </h1>
          <p className="text-slate-500 mt-2 text-lg font-medium">Tableau de bord de votre vitrine numérique.</p>
        </header>

        {/* --- ALERTES --- */}
        {searchParams.success === 'instagram_connected' && (
          <div className="mb-8 p-5 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-2xl flex items-center gap-4 animate-in slide-in-from-top-2">
            <div className="bg-emerald-500 text-white rounded-full p-1 font-bold text-[10px]">✓</div>
            <p className="font-bold">Instagram connecté ! Vos produits sont en cours de synchronisation.</p>
          </div>
        )}

        {searchParams.error && (
          <div className="mb-8 p-5 bg-rose-50 border border-rose-100 text-rose-800 rounded-2xl flex items-center gap-4">
             <span className="text-xl">⚠️</span>
             <p className="font-bold">Erreur : {searchParams.error === 'auth_failed' ? "L'authentification a échoué. Vérifiez vos accès." : "Un problème est survenu."}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* CARTE 1 : STATUT VITRINE */}
          <div className="lg:col-span-2 bg-white p-10 rounded-[2rem] shadow-sm border border-slate-200/60">
            <h2 className="text-[11px] uppercase tracking-[0.3em] text-slate-400 font-black mb-10 flex items-center gap-2">
              <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
              Ma Vitrine en ligne
            </h2>
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <div>
                <p className="text-2xl font-black text-slate-800">{shop?.name}</p>
                <p className="text-slate-500 text-sm font-medium mt-1">Lien de votre boutique :</p>
              </div>
              {shop?.slug && (
                <Link 
                  href={`/shop/${shop.slug}`} 
                  target="_blank" 
                  className="flex items-center gap-2 bg-white px-5 py-3 rounded-xl text-sm font-bold shadow-sm border border-slate-200 hover:border-orange-500 transition-colors group"
                >
                  <span className="text-orange-600 font-black">soukelhadagadir.com/shop/{shop.slug}</span>
                  <svg className="w-4 h-4 text-slate-400 group-hover:text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </Link>
              )}
            </div>
          </div>

          {/* CARTE 2 : INSTAGRAM (LE MOTEUR) */}
          <div className="bg-white p-10 rounded-[2rem] shadow-sm border border-slate-200/60 flex flex-col items-center text-center">
            <h2 className="text-[11px] uppercase tracking-[0.3em] text-slate-400 font-black mb-10">Instagram</h2>
            
            {shop?.ig_access_token ? (
              <div className="w-full">
                <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-slate-900 font-black text-xl">Flux Actif</p>
                <p className="text-sm text-slate-400 mt-2 font-medium">Synchronisation automatique activée.</p>
                
                <div className="mt-8 pt-8 border-t border-slate-100 w-full">
                   <button className="text-xs font-bold text-rose-500 hover:text-rose-600 transition-colors uppercase tracking-widest">
                      Déconnecter Instagram
                   </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-dashed border-slate-200">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </div>
                <InstagramConnectButton />
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}