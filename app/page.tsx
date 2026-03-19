import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { InstagramFeed } from "@/components/instagram-feed"
import { WaitlistForm } from "@/components/waitlist-form"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <InstagramFeed />
      <WaitlistForm />
      <Footer />
    </main>
  )
}
