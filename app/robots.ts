import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  // Remplace par ton domaine principal choisi (ex: soukelhadagadir.com)
  const baseUrl = 'https://www.soukelhadagadir.com'

  return {
    rules: {
      userAgent: '*', // S'applique à tous les robots (Google, Bing, etc.)
      allow: '/',     // Autorise l'exploration de tout le site
      disallow: [
        '/api/',      // On cache les routes API pour plus de sécurité
        '/_next/',    // Inutile d'indexer les fichiers internes de Next.js
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}