import React from 'react';
import Link from 'next/link';
import { translations } from '@/lib/translations';
import { getServerLocale } from '@/lib/locale-server';
import { SignupLocaleBar } from '@/app/signup/SignupLocaleBar';
import { SignupForm } from '@/app/signup/SignupForm';

export default async function SignUpPage(props: {
  searchParams: Promise<{ error?: string }>;
}) {
  const searchParams = await props.searchParams;
  const locale = await getServerLocale();
  const s = translations[locale].signup;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans text-slate-900 relative">
      <SignupLocaleBar />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-16 h-16 bg-orange-600 rounded-2xl flex items-center justify-center text-white font-black text-3xl mx-auto mb-6 shadow-xl shadow-orange-200">S</div>
        <h2 className="text-3xl font-black tracking-tight uppercase italic text-slate-950">
          {s.title}
        </h2>
        <p className="mt-2 text-sm text-slate-500 font-medium">
          {s.subtitle}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-10 px-6 shadow-xl shadow-slate-200/50 sm:rounded-[2.5rem] sm:px-10 border border-slate-100">

          {searchParams.error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-3">
              <span className="text-rose-500 mt-0.5">⚠️</span>
              <p className="text-sm font-bold text-rose-800">{searchParams.error}</p>
            </div>
          )}

          <SignupForm />

          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500 font-medium">
              {s.hasAccount}{' '}
              <Link href="/login" className="font-bold text-orange-600 hover:text-orange-500">
                {s.signIn}
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
