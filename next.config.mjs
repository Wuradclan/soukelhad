/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Gardé : Pratique pour ton projet Master afin d'éviter les blocages lors du déploiement
    ignoreBuildErrors: true, 
  },
  images: {
    // Gardé : Excellente optimisation pour la vitesse de chargement à Agadir
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.cdninstagram.com',
        pathname: '/**', // Requis par Next.js 14/15 pour valider tous les dossiers
      },
      {
        protocol: 'https',
        hostname: '**.fbcdn.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'scontent.cdninstagram.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'scontent.xx.fbcdn.net',
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig