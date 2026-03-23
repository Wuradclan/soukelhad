"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/components/LanguageProvider"
import { LanguageSwitcher } from "@/components/LanguageSwitcher"
import { useSupabaseSession } from "@/hooks/use-supabase-session"

export function Navbar() {
  const { t } = useTranslation()
  const { isLoggedIn, loading } = useSupabaseSession()

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between gap-3">
          <span className="text-xl font-bold text-primary">
            {t("nav.brand")} <span className="text-foreground/60 text-base font-normal">{t("nav.brandSub")}</span>
          </span>
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <LanguageSwitcher />
            {loading ? (
              <div
                className="h-9 w-[9.5rem] rounded-md bg-muted animate-pulse"
                aria-hidden
              />
            ) : isLoggedIn ? (
              <Button asChild size="sm">
                <Link href="/user">{t("nav.dashboard")}</Link>
              </Button>
            ) : (
              <Button asChild size="sm" variant="default">
                <Link href="/login">{t("nav.login")}</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
