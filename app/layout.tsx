import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  // Le titre doit contenir les mots-clés principaux pour Google
  title: 'Souk El Had Agadir | Boutique Digitale & Guide Officiel',
  alternates: {
    canonical: 'https://www.soukelhadagadir.com', // FORCE GOOGLE À TOUT GROUPER ICI
  },
  description: 'Le plus grand souk d\'Afrique à portée de clic. Localisez les meilleures boutiques de Souk El Had Agadir, découvrez les produits via Instagram et contactez les commerçants directement.',
  
  // URL de base pour éviter les erreurs de liens relatifs
  metadataBase: new URL('https://www.soukelhadagadir.com'),
  
  keywords: ['Souk El Had', 'Agadir', 'Maroc', 'Shopping Agadir', 'Artisanat Marocain', 'Boutique Souk Agadir', 'Guide Touristique Agadir'],
  
  // Configuration pour le partage sur les réseaux (WhatsApp, Facebook, Instagram)
  openGraph: {
    title: 'Souk El Had Agadir - Votre Guide Shopping Numérique',
    description: 'Explorez le Souk El Had comme jamais auparavant. Artisanat, mode, et produits locaux en direct d\'Agadir.',
    url: 'https://www.soukelhadagadir.com',
    siteName: 'Souk El Had Digital',
    locale: 'fr_FR',
    type: 'website',
  },

  // Pour Twitter/X (on ne sait jamais)
  twitter: {
    card: 'summary_large_image',
    title: 'Souk El Had Agadir Digital',
    description: 'Le guide indispensable pour vos achats au Souk d\'Agadir.',
  },

  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className={`${_geist.className} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}