"use client"

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { X, ShieldCheck, ShoppingCart } from 'lucide-react'
import { useTranslation } from '@/components/LanguageProvider'
import { buildProductGridWhatsAppMessage } from '@/lib/translations'
import { trackActivity } from '@/app/shop/actions'

function productTitleFromCaption(caption: string | undefined, fallback: string): string {
  if (!caption?.trim()) return fallback
  const normalized = caption.replace(/\s+/g, ' ').trim()
  if (normalized.length <= 30) return normalized
  return `${normalized.slice(0, 30)}…`
}

function imageAltFromCaption(caption: string | undefined, fallback: string): string {
  const t = caption?.replace(/\s+/g, ' ').trim()
  return t || fallback
}

export default function ProductGrid({
  photos,
  shop,
  isDemoMode = false,
}: {
  photos: any[]
  shop: any
  isDemoMode?: boolean
}) {
  const { t, locale } = useTranslation()
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const modalContentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (selectedProduct && modalContentRef.current && !modalContentRef.current.contains(event.target as Node)) {
        setSelectedProduct(null);
      }
    }

    if (selectedProduct) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectedProduct]);

  /** Count a product view as soon as the user opens the modal (first line, before state update). */
  function handleOpenProduct(photo: (typeof photos)[number]) {
    if (shop?.id) {
      void trackActivity(shop.id, 'view')
    }
    setSelectedProduct(photo)
  }

  /** Prefill uses `buildProductGridWhatsAppMessage` → `translations[locale].productGrid.whatsappMessage`. */
  const waText = (permalink: string, caption: string | undefined) => {
    const rawTitle = productTitleFromCaption(
      caption,
      t('productGrid.productFallback')
    ).replace(/\*/g, '')
    const productTitle = `*${rawTitle}*`
    return buildProductGridWhatsAppMessage(locale, {
      productTitle,
      shopName: String(shop?.name ?? ''),
      link: permalink,
    })
  }

  const modalTitle = selectedProduct
    ? productTitleFromCaption(selectedProduct.caption, t('productGrid.detailsFallback'))
    : ''
  const modalImgAlt = selectedProduct
    ? imageAltFromCaption(selectedProduct.caption, t('productGrid.detailsFallback'))
    : ''

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
        {photos.map((photo) => {
          const priceMatch = photo.caption?.match(/(\d+)\s*(?:DH|Dhs|MAD)/i);
          const price = priceMatch ? priceMatch[1] : null;
          const title = productTitleFromCaption(photo.caption, t('productGrid.productFallback'));
          const imgAlt = imageAltFromCaption(photo.caption, t('productGrid.productFallback'));
          const isSvg =
            typeof photo.media_url === 'string' && photo.media_url.endsWith('.svg');

          return (
            <div
              key={photo.id}
              onClick={() => handleOpenProduct(photo)}
              className="bg-white border border-gray-100 rounded-[2rem] overflow-hidden flex flex-col hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group cursor-pointer p-3"
            >
              <div className="relative aspect-square w-full bg-gray-50 overflow-hidden rounded-[1.5rem]">
                {isDemoMode && (
                  <div className="absolute top-3 start-3 z-10 max-w-[min(100%,11rem)] rounded-full border border-amber-100/90 bg-white/90 px-2.5 py-1 shadow-sm backdrop-blur-sm">
                    <span className="block text-[9px] font-black uppercase leading-tight tracking-wide text-amber-900/85">
                      {t('productGrid.demoSyncBadge')}
                    </span>
                  </div>
                )}
                {photo.media_type === 'VIDEO' ? (
                  <video src={photo.media_url} className="w-full h-full object-cover" muted aria-label={imgAlt} />
                ) : (
                  <Image
                    src={photo.media_url}
                    alt={imgAlt}
                    fill
                    sizes="25vw"
                    unoptimized={isSvg}
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                )}

                {price && (
                  <div className="absolute bottom-4 start-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl font-black text-orange-600 shadow-sm text-sm">
                    {price} DH
                  </div>
                )}
              </div>

              <div className="p-4 flex-grow flex flex-col">
                <h3 className="text-sm font-bold text-gray-800 line-clamp-2 leading-tight tracking-tight mb-2 group-hover:text-orange-500 transition-colors">
                  {title}
                </h3>
              </div>
            </div>
          )
        })}
      </div>

      {selectedProduct &&
        (() => {
          const whatsappUrl = `https://wa.me/${shop.whatsapp_number || '212600000000'}?text=${encodeURIComponent(
            waText(selectedProduct.permalink, selectedProduct.caption)
          )}`

          return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 bg-gray-900/90 backdrop-blur-md animate-in fade-in duration-300">

              <div
                ref={modalContentRef}
                className="relative bg-white w-full max-w-4xl max-h-[85vh] overflow-hidden rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row animate-in slide-in-from-bottom duration-300"
              >

                <button
                  onClick={() => setSelectedProduct(null)}
                  className="absolute top-4 end-4 z-[110] bg-gray-100 hover:bg-orange-500 hover:text-white text-gray-500 p-2 rounded-full transition-all"
                  type="button"
                >
                  <X size={20} />
                </button>

                <div className="w-full md:w-1/2 bg-gray-50 flex items-center justify-center h-[40vh] md:h-[85vh]">
                  {selectedProduct.media_type === 'VIDEO' ? (
                    <video
                      src={selectedProduct.media_url}
                      controls
                      autoPlay
                      loop
                      className="max-h-full w-full object-contain"
                      aria-label={modalImgAlt}
                    />
                  ) : (
                    <div className="relative w-full h-full p-4 md:p-8">
                      <Image
                        src={selectedProduct.media_url}
                        alt={modalImgAlt}
                        fill
                        unoptimized={
                          typeof selectedProduct.media_url === 'string' &&
                          selectedProduct.media_url.endsWith('.svg')
                        }
                        className="object-contain"
                        priority
                      />
                    </div>
                  )}
                </div>

                <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-center">

                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <div className="inline-flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                      <ShieldCheck size={14} className="text-green-500 shrink-0" />
                      <span className="text-[9px] font-black uppercase text-gray-500 tracking-widest">{t('productGrid.certified')}</span>
                    </div>
                    {isDemoMode && (
                      <span className="inline-flex items-center rounded-full border border-amber-100 bg-amber-50/90 px-3 py-1.5 text-[9px] font-black uppercase tracking-wide text-amber-900/85">
                        {t('productGrid.demoSyncBadge')}
                      </span>
                    )}
                  </div>

                  <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-3 leading-tight tracking-tight uppercase italic leading-none">
                    {modalTitle}
                  </h2>

                  <div className="flex items-center gap-3 mb-6">
                    {(() => {
                      const p = selectedProduct.caption?.match(/(\d+)\s*(?:DH|Dhs|MAD)/i);
                      return p ? (
                        <div className="bg-orange-50 text-orange-600 px-5 py-2 rounded-full text-2xl font-black tracking-tighter shadow-sm border border-orange-100">
                          {p[1]} DH
                        </div>
                      ) : <span className="text-gray-400 font-bold uppercase tracking-widest text-xs italic">{t('productGrid.priceOnRequest')}</span>
                    })()}
                  </div>

                  <p className="text-sm text-gray-500 leading-normal italic mb-8 border-s-4 border-orange-100 ps-4 py-1">
                    {selectedProduct.caption || t('productGrid.noDescription')}
                  </p>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto flex items-center justify-center gap-3 w-full bg-orange-500 hover:bg-orange-600 text-white py-5 rounded-[1.5rem] font-bold text-lg transition-all shadow-xl shadow-orange-100 active:scale-95"
                    onClick={() => {
                      if (!shop?.id) return
                      void trackActivity(shop.id, 'view')
                      void trackActivity(shop.id, 'wa_click')
                    }}
                  >
                    <ShoppingCart size={18} className="shrink-0" />
                    <span className="font-bold">{t('productGrid.buyNow')}</span>
                  </a>

                </div>
              </div>
            </div>
          )
        })()}
    </>
  )
}
