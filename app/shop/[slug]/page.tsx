import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Store, Clock, Award, ChevronLeft } from 'lucide-react';
import ProductGrid from '@/components/ProductGrid';

export default async function ShopPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const cookieStore = await cookies();
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { cookies: { getAll() { return cookieStore.getAll(); } } });

  const { data: shop } = await supabase.from('shops').select('*').eq('slug', slug).single();
  if (!shop || !shop.ig_access_token) return notFound();

  const res = await fetch(`https://graph.facebook.com/v19.0/${shop.ig_user_id}/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&access_token=${shop.ig_access_token}&limit=40`);
  const json = await res.json();
  const photos = json.data || [];

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      
      {/* 1. HEADER IDENTIQUE À LA LANDING PAGE */}
      <header className="bg-white border-b border-gray-100 p-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-orange-500 font-bold text-xl tracking-tight italic">SoukElHad.ma</span>
            <span className="text-gray-400 font-light text-sm hidden sm:block">/ سوق الأحد</span>
          </Link>
          
          <div className="flex items-center gap-4">
             <Link href="/signup" className="bg-orange-500 text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-100">
                S'inscrire
             </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12 flex flex-col gap-16">
        
        {/* 2. SECTION PROFIL COMMERÇANT (Style Cartes Landing) */}
        <section className="relative overflow-hidden bg-gray-50/50 border border-gray-100 rounded-[2.5rem] p-8 md:p-12 flex flex-col md:flex-row gap-12 items-center">
            {/* Décoration en arrière-plan comme sur ta landing */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-100/30 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />

            {/* Photo du stand */}
            <div className="w-full md:w-1/3 aspect-square relative rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white">
              {shop.photo_url ? (
                <Image src={shop.photo_url} alt={shop.name} fill className="object-cover" />
              ) : (
                <div className="w-full h-full bg-orange-50 flex items-center justify-center text-orange-200">
                  <Store size={80} strokeWidth={1} />
                </div>
              )}
            </div>

            {/* Détails */}
            <div className="relative z-10 flex-grow text-center md:text-left">
                <div className="inline-flex items-center gap-2 bg-white px-4 py-1.5 rounded-full border border-gray-100 shadow-sm mb-6">
                    <Award size={14} className="text-orange-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Boutique Officielle</span>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight uppercase italic leading-none">
                    {shop.name}
                </h1>

                <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm font-bold text-gray-400 mb-8">
                    <span className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-gray-50 text-orange-600">
                        <MapPin size={16} /> Box #{shop.box_number || "---"}
                    </span>
                    <span className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-gray-50">
                        <Clock size={16} /> 09h - 20h
                    </span>
                </div>

                <p className="text-lg text-gray-500 max-w-2xl leading-relaxed italic">
                    "{shop.description || "Retrouvez notre sélection exclusive d'articles en direct du Souk El Had d'Agadir. Qualité garantie et service client direct via WhatsApp."}"
                </p>
            </div>
        </section>

        {/* 3. GRILLE DE PRODUITS (Le composant client) */}
        <div>
           <div className="text-center mb-12">
              <h2 className="text-3xl font-black mb-4">Nouveaux Arrivages</h2>
              <div className="w-20 h-1.5 bg-orange-500 mx-auto rounded-full" />
           </div>
           
           <ProductGrid photos={photos} shop={shop} />
        </div>

      </main>

      <footer className="py-20 text-center border-t border-gray-50">
         <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.5em]">SoukElHad.ma — Agadir 2026</p>
      </footer>
    </div>
  );
}