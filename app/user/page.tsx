import React from 'react';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import InstagramConnectButton from '@/components/InstagramConnectButton';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { getServerLocale } from '@/lib/locale-server';
import { getMessage, type Locale } from '@/lib/translations';
import { getShopAnalytics } from '@/lib/analytics-server';
import { AnalyticsChart } from '@/components/AnalyticsChart';

/**
 * ACTION SERVEUR 1 : Déconnexion complète d'Instagram
 */
async function disconnectInstagram(shopId: string) {
  'use server';
  
  const cookieStore = await cookies();
  const supabaseAdmin = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
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

  const { error } = await supabaseAdmin
    .from('shops')
    .update({ 
      ig_access_token: null, 
      ig_user_id: null, 
      ig_username: null,
      ig_last_refreshed: null
    })
    .eq('id', shopId);

  if (error) console.error("Erreur déconnexion Instagram:", error.message);

  revalidatePath('/user');
}

/**
 * ACTION SERVEUR 2 : Déconnexion de la session utilisateur (Quitter)
 */
async function signOutUser() {
  'use server';
  
  const cookieStore = await cookies();
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

  await supabase.auth.signOut();
  redirect('/login');
}

export default async function UserDashboard(props: {
  searchParams: Promise<{ success?: string; error?: string; msg?: string }>;
}) {
  const searchParams = await props.searchParams;
  const locale = await getServerLocale();
  const cookieStore = await cookies();
  
  // Initialisation Supabase standard
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

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Récupération de la boutique
  const { data: shop } = await supabase
    .from('shops')
    .select('id, name, slug, ig_access_token, ig_username')
    .eq('user_id', user.id)
    .maybeSingle();

  const analytics = shop?.id ? await getShopAnalytics(shop.id) : null;

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col font-sans text-slate-900">
      
      {/* BARRE DE NAVIGATION (Avec bouton Quitter) */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center text-white font-black text-xs">S</div>
            <span className="font-black text-xl tracking-tighter uppercase">
              {getMessage(locale, 'user.brand')} <span className="text-orange-600">{getMessage(locale, 'user.brandAccent')}</span>
            </span>
          </div>
          
          {/* MENU UTILISATEUR & DÉCONNEXION */}
          <div className="flex items-center gap-4 sm:gap-6">
            <LanguageSwitcher />
            <div className="flex items-center gap-3 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
               <span className="text-xs font-bold text-slate-500">{user.email}</span>
               <div className="w-7 h-7 bg-white shadow-sm text-orange-600 rounded-full flex items-center justify-center font-bold text-[10px] border border-slate-200">
                  {user.email?.[0].toUpperCase()}
               </div>
            </div>

            {/* Bouton Déconnexion de la session */}
            <form action={signOutUser}>
              <button 
                type="submit" 
                className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-rose-500 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                {getMessage(locale, 'user.signOut')}
              </button>
            </form>
          </div>
        </div>
      </nav>

      <main className="flex-grow max-w-6xl w-full mx-auto py-12 px-6">
        <header className="mb-12">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            {getMessage(locale, 'user.hello')} {shop?.name || getMessage(locale, 'user.merchantFallback')} 👋
          </h1>
          <p className="text-slate-500 mt-2 text-lg font-medium">{getMessage(locale, 'user.subtitle')}</p>
        </header>

        {shop && !shop.ig_access_token && (
          <div className="mb-8 rounded-2xl border border-sky-100 bg-sky-50/90 p-5 text-sky-950 shadow-sm">
            <p className="text-sm font-semibold leading-relaxed">
              {getMessage(locale, 'user.merchantMetaPending')}
            </p>
          </div>
        )}

        {/* --- MESSAGES D'ÉTAT --- */}
        {searchParams.success === 'instagram_connected' && (
          <div className="mb-8 p-5 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-2xl flex items-center gap-4 animate-in fade-in slide-in-from-top-2">
            <div className="bg-emerald-500 text-white rounded-full p-1 font-bold text-[10px]">✓</div>
            <p className="font-bold text-sm">{getMessage(locale, 'user.msgInstagramOk')}</p>
          </div>
        )}
        
        {searchParams.success === 'welcome' && (
          <div className="mb-8 p-5 bg-orange-50 border border-orange-100 text-orange-800 rounded-2xl flex items-center gap-4 animate-in fade-in slide-in-from-top-2">
            <div className="bg-orange-500 text-white rounded-full p-1 font-bold text-[10px]">✓</div>
            <p className="font-bold text-sm">{getMessage(locale, 'user.msgWelcome')}</p>
          </div>
        )}

        {searchParams.error && (
          <div className="mb-8 p-6 bg-rose-50 border border-rose-100 text-rose-800 rounded-2xl">
             <div className="flex items-center gap-4 mb-2">
                <span className="text-xl">⚠️</span>
                <p className="font-black text-sm uppercase tracking-wide">{getMessage(locale, 'user.errorIgTitle')}</p>
             </div>
             <p className="text-sm font-medium opacity-80 ms-9">
                {searchParams.msg || getMessage(locale, 'user.errorIgBody')}
             </p>
             <div className="mt-4 ms-9 flex gap-3">
                <Link href="https://www.facebook.com/pages" target="_blank" className="text-[10px] bg-white border border-rose-200 px-3 py-1.5 rounded-lg font-bold hover:bg-rose-100 transition-colors uppercase">{getMessage(locale, 'user.checkFb')}</Link>
             </div>
          </div>
        )}

        {shop && analytics && (
          <section className="mb-10 rounded-[2.5rem] border border-slate-200/80 bg-white p-8 md:p-10 shadow-sm">
            <h2 className="text-[11px] uppercase tracking-[0.3em] text-slate-400 font-black mb-2">
              {getMessage(locale, 'user.sectionAnalytics')}
            </h2>
            <p className="text-xs text-slate-400 font-medium mb-8">
              {getMessage(locale, 'user.analyticsTotalLabel')}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
              <div className="rounded-2xl border border-slate-100 bg-slate-50/90 p-6 text-center">
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-black mb-2">
                  {getMessage(locale, 'user.analyticsVisitsLabel')}
                </p>
                <p className="text-3xl font-black text-slate-900 tabular-nums">{analytics.totals.visits}</p>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50/90 p-6 text-center">
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-black mb-2">
                  {getMessage(locale, 'user.analyticsViewsLabel')}
                </p>
                <p className="text-3xl font-black text-slate-900 tabular-nums">{analytics.totals.views}</p>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50/90 p-6 text-center">
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-black mb-2">
                  {getMessage(locale, 'user.analyticsWaLabel')}
                </p>
                <p className="text-3xl font-black text-orange-600 tabular-nums">{analytics.totals.waClicks}</p>
              </div>
            </div>

            <h3 className="text-sm font-black text-slate-800 mb-4">
              {getMessage(locale, 'user.analyticsLast7Title')}
            </h3>
            <AnalyticsChart
              data={analytics.last7Days}
              locale={locale}
              legend={{
                visits: getMessage(locale, 'user.analyticsLegendVisits'),
                views: getMessage(locale, 'user.analyticsLegendViews'),
                wa: getMessage(locale, 'user.analyticsLegendWa'),
              }}
              emptyOverlay={getMessage(locale, 'user.analyticsNoDataOverlay')}
            />
          </section>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* CARTE 1 : VITRINE PUBLIQUE */}
          <div className="lg:col-span-2 bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-200/60 flex flex-col justify-between">
            <div>
              <h2 className="text-[11px] uppercase tracking-[0.3em] text-slate-400 font-black mb-10 flex items-center gap-2">
                <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                {getMessage(locale, 'user.sectionVitrine')}
              </h2>
              
              <div className="space-y-8">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-black mb-2 tracking-widest">{getMessage(locale, 'user.shopNameLabel')}</p>
                  <p className="text-2xl font-black text-slate-800">{shop?.name || getMessage(locale, 'user.shopPending')}</p>
                </div>
                
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-black mb-3 tracking-widest">{getMessage(locale, 'user.shareLabel')}</p>
                  {shop?.slug ? (
                    <Link 
                      href={`/shop/${shop.slug}`} 
                      target="_blank" 
                      className="group inline-flex items-center gap-3 bg-slate-50 border border-slate-200 px-6 py-4 rounded-2xl text-sm font-bold hover:bg-white hover:border-orange-500 transition-all shadow-sm"
                    >
                      <span className="text-orange-600 font-black italic underline decoration-2 underline-offset-4 tracking-tight">soukelhadagadir.com/shop/{shop.slug}</span>
                      <svg className="w-4 h-4 text-slate-400 group-hover:-translate-x-1 rtl:group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </Link>
                  ) : (
                    <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl text-amber-700 text-sm font-medium">{getMessage(locale, 'user.configureLink')}</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* CARTE 2 : SYNC INSTAGRAM */}
          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-200/60 flex flex-col items-center text-center">
            <h2 className="text-[11px] uppercase tracking-[0.3em] text-slate-400 font-black mb-10 tracking-widest">{getMessage(locale, 'user.sectionInstagram')}</h2>
            
            {shop?.ig_access_token ? (
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-[2rem] flex items-center justify-center mb-6 shadow-inner border border-emerald-100">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-slate-900 font-black text-xl">{getMessage(locale, 'user.fluxActive')}</p>
                <p className="text-sm text-slate-400 mt-2 font-medium leading-relaxed italic">
                  {getMessage(locale, 'user.connectedAs')} <span className="text-slate-900 font-bold">@{shop.ig_username || getMessage(locale, 'user.merchantFallbackShort')}</span>
                </p>
                
                {/* BOUTON DÉCONNECTER INSTAGRAM */}
                <form action={disconnectInstagram.bind(null, shop.id)}>
                   <button 
                    type="submit"
                    className="mt-12 px-6 py-2 bg-rose-50 text-rose-500 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all cursor-pointer border border-rose-100"
                  >
                    {getMessage(locale, 'user.disconnectIg')}
                  </button>
                </form>
              </div>
            ) : (
              <div className="flex flex-col items-center w-full">
                <div className="w-20 h-20 bg-slate-50 text-slate-200 rounded-[2rem] flex items-center justify-center mb-6 border-2 border-dashed border-slate-200">
                  <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </div>
                <InstagramConnectButton />
              </div>
            )}
          </div>

        </div>
      </main>
      
      <footer className="py-12 text-center">
          <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.5em]">{getMessage(locale, 'user.footer')}</p>
      </footer>
    </div>
  );
}