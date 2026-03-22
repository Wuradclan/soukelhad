'use client'

import { useTranslation } from '@/components/LanguageProvider'
import type { Locale } from '@/lib/translations'
import { cn } from '@/lib/utils'

export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, setLocale } = useTranslation()

  const btn = (code: Locale, label: string) => (
    <button
      type="button"
      onClick={() => setLocale(code)}
      className={cn(
        'px-3 py-1.5 rounded-md text-sm font-bold transition-colors',
        locale === code
          ? 'bg-orange-600 text-white'
          : 'bg-muted text-muted-foreground hover:bg-muted/80'
      )}
      aria-pressed={locale === code}
    >
      {label}
    </button>
  )

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 rounded-lg border border-border p-0.5 bg-background/80',
        className
      )}
      role="group"
      aria-label="Language"
    >
      {btn('fr', 'FR')}
      {btn('ar', 'AR')}
    </div>
  )
}
