"use client"

import { Button } from "@/components/ui/button"

export function Navbar() {
  const scrollToForm = () => {
    document.getElementById("waitlist-form")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          <span className="text-xl font-bold text-primary">
            SoukElHad.ma <span className="text-foreground/60 text-base font-normal">/ سوق الأحد</span>
          </span>
          <Button onClick={scrollToForm} size="sm">
            S'inscrire
          </Button>
        </div>
      </div>
    </nav>
  )
}
