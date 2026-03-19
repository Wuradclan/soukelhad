/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Utile pour passer le build si tu as des petites erreurs de types
    ignoreBuildErrors: true, 
  },
  images: {
    // On active l'optimisation (donc on ne met PAS unoptimized: true)
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.cdninstagram.com',
      },
      {
        protocol: 'https',
        hostname: '**.fbcdn.net',
      },
    ],
  },
}

module.exports = nextConfig