import { ExternalLink } from 'lucide-react';


// Composant SVG personnalisé pour Instagram (évite l'erreur 'deprecated' de Lucide)
const InstagramIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
)

async function getInstagramPosts() {
  const IG_ACCOUNT_ID = process.env.IG_ACCOUNT_ID;
  const TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;
  
  if (!IG_ACCOUNT_ID || !TOKEN) return [];

  const url = `https://graph.facebook.com/v19.0/${IG_ACCOUNT_ID}/media?fields=id,caption,media_url,permalink,timestamp,media_type&access_token=${TOKEN}&limit=6`;

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error("Erreur Instagram:", error);
    return [];
  }
}

export async function InstagramFeed() {
  const posts = await getInstagramPosts();

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-orange-600 mb-2">
            En direct de Souk El Had
          </h2>
          <p className="text-gray-600">Suivez nos dernières pépites sur Instagram</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {posts.length > 0 ? (
            posts.map((post: any) => (
              <a 
                key={post.id} 
                href={post.permalink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group relative aspect-square overflow-hidden rounded-xl bg-gray-200"
              >
                <img 
                  src={post.media_url} 
                  alt={post.caption || "Post Instagram"} 
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <InstagramIcon className="text-white w-8 h-8" />
                </div>
              </a>
            ))
          ) : (
            [...Array(6)].map((_, i) => (
              <div key={i} className="aspect-square bg-gray-200 animate-pulse rounded-xl" />
            ))
          )}
        </div>

        <div className="mt-10 text-center">
          <a 
            href="https://instagram.com/soukelhad.ma" 
            className="inline-flex items-center gap-2 px-6 py-3 border-2 border-orange-600 text-orange-600 font-bold rounded-full hover:bg-orange-600 hover:text-white transition-colors"
          >
            Suivre @soukelhad.ma <ExternalLink size={18} />
          </a>
        </div>
      </div>
    </section>
  );
}