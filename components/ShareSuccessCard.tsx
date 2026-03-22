'use client'

import { forwardRef, useCallback, useRef, useState, type CSSProperties } from 'react'
import { toPng } from 'html-to-image'
import QRCode from 'react-qr-code'
import type { Locale } from '@/lib/translations'

export type ShareSuccessCardLabels = {
  weeklyVisitors: string
  productViews: string
  footerHint: string
  brand: string
}

export type ShareSuccessCardProps = {
  shopName: string
  slug: string
  shopUrl: string
  displayUrl: string
  weeklyVisitors: number
  weeklyProductViews: number
  locale: Locale
  labels: ShareSuccessCardLabels
}

const STORY_W = 360
const STORY_H = 640

const patternStyle: CSSProperties = {
  backgroundImage: [
    'repeating-linear-gradient(45deg, transparent, transparent 9px, rgba(251, 146, 60, 0.045) 9px, rgba(251, 146, 60, 0.045) 10px)',
    'repeating-linear-gradient(-45deg, transparent, transparent 14px, rgba(148, 163, 184, 0.06) 14px, rgba(148, 163, 184, 0.06) 15px)',
    'radial-gradient(ellipse 120% 80% at 50% -10%, rgba(249, 115, 22, 0.12), transparent 55%)',
  ].join(', '),
}

function formatCount(n: number, locale: Locale): string {
  const loc = locale === 'ar' ? 'ar' : 'fr-FR'
  return new Intl.NumberFormat(loc, { maximumFractionDigits: 0 }).format(n)
}

export const ShareSuccessCard = forwardRef<HTMLDivElement, ShareSuccessCardProps>(
  function ShareSuccessCard(
    { shopName, shopUrl, displayUrl, weeklyVisitors, weeklyProductViews, locale, labels },
    ref
  ) {
    const dir = locale === 'ar' ? 'rtl' : 'ltr'
    const textAlign = locale === 'ar' ? 'right' : 'left'

    return (
      <div
        ref={ref}
        dir={dir}
        className="relative overflow-hidden rounded-none text-white shadow-2xl"
        style={{
          width: STORY_W,
          height: STORY_H,
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, "Noto Sans Arabic", sans-serif',
        }}
      >
        <div
          className="absolute inset-0 bg-gradient-to-b from-slate-700 via-slate-950 to-black"
          aria-hidden
        />
        <div className="absolute inset-0 opacity-90" style={patternStyle} aria-hidden />
        <div className="relative flex h-full flex-col px-7 pb-8 pt-10">
          <header className="mb-6 border-b border-white/10 pb-5">
            <p className="text-[11px] font-black uppercase tracking-[0.35em] text-orange-400">
              {labels.brand}
            </p>
            <h1
              className="mt-2 line-clamp-2 text-2xl font-black leading-tight tracking-tight text-white"
              style={{ textAlign }}
            >
              {shopName}
            </h1>
          </header>

          <div className="flex flex-1 flex-col justify-center gap-6">
            <div
              className="rounded-2xl border border-white/10 bg-white/5 px-5 py-6 backdrop-blur-[2px]"
              style={{ textAlign }}
            >
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">
                {labels.weeklyVisitors}
              </p>
              <p className="mt-2 text-5xl font-black tabular-nums tracking-tight text-white">
                {formatCount(weeklyVisitors, locale)}
              </p>
            </div>
            <div
              className="rounded-2xl border border-orange-500/25 bg-orange-500/10 px-5 py-6 backdrop-blur-[2px]"
              style={{ textAlign }}
            >
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-orange-200/90">
                {labels.productViews}
              </p>
              <p className="mt-2 text-5xl font-black tabular-nums tracking-tight text-orange-50">
                {formatCount(weeklyProductViews, locale)}
              </p>
            </div>
          </div>

          <footer className="mt-auto flex flex-col items-center gap-4 border-t border-white/10 pt-6">
            <p className="text-center text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
              {labels.footerHint}
            </p>
            <div className="flex flex-col items-center gap-3">
              <div className="rounded-xl bg-white p-2 shadow-lg">
                <QRCode value={shopUrl} size={112} level="M" fgColor="#0f172a" bgColor="#ffffff" />
              </div>
              <p className="max-w-[280px] break-all text-center text-[11px] font-bold tracking-tight text-orange-300">
                {displayUrl}
              </p>
            </div>
          </footer>
        </div>
      </div>
    )
  }
)

export function ShareSuccessCardDownload(
  props: ShareSuccessCardProps & { downloadLabel: string; generatingLabel: string }
) {
  const { downloadLabel, generatingLabel, ...cardProps } = props
  const ref = useRef<HTMLDivElement>(null)
  const busyRef = useRef(false)
  const [loading, setLoading] = useState(false)

  const handleDownload = useCallback(async () => {
    const node = ref.current
    if (!node || busyRef.current) return
    busyRef.current = true
    setLoading(true)
    try {
      const dataUrl = await toPng(node, {
        pixelRatio: 3,
        cacheBust: true,
        backgroundColor: '#020617',
        style: {
          transform: 'none',
        },
      })
      const a = document.createElement('a')
      a.href = dataUrl
      a.download = `soukelhad-story-${cardProps.slug}.png`
      a.rel = 'noopener'
      a.click()
    } catch (e) {
      console.error('ShareSuccessCard: toPng failed', e)
    } finally {
      busyRef.current = false
      setLoading(false)
    }
  }, [cardProps.slug])

  return (
    <>
      <button
        type="button"
        onClick={handleDownload}
        disabled={loading}
        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-black uppercase tracking-widest text-slate-700 shadow-sm transition hover:border-orange-300 hover:bg-orange-50/80 disabled:opacity-60"
      >
        {loading ? generatingLabel : downloadLabel}
      </button>
      <div className="pointer-events-none fixed left-[-12000px] top-0 z-0" aria-hidden>
        <ShareSuccessCard ref={ref} {...cardProps} />
      </div>
    </>
  )
}
