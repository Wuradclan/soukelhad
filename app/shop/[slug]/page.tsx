import { Metadata } from 'next';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Store as StoreIcon, Award, Instagram } from 'lucide-react';
import { getServerLocale } from '@/lib/locale-server';
import { getMessage } from '@/lib/translations';
import { ensureInstagramAccessTokenFresh } from '@/lib/instagram-refresh';
import { getDemoInstagramPhotos } from '@/lib/shop-demo-products';
import ProductGrid from '@/components/ProductGrid';
import { ShopVisitTracker } from '@/components/ShopVisitTracker';

type Props = {
  params: Promise<{ slug: string }>;
};

// --- 1. GÉNÉRATION DES MÉTADONNÉES (SEO & Réseaux Sociaux) ---
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return []; } } }
  );

  try {
    const { data: shop } = await supabase
      .from('shops')
      .select('name, description, photo_url')
      .eq('slug', slug)
      .single();

    if (!shop) return { title: 'Boutique introuvable' };

    const finalImage = shop.photo_url || 'https://www.soukelhadagadir.com/og-default.jpg';

    return {
      title: `${shop.name} | Souk El Had Agadir`,
      description: shop.description || `Découvrez la boutique ${shop.name} au Souk El Had d'Agadir.`,
      openGraph: {
        title: shop.name,
        description: shop.description,
        url: `https://www.soukelhadagadir.com/shop/${slug}`,
        images: [{ url: finalImage, width: 1200, height: 630 }],
        type: 'website',
      },
    };
  } catch (e) {
    return { title: 'Souk El Had Agadir' };
  }
}

// --- 2. COMPOSANT DE PAGE PRINCIPAL ---
export default async function ShopPage({ params }: Props) {
  const { slug } = await params;
  const locale = await getServerLocale();
  const cookieStore = await cookies();
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!, 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, 
    { cookies: { getAll: () => cookieStore.getAll() } }
  );

  // Récupération des données de la boutique
  const { data: shop } = await supabase.from('shops').select('*').eq('slug', slug).single();
  if (!shop) return notFound();

  let photos: any[] = [];
  let isDemoMode = false;
  let currentPhotoUrl = shop.photo_url;

  // --- LOGIQUE INSTAGRAM (TOKEN REFRESH & FETCH) ---
  const hasInstagram = Boolean(shop.ig_access_token && shop.ig_user_id);

  if (!hasInstagram) {
    isDemoMode = true;
    photos = getDemoInstagramPhotos(locale);
  } else {
    let graphToken = shop.ig_access_token as string;
    
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const supabaseService = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
        { cookies: { getAll: () => [], setAll: () => {} } }
      );
      const refreshedToken = await ensureInstagramAccessTokenFresh(
        { id: shop.id, ig_access_token: shop.ig_access_token, ig_last_refreshed: shop.ig_last_refreshed },
        supabaseService
      );
      if (refreshedToken) graphToken = refreshedToken;
    }

    const [profilePictureResult, mediaResult] = await Promise.all([
      (async () => {
        if (!currentPhotoUrl) {
          try {
            const userRes = await fetch(`https://graph.facebook.com/v19.0/${shop.ig_user_id}?fields=profile_picture_url&access_token=${graphToken}`);
            const userData = await userRes.json();
            if (userData.profile_picture_url) {
                await supabase.from('shops').update({ photo_url: userData.profile_picture_url }).eq('id', shop.id);
                return userData.profile_picture_url;
            }
          } catch (err) { console.error("IG Profile Error:", err); }
        }
        return null;
      })(),
      (async () => {
        try {
          const res = await fetch(`https://graph.facebook.com/v19.0/${shop.ig_user_id}/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&access_token=${graphToken}&limit=12`);
          const json = await res.json();
          return json.data;
        } catch (err) { return null; }
      })(),
    ]);

    if (profilePictureResult) currentPhotoUrl = profilePictureResult;
    photos = mediaResult || getDemoInstagramPhotos(locale);
    if (!mediaResult) isDemoMode = true;
  }

  // --- 3. DONNÉES STRUCTURÉES (JSON-LD) ---
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Store",
    "name": shop.name,
    "description": shop.description || `Boutique artisanale située au Souk El Had d'Agadir.`,
    "image": currentPhotoUrl || 'https://www.soukelhadagadir.com/og-default.jpg',
    "url": `https://www.soukelhadagadir.com/shop/${slug}`,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": `Carré #${shop.box_number || "Non spécifié"}, Souk El Had`,
      "addressLocality": "Agadir",
      "addressRegion": "Souss-Massa",
      "postalCode": "80000",
      "addressCountry": "MA"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "30.4131",
      "longitude": "-9.5771"
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      "opens": "09:00",
      "closes": "20:00"
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Script JSON-LD injecté pour Google Search Console */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="bg-white border-b border-gray-100 p-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-orange-500 font-bold text-xl italic group-hover:text-orange-600 transition-colors">SoukElHad.ma</span>
          </Link>
          <Link href="/signup" className="bg-orange-500 text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-orange-600 shadow-lg shadow-orange-100 transition-all">
            {getMessage(locale, 'shop.signUp')}
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12 flex flex-col gap-16">
        <ShopVisitTracker shopId={shop.id} />

        {/* CARTE DE PROFIL "LUXY" */}
        <section className="relative overflow-hidden bg-gray-50/50 border border-gray-100 rounded-[2.5rem] p-8 md:p-12 flex flex-col md:flex-row gap-12 items-center">
            <div className="absolute top-0 end-0 w-64 h-64 bg-orange-100/30 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />

            <div className="w-full md:w-1/3 aspect-square relative rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white bg-white">
              {currentPhotoUrl ? (
                <Image src={currentPhotoUrl} alt={shop.name} fill className="object-cover" priority />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-orange-100">
                  <StoreIcon size={80} strokeWidth={1} />
                </div>
              )}
            </div>

            <div className="relative z-10 flex-grow text-center md:text-start">
                <div className="inline-flex items-center gap-2 bg-white px-4 py-1.5 rounded-full border border-gray-100 shadow-sm mb-6">
                    <Award size={14} className="text-orange-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Commerçant Vérifié</span>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight uppercase italic">
                    {shop.name}
                </h1>

                <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm font-bold text-gray-400 mb-8">
                    <span className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-gray-100 text-orange-600 shadow-sm">
                        <MapPin size={16} /> Carré #{shop.box_number || "---"}
                    </span>
                    {shop.ig_username && (
                      <a href={`https://instagram.com/${shop.ig_username}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-gray-100 shadow-sm hover:text-pink-600 transition-colors">
                        <Instagram size={16} /> @{shop.ig_username}
                      </a>
                    )}
                </div>

                <p className="text-lg text-gray-500 max-w-2xl italic leading-relaxed">
                    &quot;{shop.description || "Bienvenue dans notre boutique au cœur du Souk El Had."}&quot;
                </p>
            </div>
        </section>

        {/* GRILLE DE PRODUITS */}
        <div>
           <div className="text-center mb-12">
              <h2 className="text-3xl font-black mb-4 uppercase italic">{getMessage(locale, 'shop.newArrivals')}</h2>
              <div className="w-20 h-1.5 bg-orange-500 mx-auto rounded-full" />
           </div>
           <ProductGrid photos={photos} shop={shop} isDemoMode={isDemoMode} />
        </div>
      </main>
    </div>
  );
}