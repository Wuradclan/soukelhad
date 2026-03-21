import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

// Correction Next.js 15 : params est maintenant une Promise
export default async function ShopPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  // 1. On attend la résolution du slug
  const { slug } = await params;

  // 2. Initialisation Supabase
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get(name: string) { return cookieStore.get(name)?.value } } }
  );

  // 3. Récupérer les infos de la boutique
  const { data: shop, error } = await supabase
    .from('shops')
    .select('*')
    .eq('slug', slug)
    .single();

  // Si le slug ne correspond à rien dans la table 'shops', on lance la 404
  if (error || !shop) {
    console.error("Boutique non trouvée pour le slug :", slug);
    return notFound();
  }

  // 4. Récupération Instagram (Optionnelle)
  let instagramMedia = [];
  if (shop.ig_access_token) {
    try {
      const res = await fetch(
        `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,media_url,permalink&access_token=${shop.ig_access_token}`,
        { next: { revalidate: 3600 } }
      );
      const data = await res.json();
      if (data.data) instagramMedia = data.data;
    } catch (e) {
      console.log("Instagram non dispo pour le moment");
    }
  }

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      {/* Header façon Souk Moderne */}
      <header className="bg-orange-600 py-20 px-6 text-center text-white shadow-inner">
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4 drop-shadow-md">
          {shop.name}
        </h1>
        <p className="text-orange-100 text-lg max-w-2xl mx-auto font-medium italic opacity-90">
          {shop.description || "Commerçant authentique au cœur du Souk El Had d'Agadir."}
        </p>
      </header>

      <main className="max-w-6xl mx-auto py-16 px-6">
        <div className="flex items-center justify-between mb-10 border-b pb-4">
          <h2 className="text-2xl font-black flex items-center gap-3">
            <span className="bg-orange-100 p-2 rounded-lg text-xl">📸</span> 
            Derniers Arrivages
          </h2>
          {shop.ig_access_token && (
            <span className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100 uppercase">
              Live Instagram
            </span>
          )}
        </div>

        {/* Grille de photos ou Message d'attente */}
        {instagramMedia.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {instagramMedia.map((media: any) => (
              <a 
                key={media.id} 
                href={media.permalink} 
                target="_blank" 
                className="group relative aspect-square overflow-hidden rounded-3xl bg-gray-50 border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-300"
              >
                <img 
                  src={media.media_url} 
                  alt={media.caption || "Article du Souk"} 
                  className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                   <p className="text-white text-xs font-medium truncate">{media.caption}</p>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-200">
            <div className="text-4xl mb-4">🏜️</div>
            <p className="text-gray-400 font-bold text-lg">La vitrine est en cours de préparation.</p>
            <p className="text-gray-300 text-sm mt-1 italic">Revenez bientôt pour voir nos nouveaux produits !</p>
          </div>
        )}
      </main>

      <footer className="py-12 border-t border-gray-50 text-center">
        <p className="text-gray-400 text-sm font-bold tracking-widest uppercase">
          Souk El Had Digital • Agadir 2026
        </p>
      </footer>
    </div>
  );
}