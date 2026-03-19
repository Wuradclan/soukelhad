import { Instagram, MapPin, MessageCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const features = [
  {
    icon: Instagram,
    title: "Synchronisation Instagram",
    description:
      "Publiez sur Instagram comme d'habitude. Vos photos apparaissent automatiquement sur votre page.",
  },
  {
    icon: MapPin,
    title: "Carte Interactive",
    description:
      "Les touristes et locaux utilisent notre plan numérique pour trouver l'emplacement exact de votre boutique.",
  },
  {
    icon: MessageCircle,
    title: "Ventes directes WhatsApp",
    description:
      "Les clients découvrent vos nouveautés et cliquent sur un bouton pour vous contacter directement sur WhatsApp.",
  },
]

export function Features() {
  return (
    <section className="py-20 sm:py-28 bg-muted/50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Comment ça marche ?
          </h2>
          <p className="text-lg text-muted-foreground">
            Zéro effort technique pour vous.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card key={index} className="border-border/50 bg-card shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
