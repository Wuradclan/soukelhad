import { cookies } from 'next/headers'
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  localeFromCookie,
  type Locale,
  translations,
} from '@/lib/translations'

export async function getServerLocale(): Promise<Locale> {
  const store = await cookies()
  return localeFromCookie(store.get(LOCALE_COOKIE)?.value)
}

export function getServerTranslations(locale: Locale) {
  return translations[locale]
}
