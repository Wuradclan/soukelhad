import { MetadataRoute } from 'next'

// L'erreur vient souvent de l'oubli du mot "default" ici
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.soukelhadagadir.com'

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    // Tu peux ajouter d'autres pages ici plus tard
  ]
}