'use client';

import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from '@/components/LanguageProvider';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

export default function LoginPage() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(t('login.errorCredentials'));
      } else {
        router.push('/user');
        router.refresh();
      }
    } catch (err) {
      setError(t('login.errorUnexpected'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100 p-4 font-sans">
      <div className="absolute top-4 end-4">
        <LanguageSwitcher />
      </div>
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-white">

        <div className="bg-orange-600 p-8 text-center text-white">
          <h1 className="text-3xl font-black tracking-tight">{t('login.title')}</h1>
          <p className="text-orange-100 mt-2 font-medium opacity-90">{t('login.subtitle')}</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleLogin} className="space-y-5">

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5 ms-1">{t('login.emailLabel')}</label>
              <input
                type="email"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all text-gray-900"
                placeholder={t('login.emailPlaceholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5 ms-1">{t('login.passwordLabel')}</label>
              <input
                type="password"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all text-gray-900"
                placeholder={t('login.passwordPlaceholder')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-xs rounded-lg border border-red-100 font-bold flex items-center gap-2">
                <span>⚠️</span> {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-600 text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:bg-orange-700 active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100 mt-2"
            >
              {loading ? t('login.submitting') : t('login.submit')}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 font-medium">
              {t('login.noAccount')}{' '}
              <Link href="/signup" className="font-bold text-orange-600 hover:text-orange-500 transition-colors">
                {t('login.createAccount')}
              </Link>
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-400">
              {t('login.copyright')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
