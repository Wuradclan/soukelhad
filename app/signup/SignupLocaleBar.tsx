'use client';

import { LanguageSwitcher } from '@/components/LanguageSwitcher';

export function SignupLocaleBar() {
  return (
    <div className="fixed top-4 end-4 z-[100]">
      <LanguageSwitcher />
    </div>
  );
}
