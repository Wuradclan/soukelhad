import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getServerLocale } from '@/lib/locale-server';
import { getMessage } from '@/lib/translations';
import CompleteProfileForm from '@/components/CompleteProfileForm';

function safeDecodeError(raw: string | undefined): string | undefined {
  if (!raw) return undefined;
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

export default async function CompleteProfilePage(props: {
  searchParams: Promise<{ error?: string }>;
}) {
  const searchParams = await props.searchParams;
  const locale = await getServerLocale();
  const cookieStore = await cookies();
  const errorDisplay = safeDecodeError(searchParams.error);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {}
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: shop } = await supabase
    .from('shops')
    .select('whatsapp_number')
    .eq('user_id', user.id)
    .maybeSingle();

  if (shop?.whatsapp_number && String(shop.whatsapp_number).trim() !== '') {
    redirect('/user');
  }

  if (!shop) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-orange-50 p-4">
        <p className="max-w-md text-center text-sm font-medium text-slate-600">
          {getMessage(locale, 'completeProfile.errorNoShop')}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-orange-50 p-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-200/80 bg-white p-8 shadow-xl">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          {getMessage(locale, 'completeProfile.title')}
        </h1>
        <p className="mt-2 text-sm font-medium text-slate-600 leading-relaxed">
          {getMessage(locale, 'completeProfile.subtitle')}
        </p>

        <CompleteProfileForm
          locale={locale}
          errorMsg={errorDisplay}
          labels={{
            whatsappLabel: getMessage(locale, 'completeProfile.whatsappLabel'),
            whatsappPlaceholder: getMessage(
              locale,
              'completeProfile.whatsappPlaceholder'
            ),
            submit: getMessage(locale, 'completeProfile.submit'),
            submitting: getMessage(locale, 'completeProfile.submitting'),
          }}
        />
      </div>
    </div>
  );
}
