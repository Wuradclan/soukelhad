"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function Hero() {
  const scrollToForm = () => {
    document.getElementById("waitlist-form")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-no-repeat"
        style={{ 
          backgroundImage: "url('/images/soukelhad_gate.png')",
          backgroundPosition: "center 60%" 
        }}
      />
      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />

      {/* Content */}
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

        <Button size="lg" onClick={scrollToForm} className="text-lg px-8 py-6 h-auto">
          Réserver ma page (Gratuit)
        </Button>
      </div>
    </section>
  )
}
