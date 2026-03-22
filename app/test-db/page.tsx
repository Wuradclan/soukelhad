'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useTranslation } from '@/components/LanguageProvider';

export default function TestConnection() {
  const { t, locale } = useTranslation();
  const [status, setStatus] = useState<'testing' | 'success' | 'error'>('testing');
  const [message, setMessage] = useState('');

  useEffect(() => {
    setMessage(t('testDb.checking'));
    setStatus('testing');

    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    async function checkConn() {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) throw error;

        setStatus('success');
        setMessage(t('testDb.success'));
        console.log('Session data:', data);
      } catch (err: unknown) {
        setStatus('error');
        const msg = err instanceof Error ? err.message : String(err);
        setMessage(`${t('testDb.errorPrefix')} ${msg}`);
        console.error(err);
      }
    }

    checkConn();
  }, [locale, t]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4 font-mono">
      <div className={`p-8 rounded-2xl border-2 ${
        status === 'testing' ? 'border-blue-500' :
        status === 'success' ? 'border-green-500' : 'border-red-500'
      } bg-gray-800 shadow-2xl max-w-lg w-full`}>
        <h1 className="text-xl font-bold mb-4 uppercase tracking-widest">{t('testDb.title')}</h1>
        <p className="text-sm mb-6 opacity-80">{message}</p>

        <div className="text-xs space-y-2 bg-black/50 p-4 rounded-lg overflow-x-auto">
          <p><span className="text-blue-400">URL:</span> {process.env.NEXT_PUBLIC_SUPABASE_URL}</p>
          <p><span className="text-blue-400">Status:</span> {status}</p>
        </div>

        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-6 w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-all"
        >
          {t('testDb.retest')}
        </button>
      </div>
    </div>
  );
}
