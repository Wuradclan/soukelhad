import React from 'react';
import { getServerLocale } from '@/lib/locale-server';
import { translations } from '@/lib/translations';

export async function generateMetadata() {
  const locale = await getServerLocale();
  const m = translations[locale].metadata;
  return {
    title: `${translations[locale].privacy.title} | Souk El Had Agadir`,
    description: m.description,
  };
}

export default async function PrivacyPolicy() {
  const locale = await getServerLocale();
  const contactEmail = 'a.wurad@gmail.com';
  const p = translations[locale].privacy;

  return (
    <main className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-black text-gray-900 mb-8 border-b pb-4">
          {p.title}
        </h1>

        <div className="prose prose-orange text-gray-700 space-y-8 max-w-none">

          <section>
            <h2 className="text-xl font-bold text-gray-950 mb-3">{p.s1Title}</h2>
            <p>{p.s1Body}</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-950 mb-3">{p.s2Title}</h2>
            <p>{p.s2Intro}</p>
            <ul className="list-disc ps-5 mt-2 space-y-2">
              <li>{p.s2Li1}</li>
              <li>{p.s2Li2}</li>
              <li>{p.s2Li3}</li>
              <li>{p.s2Li4}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-950 mb-3">{p.s3Title}</h2>
            <p>{p.s3Intro}</p>
            <ul className="list-disc ps-5 mt-2 space-y-2">
              <li>{p.s3Li1}</li>
              <li>{p.s3Li2}</li>
            </ul>
          </section>

          <section className="bg-orange-50 p-6 rounded-2xl border-s-4 border-orange-500 shadow-sm">
            <h2 className="text-xl font-bold text-gray-950 mb-3">{p.s4Title}</h2>
            <p className="mb-4 text-sm">{p.s4Intro}</p>
            <ol className="list-decimal ps-5 space-y-3 text-sm">
              <li>
                {(() => {
                  const [a, b] = p.s4Li1.split('{email}');
                  return (
                    <>
                      {a}
                      <strong>{contactEmail}</strong>
                      {b}
                    </>
                  );
                })()}
              </li>
              <li>{p.s4Li2}</li>
              <li>{p.s4Li3}</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-950 mb-3">{p.s5Title}</h2>
            <p>
              {p.s5Body} <br />
              <strong>{p.s5Name}</strong><br />
              {p.emailLabel} <span className="text-orange-600 font-bold">{contactEmail}</span>
            </p>
          </section>

          <p className="text-xs text-gray-400 pt-8 border-t italic">
            {p.lastUpdate}
          </p>
        </div>
      </div>
    </main>
  );
}
