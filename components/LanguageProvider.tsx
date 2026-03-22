'use client'

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useRouter } from 'next/navigation'
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  type Locale,
  getMessage,
  translations,
} from '@/lib/translations'

export type LanguageContextValue = {
  locale: Locale
  setLocale: (loc: Locale) => void
  t: (path: string) => string
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

function setCookieLocale(locale: Locale) {
  if (typeof document === 'undefined') return
  document.cookie = `${LOCALE_COOKIE}=${locale};path=/;max-age=31536000;SameSite=Lax`
}

export function LanguageProvider({
  children,
  initialLocale,
}: {
  children: React.ReactNode
  initialLocale: Locale
}) {
  const router = useRouter()
  const [locale, setLocaleState] = useState<Locale>(initialLocale)

  useEffect(() => {
    setLocaleState(initialLocale)
  }, [initialLocale])

  const setLocale = useCallback(
    (loc: Locale) => {
      setLocaleState(loc)
      setCookieLocale(loc)
      document.documentElement.lang = loc
      document.documentElement.dir = loc === 'ar' ? 'rtl' : 'ltr'
      router.refresh()
    },
    [router]
  )

  useEffect(() => {
    document.documentElement.lang = locale
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr'
  }, [locale])

  const t = useCallback(
    (path: string) => getMessage(locale, path),
    [locale]
  )

  const value = useMemo(
    () => ({ locale, setLocale, t }),
    [locale, setLocale, t]
  )

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  )
}

export function useTranslation() {
  const ctx = useContext(LanguageContext)
  if (!ctx) {
    throw new Error('useTranslation must be used within LanguageProvider')
  }
  return ctx
}

/** Safe for optional client trees (e.g. Storybook) — falls back to French. */
export function useTranslationOptional(): LanguageContextValue {
  const ctx = useContext(LanguageContext)
  if (ctx) return ctx
  return {
    locale: DEFAULT_LOCALE,
    setLocale: () => {},
    t: (path: string) => getMessage(DEFAULT_LOCALE, path),
  }
}

export { LanguageContext, translations }
