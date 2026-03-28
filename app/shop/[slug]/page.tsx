import { Metadata } from 'next';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Store, Clock, Award, Instagram } from 'lucide-react';
import { getServerLocale } from '@/lib/locale-server';
import { getMessage } from '@/lib/translations';
import { ensureInstagramAccessTokenFresh } from '@/lib/instagram-refresh';
import { getDemoInstagramPhotos } from '@/lib/shop-demo-products';
import ProductGrid from '@/components/ProductGrid';
import { ShopVisitTracker } from '@/components/ShopVisitTracker';

type Props = {
  params: Promise<{ slug: string }>;
};

// --- 1. GENERATE METADATA (SEO & WhatsApp Previews) ---
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

    if (!shop) {
      return { title: 'Shop Not Found | Souk El Had Agadir' };
    }

    const defaultImage = 'https://www.soukelhadagadir.com/default-preview.jpg';
    const finalImage = shop.photo_url || defaultImage;

    return {
      title: `${shop.name} | Souk El Had Agadir`,
      description: shop.description || `Explore ${shop.name} at Souk El Had Agadir.`,
      alternates: { canonical: `/shop/${slug}` },
      openGraph: {
        title: shop.name,
        description: shop.description || `Discover ${shop.name} inside Souk El Had, Agadir.`,
        url: `https://www.soukelhadagadir.com/shop/${slug}`,
        siteName: 'Souk El Had Agadir',
        images: [{ url: finalImage, width: 1200, height: 630 }],
        locale: 'fr_FR',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: shop.name,
        images: [finalImage],
      },
    };
  } catch (e) {
    return { title: 'Souk El Had Agadir' };
  }
}

// --- 2. MAIN PAGE COMPONENT ---
export default async function ShopPage({ params }: Props) {
  const { slug } = await params;
  const locale = await getServerLocale();
  const cookieStore = await cookies();
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!, 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, 
    { cookies: { getAll() { return cookieStore.getAll(); } } }
  );

  // Fetch shop data
  const { data: shop } = await supabase.from('shops').select('*').eq('slug', slug).single();
  if (!shop) return notFound();

  let photos: any[] = [];
  let isDemoMode = false;
  let currentPhotoUrl = shop.photo_url;

  const canCallGraph = Boolean(shop.ig_access_token && shop.ig_user_id);

  if (!canCallGraph) {
    isDemoMode = true;
    photos = getDemoInstagramPhotos(locale);
  } else {
    // Check/Refresh token
    let graphToken = shop.ig_access_token as string;
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const supabaseService = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
        { cookies: { getAll: () => [], setAll: () => {} } }
      );
      const refreshed = await ensureInstagramAccessTokenFresh(
        { id: shop.id, ig_access_token: shop.ig_access_token, ig_last_refreshed: shop.ig_last_refreshed },
        supabaseService
      );
      if (refreshed) graphToken = refreshed;
    }

    // --- INSTAGRAM SYNC LOGIC ---
    // If we don't have a photo_url in DB, fetch the Instagram Profile Pic and save it
    if (!currentPhotoUrl) {
      try {
        const userRes = await fetch(`https://graph.facebook.com/v19.0/${shop.ig_user_id}?fields=profile_picture_url&access_token=${graphToken}`);
        const userData = await userRes.json();
        if (userData.profile_picture_url) {
          currentPhotoUrl = userData.profile_picture_url;
          // Update DB silently (don't wait for it)
          await supabase.from('shops').update({ photo_url: currentPhotoUrl }).eq('id', shop.id);
        }
      } catch (err) {
        console.error("Failed to sync IG profile pic", err);
      }
    }

    // Fetch Instagram Media
    try {
      const mediaUrl = `https://graph.facebook.com/v19.0/${shop.ig_user_id}/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&access_token=${graphToken}&limit=12`;
      const res = await fetch(mediaUrl);
      const json = await res.json();
      if (json.data) {
        photos = json.data;
      } else {
        isDemoMode = true;
        photos = getDemoInstagramPhotos(locale);
      }
    } catch {
      isDemoMode = true;
      photos = getDemoInstagramPhotos(locale);
    }
  }

  // --- JSON-LD Schema ---
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": shop.name,
    "description": shop.description || "Boutique au Souk El Had Agadir",
    "image": currentPhotoUrl || "https://www.soukelhadagadir.com/default-preview.jpg",
    "url": `https://www.soukelhadagadir.com/shop/${slug}`,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": `Box #${shop.box_number || '---'}, Souk El Had`,
      "addressLocality": "Agadir",
      "addressCountry": "MA"
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* HEADER */}
      <header className="bg-white border-b border-gray-100 p-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-orange-500 font-bold text-xl tracking-tight italic group-hover:text-orange-600 transition-colors">SoukElHad.ma</span>
            <span className="text-gray-400 font-light text-sm hidden sm:block">/ سوق الأحد</span>
          </Link>
          <div className="flex items-center gap-4">
             <Link href="/signup" className="bg-orange-500 text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-100">
                {getMessage(locale, 'shop.signUp')}
             </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12 flex flex-col gap-16">
        <ShopVisitTracker shopId={shop.id} />

        {/* PROFILE SECTION */}
        <section className="relative overflow-hidden bg-gray-50/50 border border-gray-100 rounded-[2.5rem] p-8 md:p-12 flex flex-col md:flex-row gap-12 items-center">
            <div className="absolute top-0 end-0 w-64 h-64 bg-orange-100/30 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />

            <div className="w-full md:w-1/3 aspect-square relative rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white bg-white">
              {currentPhotoUrl ? (
                <Image src={currentPhotoUrl} alt={shop.name} fill className="object-cover" unoptimized />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-orange-200">
                  <Store size={80} strokeWidth={1} />
                </div>
              )}
            </div>

            <div className="relative z-10 flex-grow text-center md:text-start">
                <div className="inline-flex items-center gap-2 bg-white px-4 py-1.5 rounded-full border border-gray-100 shadow-sm mb-6">
                    <Award size={14} className="text-orange-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{getMessage(locale, 'shop.officialBadge')}</span>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight uppercase italic leading-none">
                    {shop.name}
                </h1>

                <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm font-bold text-gray-400 mb-8">
                    <span className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-gray-100 text-orange-600 shadow-sm">
                        <MapPin size={16} /> {getMessage(locale, 'shop.box')} #{shop.box_number || "---"}
                    </span>
                    <span className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-gray-100 shadow-sm">
                        <Clock size={16} /> {getMessage(locale, 'shop.hours')}
                    </span>
                    {shop.ig_username && (
                      <a href={`https://instagram.com/${shop.ig_username}`} target="_blank" className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-gray-100 shadow-sm hover:text-pink-600 transition-colors">
                        <Instagram size={16} /> @{shop.ig_username}
                      </a>
                    )}
                </div>

                <p className="text-lg text-gray-500 max-w-2xl leading-relaxed italic">
                    &quot;{shop.description || getMessage(locale, 'shop.descriptionFallback')}&quot;
                </p>
            </div>
        </section>

        {/* PRODUCT GRID */}
        <div>
           <div className="text-center mb-12">
              <h2 className="text-3xl font-black mb-4 uppercase tracking-tight italic">{getMessage(locale, 'shop.newArrivals')}</h2>
              <div className="w-20 h-1.5 bg-orange-500 mx-auto rounded-full" />
           </div>
           <ProductGrid photos={photos} shop={shop} isDemoMode={isDemoMode} />
        </div>
      </main>

      <footer className="py-20 text-center border-t border-gray-50">
         <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.5em]">{getMessage(locale, 'shop.footer')}</p>
      </footer>
    </div>
  );
}