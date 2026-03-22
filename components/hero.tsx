"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function Hero() {
  const scrollToForm = () => {
    document.getElementById("waitlist-form")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* 1. IMAGE OPTIMISÉE POUR SAFARI */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/soukelhad_gate.png"
          alt="Portes du Souk El Had"
          fill
          priority // CRUCIAL : Charge l'image immédiatement sans bloquer le rendu
          quality={75} // Réduit le poids de l'image sans perte visible
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: "center 60%" }} // On garde ton positionnement exact !
        />
      </div>

      {/* 2. Dark Gradient Overlay (Garde la même opacité) */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80 z-0" />

      {/* 3. Content (Intact, on s'assure juste qu'il est au-dessus avec z-10) */}
      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 text-center pt-16">
        <Badge variant="secondary" className="mb-6 bg-primary/20 text-primary border-primary/30 hover:bg-primary/30">
          Bientôt Disponible
        </Badge>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight text-balance mb-6">
          Votre boutique à Souk El Had, visible par tout le monde.
        </h1>

        <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed text-pretty">
          Ne perdez plus de temps à gérer un site web. Connectez votre Instagram, et nous synchronisons vos produits automatiquement sur la carte officielle numérique.
        </p>

        <Button size="lg" onClick={scrollToForm} className="text-lg px-8 py-6 h-auto shadow-xl hover:scale-105 transition-transform">
          Réserver ma page (Gratuit)
        </Button>
      </div>
    </section>
  )
}