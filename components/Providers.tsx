'use client'

import { Tajawal } from 'next/font/google'
import { Geist } from 'next/font/google'
import { LanguageProvider, useTranslation } from '@/components/LanguageProvider'
import type { Locale } from '@/lib/translations'

const tajawal = Tajawal({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '700', '800', '900'],
  variable: '--font-tajawal',
  display: 'swap',
})

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
  display: 'swap',
})

function FontShell({ children }: { children: React.ReactNode }) {
  const { locale } = useTranslation()
  const fontClass = locale === 'ar' ? tajawal.className : geist.className
  return (
    <div
      className={`min-h-dvh ${fontClass} ${geist.variable} ${tajawal.variable} antialiased`}
    >
      {children}
    </div>
  )
}

export function Providers({
  children,
  initialLocale,
}: {
  children: React.ReactNode
  initialLocale: Locale
}) {
  return (
    <LanguageProvider initialLocale={initialLocale}>
      <FontShell>{children}</FontShell>
    </LanguageProvider>
  )
}
