import React from 'react';
import Link from 'next/link';
import { getServerLocale } from '@/lib/locale-server';
import { getMessage } from '@/lib/translations';

export default async function VendrePage() {
  const locale = await getServerLocale();
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto">
        <Link href="/" className="font-black text-xl tracking-tighter uppercase">
          {getMessage(locale, 'user.brand')} <span className="text-orange-600">{getMessage(locale, 'user.brandAccent')}</span>
        </Link>
        <Link href="/login" className="bg-slate-900 text-white px-6 py-2.5 rounded-full font-bold text-sm">
          {getMessage(locale, 'pro.navSignUp')}
        </Link>
      </nav>

      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] mb-8 uppercase italic">
            {getMessage(locale, 'pro.heroTitle')}{' '}
            <span className="text-orange-600">{getMessage(locale, 'pro.heroTitleAccent')}</span>{' '}
            {getMessage(locale, 'pro.heroTitleEnd')}
          </h1>
          <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
            {getMessage(locale, 'pro.heroSubtitle')}
          </p>
          <div className="mt-12 flex flex-col md:flex-row gap-4 justify-center">
            <Link href="/login" className="bg-orange-600 text-white px-10 py-5 rounded-2xl font-black text-lg shadow-2xl shadow-orange-200 hover:scale-105 transition-transform uppercase">
              {getMessage(locale, 'pro.cta')}
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-24 px-6 rounded-[4rem] mx-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">

          <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
            <div className="text-4xl mb-6">📸</div>
            <h3 className="text-2xl font-black mb-4 tracking-tight uppercase italic">{getMessage(locale, 'pro.card1Title')}</h3>
            <p className="text-slate-500 font-medium leading-relaxed">
              {getMessage(locale, 'pro.card1Body')}
            </p>
          </div>

          <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
            <div className="text-4xl mb-6">💬</div>
            <h3 className="text-2xl font-black mb-4 tracking-tight uppercase italic">{getMessage(locale, 'pro.card2Title')}</h3>
            <p className="text-slate-500 font-medium leading-relaxed">
              {getMessage(locale, 'pro.card2Body')}
            </p>
          </div>

          <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
            <div className="text-4xl mb-6">🌍</div>
            <h3 className="text-2xl font-black mb-4 tracking-tight uppercase italic">{getMessage(locale, 'pro.card3Title')}</h3>
            <p className="text-slate-500 font-medium leading-relaxed">
              {getMessage(locale, 'pro.card3Body')}
            </p>
          </div>

        </div>
      </section>

      <section className="py-32 px-6 max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-black mb-16 uppercase italic tracking-tight">{getMessage(locale, 'pro.howTitle')}</h2>
        <div className="space-y-12 text-start">
          <div className="flex gap-8 items-start">
            <div className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center font-black shrink-0">1</div>
            <div>
              <h4 className="text-xl font-black uppercase italic">{getMessage(locale, 'pro.step1Title')}</h4>
              <p className="text-slate-500 font-medium">{getMessage(locale, 'pro.step1Body')}</p>
            </div>
          </div>
          <div className="flex gap-8 items-start">
            <div className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center font-black shrink-0">2</div>
            <div>
              <h4 className="text-xl font-black uppercase italic">{getMessage(locale, 'pro.step2Title')}</h4>
              <p className="text-slate-500 font-medium">{getMessage(locale, 'pro.step2Body')}</p>
            </div>
          </div>
          <div className="flex gap-8 items-start">
            <div className="w-12 h-12 bg-orange-600 text-white rounded-full flex items-center justify-center font-black shrink-0">3</div>
            <div>
              <h4 className="text-xl font-black uppercase italic">{getMessage(locale, 'pro.step3Title')}</h4>
              <p className="text-slate-500 font-medium">{getMessage(locale, 'pro.step3Body')}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-32 px-6 text-center">
        <div className="bg-slate-950 p-16 rounded-[4rem] text-white max-w-5xl mx-auto shadow-2xl">
          <h2 className="text-4xl md:text-5xl font-black mb-8 uppercase italic tracking-tighter">{getMessage(locale, 'pro.ctaTitle')}</h2>
          <Link href="/login" className="inline-block bg-orange-600 text-white px-12 py-6 rounded-2xl font-black text-xl hover:scale-105 transition-transform uppercase">
            {getMessage(locale, 'pro.ctaButton')}
          </Link>
          <p className="mt-6 text-slate-400 font-medium italic">{getMessage(locale, 'pro.ctaNote')}</p>
        </div>
      </section>

      <footer className="py-12 text-center border-t border-slate-100">
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em]">{getMessage(locale, 'pro.footer')}</p>
      </footer>
    </div>
  );
}
