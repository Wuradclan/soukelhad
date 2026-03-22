'use client';

import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { useTranslation } from '@/components/LanguageProvider';
import { parseWhatsAppNumber } from '@/lib/phone';
import { signUpAction } from './actions';
import { cn } from '@/lib/utils';

export function SignupForm() {
  const { t } = useTranslation();
  const [whatsapp, setWhatsapp] = useState('');
  const [showEmptySubmitError, setShowEmptySubmitError] = useState(false);

  const trimmed = whatsapp.trim();
  const parsed = parseWhatsAppNumber(trimmed);
  const isEmpty = trimmed === '';
  const isValid = parsed.ok;
  const showFormatError = !isEmpty && !isValid;
  const showRequiredError = showEmptySubmitError && isEmpty;
  const showSuccess = isValid && !isEmpty;

  function handleWhatsappChange(e: React.ChangeEvent<HTMLInputElement>) {
    setWhatsapp(e.target.value);
    setShowEmptySubmitError(false);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    if (!trimmed) {
      e.preventDefault();
      setShowEmptySubmitError(true);
      return;
    }
    if (!parseWhatsAppNumber(trimmed).ok) {
      e.preventDefault();
      return;
    }
    setShowEmptySubmitError(false);
  }

  const submitDisabled = !isValid;

  return (
    <form action={signUpAction} onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="shopName"
          className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2"
        >
          {t('signup.shopLabel')}
        </label>
        <div className="mt-1">
          <input
            id="shopName"
            name="shopName"
            type="text"
            required
            minLength={2}
            autoComplete="off"
            placeholder={t('signup.shopPlaceholder')}
            className="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-xl shadow-sm placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent font-medium transition-all"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="whatsapp"
          className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2"
        >
          {t('signup.whatsappLabel')}
        </label>
        <div className="mt-1 relative">
          <input
            id="whatsapp"
            name="whatsapp"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={whatsapp}
            onChange={handleWhatsappChange}
            placeholder={t('signup.whatsappPlaceholder')}
            aria-invalid={showFormatError || showRequiredError ? true : undefined}
            aria-describedby="whatsapp-feedback"
            className={cn(
              'appearance-none block w-full py-3 border rounded-xl shadow-sm placeholder-slate-300 focus:outline-none focus:ring-2 focus:border-transparent font-medium transition-all',
              showSuccess && 'ps-4 pe-11 border-emerald-500 bg-emerald-50/30 focus:ring-emerald-500/40',
              showFormatError && 'ps-4 pe-4 border-rose-400 bg-rose-50/40 focus:ring-rose-500',
              showRequiredError && 'ps-4 pe-4 border-rose-400 bg-rose-50/40 focus:ring-rose-500',
              !showSuccess && !showFormatError && !showRequiredError &&
                'px-4 border-slate-200 focus:ring-orange-500'
            )}
          />
          {showSuccess && (
            <span
              className="absolute end-3 top-1/2 -translate-y-1/2 text-emerald-600 pointer-events-none"
              aria-hidden
            >
              <Check className="w-5 h-5" strokeWidth={2.5} />
            </span>
          )}
        </div>

        <div id="whatsapp-feedback" className="relative mt-1.5 min-h-[2.75rem]">
          <div className="absolute inset-x-0 top-0">
            {showFormatError ? (
              <p role="alert" className="text-xs font-bold text-rose-600 leading-relaxed">
                {t('signup.errors.whatsappInvalid')}
              </p>
            ) : showRequiredError ? (
              <p role="alert" className="text-xs font-bold text-rose-600 leading-relaxed">
                {t('signup.errors.required')}
              </p>
            ) : showSuccess ? (
              <p className="text-xs font-medium text-emerald-700 leading-relaxed flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 shrink-0" strokeWidth={2.5} aria-hidden />
                {t('signup.whatsappValid')}
              </p>
            ) : (
              <p className="text-xs text-slate-500 leading-relaxed">{t('signup.whatsappHint')}</p>
            )}
          </div>
        </div>
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2"
        >
          {t('signup.emailLabel')}
        </label>
        <div className="mt-1">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder={t('signup.emailPlaceholder')}
            className="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-xl shadow-sm placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent font-medium transition-all"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2"
        >
          {t('signup.passwordLabel')}
        </label>
        <div className="mt-1">
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            placeholder={t('signup.passwordPlaceholder')}
            className="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-xl shadow-sm placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent font-medium transition-all"
          />
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={submitDisabled}
          className={cn(
            'w-full flex justify-center py-4 px-4 border border-transparent rounded-2xl text-sm font-black uppercase tracking-wide text-white transition-all',
            submitDisabled
              ? 'bg-slate-300 cursor-not-allowed shadow-none hover:scale-100'
              : 'bg-orange-600 hover:bg-orange-700 shadow-lg shadow-orange-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 hover:scale-[1.02]'
          )}
        >
          {t('signup.submit')}
        </button>
      </div>
    </form>
  );
}
