'use client';

import { useFormStatus } from 'react-dom';
import { completeProfileAction } from '@/app/complete-profile/actions';
import type { Locale } from '@/lib/translations';

type Labels = {
  whatsappLabel: string;
  whatsappPlaceholder: string;
  submit: string;
  submitting: string;
};

function SubmitButton({ labels }: { labels: Labels }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-2xl bg-orange-600 py-4 text-center text-base font-black text-white shadow-lg transition hover:bg-orange-700 active:scale-[0.99] disabled:opacity-60"
    >
      {pending ? labels.submitting : labels.submit}
    </button>
  );
}

export default function CompleteProfileForm({
  locale,
  errorMsg,
  labels,
}: {
  locale: Locale;
  errorMsg?: string;
  labels: Labels;
}) {
  return (
    <form className="mt-8 space-y-5" action={completeProfileAction}>
      <div>
        <label
          htmlFor="whatsapp"
          className="block text-sm font-bold text-slate-800 mb-1.5"
        >
          {labels.whatsappLabel}
        </label>
        <input
          id="whatsapp"
          name="whatsapp"
          type="tel"
          required
          autoComplete="tel"
          dir={locale === 'ar' ? 'rtl' : 'ltr'}
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
          placeholder={labels.whatsappPlaceholder}
        />
      </div>

      {errorMsg && (
        <div className="rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-800">
          {errorMsg}
        </div>
      )}

      <SubmitButton labels={labels} />
    </form>
  );
}
