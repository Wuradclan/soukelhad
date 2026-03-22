"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useTranslation } from "@/components/LanguageProvider"

export function Hero() {
  const { t } = useTranslation()

  const scrollToForm = () => {
    document.getElementById("waitlist-form")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/soukelhad_gate.png"
          alt={t("hero.imageAlt")}
          fill
          priority
          quality={75}
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: "center 60%" }}
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80 z-0" />

      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 text-center pt-16">
        <Badge variant="secondary" className="mb-6 bg-primary/20 text-primary border-primary/30 hover:bg-primary/30">
          {t("hero.badge")}
        </Badge>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight text-balance mb-6">
          {t("hero.title")}
        </h1>

        <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed text-pretty">
          {t("hero.subtitle")}
        </p>

        <Button size="lg" onClick={scrollToForm} className="text-lg px-8 py-6 h-auto shadow-xl hover:scale-105 transition-transform">
          {t("hero.cta")}
        </Button>
      </div>
    </section>
  )
}
