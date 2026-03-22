/** Canonical public base for shop links (QR, story card). */
const DEFAULT_PUBLIC = 'https://www.soukelhadagadir.com'

export function getShopPublicUrls(slug: string): { href: string; display: string } {
  const raw = process.env.NEXT_PUBLIC_APP_URL?.trim() || DEFAULT_PUBLIC
  const base = raw.endsWith('/') ? raw.slice(0, -1) : raw
  const path = `/shop/${encodeURIComponent(slug)}`
  const u = new URL(path, `${base}/`)
  const host = u.hostname.replace(/^www\./, '')
  return {
    href: u.href,
    display: `${host}${u.pathname}`,
  }
}
