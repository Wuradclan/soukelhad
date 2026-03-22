import React from 'react';
import { getServerLocale } from '@/lib/locale-server';
import { translations } from '@/lib/translations';

export async function generateMetadata() {
  const locale = await getServerLocale();
  const m = translations[locale].metadata;
  return {
    title: `${translations[locale].terms.title} | Souk El Had Agadir`,
    description: m.description,
  };
}

export default async function TermsOfService() {
  const locale = await getServerLocale();
  const contactEmail = 'a.wurad@gmail.com';
  const x = translations[locale].terms;

  return (
    <main className="min-h-screen bg-white py-12 px-6 font-sans text-gray-800">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-black mb-8 border-b pb-4 text-gray-900">
          {x.title}
        </h1>

        <div className="space-y-6 text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">{x.s1Title}</h2>
            <p>{x.s1Body}</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">{x.s2Title}</h2>
            <p>{x.s2Body}</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">{x.s3Title}</h2>
            <p>{x.s3Body}</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">{x.s4Title}</h2>
            <p>{x.s4Body}</p>
          </section>

          <section className="pt-8 border-t text-sm">
            <p>
              {x.s5Body} <strong>{contactEmail}</strong>
            </p>
            <p className="mt-2 italic">{x.footerUpdate}</p>
          </section>
        </div>
      </div>
    </main>
  );
}
