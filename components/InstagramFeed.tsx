// components/InstagramFeed.tsx
import React from 'react';

// On définit le type pour être propre en TypeScript
type InstagramPost = {
  id: string;
  caption?: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url: string;
  thumbnail_url?: string;
  permalink: string;
};

export default function InstagramFeed({ posts }: { posts: InstagramPost[] }) {
  if (!posts || posts.length === 0) {
    return (
      <div className="p-8 text-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
        <p className="text-gray-500">Aucune publication Instagram à afficher pour le moment.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {posts.map((post) => {
        // Si c'est une vidéo, l'API Meta ne donne pas l'image dans media_url, mais dans thumbnail_url
        const imageUrl = post.media_type === 'VIDEO' ? post.thumbnail_url : post.media_url;

        return (
          <a 
            key={post.id} 
            href={post.permalink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="group relative aspect-square overflow-hidden rounded-xl bg-gray-100 shadow-sm"
          >
            {/* L'image du post */}
            <img 
              src={imageUrl} 
              alt={post.caption?.substring(0, 50) || "Publication Instagram"} 
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
            
            {/* Overlay au survol (Effet très pro) */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
              <p className="text-white text-xs font-medium text-center line-clamp-3">
                {post.caption || "Voir sur Instagram"}
              </p>
            </div>

            {/* Petite icône Vidéo si c'est une vidéo */}
            {post.media_type === 'VIDEO' && (
              <div className="absolute top-2 right-2 bg-black/60 rounded-full p-1.5">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            )}
          </a>
        );
      })}
    </div>
  );
}