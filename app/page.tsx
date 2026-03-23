import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { InstagramFeed } from "@/components/instagram-feed" // Ton flux dynamique
import { Footer } from "@/components/footer"

// Ajoute ceci pour que la page (surtout le flux Insta) soit rapide et mise en cache !
export const revalidate = 3600; 

export default function Home() {
  return (
    <main className="min-h-screen bg-[#1A1A1A]">
      {/* Navbar avec position absolue pour passer au dessus de l'image */}
      <div className="absolute top-0 w-full z-50">
        <Navbar />
      </div>
      
      <Hero />
      <Features />
      <InstagramFeed />
      <Footer />
    </main>
  )
}