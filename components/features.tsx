import React from 'react'
import { MapPin, MessageCircle, ArrowRight, ShoppingBag } from 'lucide-react'
import { getServerLocale } from '@/lib/locale-server'
import { translations } from '@/lib/translations'

export async function Features() {
  const locale = await getServerLocale()
  const f = translations[locale].features
  const items = f.items

  const illustrations = [
    (
      <div key="i0" className="relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 flex items-center justify-center">
        <div className="w-20 h-28 bg-white rounded-md shadow-sm border border-gray-200 p-2 scale-90 -translate-x-2 rtl:translate-x-2">
          <div className="flex items-center gap-1 mb-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-tr from-yellow-400 to-purple-600" />
            <div className="w-8 h-1 bg-gray-200 rounded" />
          </div>
          <div className="w-full h-12 bg-gray-100 rounded mb-1" />
          <div className="space-y-1">
            <div className="w-full h-1 bg-gray-200 rounded" />
            <div className="w-2/3 h-1 bg-gray-200 rounded" />
          </div>
        </div>
        <div className="z-10 bg-orange-500 rounded-full p-1 shadow-lg">
          <ArrowRight className="text-white w-4 h-4 rtl:rotate-180" />
        </div>
        <div className="w-20 h-28 bg-white rounded-md shadow-sm border-2 border-orange-500 p-2 scale-90 translate-x-2 rtl:-translate-x-2">
          <div className="w-full h-4 bg-orange-100 rounded mb-2 flex items-center px-1">
            <div className="w-full h-1 bg-orange-400 rounded" />
          </div>
          <div className="w-full h-12 bg-orange-50 rounded mb-1 border border-orange-200 overflow-hidden flex items-center justify-center">
            <ShoppingBag className="text-orange-500 w-4 h-4 opacity-50" />
          </div>
          <div className="w-full h-2 bg-green-500 rounded-sm scale-75" />
        </div>
      </div>
    ),
    (
      <div key="i1" className="relative w-full h-32 bg-orange-50 rounded-lg border border-orange-100 flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'linear-gradient(#f97316 1px, transparent 1px), linear-gradient(90deg, #f97316 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />
        <div className="absolute w-full h-4 bg-white rotate-12" />
        <div className="absolute w-4 h-full bg-white -rotate-12" />
        <div className="relative flex flex-col items-center animate-bounce">
          <div className="bg-orange-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg mb-1">
            {f.mockupLabel}
          </div>
          <MapPin className="text-orange-600 w-8 h-8 fill-orange-600/20" />
        </div>
      </div>
    ),
    (
      <div key="i2" className="relative w-full h-32 bg-green-50 rounded-lg border border-green-100 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-2xl rounded-bl-none rtl:rounded-bl-2xl rtl:rounded-br-none shadow-md p-3 border border-green-100 max-w-[80%] relative">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
              <MessageCircle className="text-white w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-gray-500">{f.mockupClient}</span>
          </div>
          <p className="text-[10px] text-gray-700 leading-tight italic">
            {f.mockupChat}
          </p>
        </div>
        <div className="mt-2 bg-green-600 text-white text-[10px] font-bold px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1">
          <MessageCircle size={10} /> {f.mockupWa}
        </div>
      </div>
    ),
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((feature, index) => (
            <div
              key={index}
              className="group p-6 rounded-2xl border border-gray-100 hover:border-orange-200 hover:shadow-xl transition-all duration-300 bg-white"
            >
              <div className="mb-6 transform group-hover:scale-105 transition-transform duration-300">
                {illustrations[index]}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
