import { Instagram } from "lucide-react"
import Link from "next/link"
import { getServerLocale } from "@/lib/locale-server"
import { getMessage } from "@/lib/translations"

export async function Footer() {
  const locale = await getServerLocale()

  return (
    <footer className="bg-secondary py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col items-center gap-4">
          <Link
            href="https://www.instagram.com/soukelhad.ma/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-secondary-foreground/80 hover:text-primary transition-colors"
          >
            <Instagram className="h-5 w-5 shrink-0" />
            <span>@soukelhad.ma</span>
          </Link>
          <a
            href="mailto:contact@soukelhad.ma"
            className="text-secondary-foreground/80 hover:text-primary transition-colors text-sm"
          >
            contact@soukelhad.ma
          </a>
          <p className="text-secondary-foreground/60 text-sm">
            {getMessage(locale, "footer.tagline")}
          </p>
        </div>
      </div>
    </footer>
  )
}
