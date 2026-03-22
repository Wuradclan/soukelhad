"use client"

import { Button } from "@/components/ui/button"
import { useTranslation } from "@/components/LanguageProvider"
import { LanguageSwitcher } from "@/components/LanguageSwitcher"

export function Navbar() {
  const { t } = useTranslation()

  const scrollToForm = () => {
    document.getElementById("waitlist-form")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between gap-3">
          <span className="text-xl font-bold text-primary">
            {t("nav.brand")} <span className="text-foreground/60 text-base font-normal">{t("nav.brandSub")}</span>
          </span>
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <LanguageSwitcher />
            <Button onClick={scrollToForm} size="sm">
              {t("nav.signUp")}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
