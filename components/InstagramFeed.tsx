'use client';

import React from 'react';
import { useTranslation } from '@/components/LanguageProvider';

type InstagramPost = {
  id: string;
  caption?: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url: string;
  thumbnail_url?: string;
  permalink: string;
};

export default function InstagramFeed({ posts }: { posts: InstagramPost[] }) {
  const { t } = useTranslation();

  if (!posts || posts.length === 0) {
    return (
      <div className="p-8 text-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
        <p className="text-gray-500">{t('instagramFeed.emptyFeed')}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {posts.map((post) => {
        const imageUrl = post.media_type === 'VIDEO' ? post.thumbnail_url : post.media_url;

        return (
          <a
            key={post.id}
            href={post.permalink}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative aspect-square overflow-hidden rounded-xl bg-gray-100 shadow-sm"
          >
            <img
              src={imageUrl}
              alt={post.caption?.substring(0, 50) || t('instagramFeed.postAlt')}
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />

            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
              <p className="text-white text-xs font-medium text-center line-clamp-3">
                {post.caption || t('instagramFeed.viewOnInstagram')}
              </p>
            </div>

            {post.media_type === 'VIDEO' && (
              <div className="absolute top-2 end-2 bg-black/60 rounded-full p-1.5">
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
