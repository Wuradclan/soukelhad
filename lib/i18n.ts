/**
 * i18n barrel — prefer `useTranslation()` in client components
 * and `getServerLocale()` + `getMessage()` in Server Components / actions.
 */
export {
  useTranslation,
  useTranslationOptional,
} from '@/components/LanguageProvider'
export {
  getMessage,
  translations,
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  localeFromCookie,
  type Locale,
} from '@/lib/translations'
