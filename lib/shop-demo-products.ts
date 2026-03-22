import { translations, type Locale } from '@/lib/translations';

const DEMO_IMAGE_PATHS = [
  '/images/placeholder-babouche-1.svg',
  '/images/placeholder-tajine-1.svg',
  '/images/placeholder-rug-1.svg',
  '/images/placeholder-babouche-2.svg',
  '/images/placeholder-tajine-2.svg',
  '/images/placeholder-rug-2.svg',
] as const;

/** Instagram-shaped items for public shop when IG token is missing or Graph API is blocked (e.g. Meta Dev mode). */
export function getDemoInstagramPhotos(locale: Locale) {
  const products = translations[locale].shop.demoProducts;
  return products.map((p, i) => ({
    id: `demo-${i + 1}`,
    media_type: 'IMAGE',
    media_url: DEMO_IMAGE_PATHS[i],
    caption: p.caption,
    permalink: 'https://www.instagram.com/',
    timestamp: new Date().toISOString(),
  }));
}
