import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { Providers } from '@/components/Providers'
import {
  LOCALE_COOKIE,
  localeFromCookie,
  translations,
  type Locale,
} from '@/lib/translations'

export async function generateMetadata(): Promise<Metadata> {
  const store = await cookies()
  const locale: Locale = localeFromCookie(store.get(LOCALE_COOKIE)?.value)
  const m = translations[locale].metadata

  return {
    title: m.title,
    alternates: {
      canonical: 'https://www.soukelhadagadir.com',
    },
    description: m.description,
    metadataBase: new URL('https://www.soukelhadagadir.com'),
    keywords: [...m.keywords],
    openGraph: {
      title: m.ogTitle,
      description: m.ogDescription,
      url: 'https://www.soukelhadagadir.com',
      siteName: 'Souk El Had Digital',
      locale: locale === 'ar' ? 'ar_MA' : 'fr_FR',
      type: 'website',
      images: ['/images/og-image.jpg'],
    },
    twitter: {
      card: 'summary_large_image',
      title: m.twitterTitle,
      description: m.twitterDescription,
      images: ['/images/og-image.jpg'],
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
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const store = await cookies()
  const initialLocale: Locale = localeFromCookie(store.get(LOCALE_COOKIE)?.value)

  return (
    <html
      lang={initialLocale}
      dir={initialLocale === 'ar' ? 'rtl' : 'ltr'}
      className="scroll-smooth"
      suppressHydrationWarning
    >
      <body className="bg-background text-foreground">
        <Providers initialLocale={initialLocale}>{children}</Providers>
        <Analytics />
      </body>
    </html>
  )
}
