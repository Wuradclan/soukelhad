import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

// Cache the sitemap for 1 hour so Google doesn't spam your database
export const revalidate = 3600; 

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.soukelhadagadir.com';

  // 1. Initialize Supabase (Use the Service Role key to bypass RLS for server-side fetching)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // 2. Fetch all shop slugs from your database
  // Replace 'shops' with your actual table name, and 'slug' with the column holding the shop name
  const { data: shops, error } = await supabase
    .from('shops')
    .select('slug, updated_at'); 

  if (error) {
    console.error("Error fetching shops for sitemap:", error);
    return []; 
  }

  // 3. Map the database results into Google's required sitemap format
  const shopUrls = shops.map((shop) => ({
    url: `${baseUrl}/shop/${shop.slug}`,
    lastModified: new Date(shop.updated_at || new Date()), // Tells Google if the shop updated recently
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // 4. Add your static routes manually
  const staticUrls = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0, // Homepage is highest priority
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    }
  ];

  // 5. Combine everything and return it! Next.js turns this into XML automatically.
  return [...staticUrls, ...shopUrls];
}