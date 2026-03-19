"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"

export function WaitlistForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get("name") as string,
      local_bab: formData.get("local") as string,
      whatsapp: formData.get("whatsapp") as string,
      instagram: formData.get("instagram") as string,
    }

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || "Erreur lors de l'inscription")
      }

      setIsSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'inscription")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="waitlist-form" className="py-20 sm:py-28 bg-primary">
      <div className="mx-auto max-w-xl px-4 sm:px-6">
        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl sm:text-3xl font-bold">
              Prenez de l'avance
            </CardTitle>
            <CardDescription className="text-base mt-2">
              Inscrivez-vous pour être parmi les premiers marchands certifiés.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isSubmitted ? (
              <div className="text-center py-8">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <svg
                    className="h-8 w-8 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Merci pour votre inscription!</h3>
                <p className="text-muted-foreground">
                  Nous vous contacterons bientôt sur WhatsApp.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
                    {error}
                  </div>
                )}
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="name">Nom complet</FieldLabel>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Ex: Hassan Alami"
                      required
                    />
                  </Field>
                </FieldGroup>

                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="local">Numéro du Local & Porte (Bab)</FieldLabel>
                    <Input
                      id="local"
                      name="local"
                      type="text"
                      placeholder="Ex: Local 145, Bab 6"
                      required
                    />
                  </Field>
                </FieldGroup>

                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="whatsapp">Numéro WhatsApp</FieldLabel>
                    <Input
                      id="whatsapp"
                      name="whatsapp"
                      type="tel"
                      placeholder="Ex: 06 00 00 00 00"
                      required
                    />
                  </Field>
                </FieldGroup>

                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="instagram">Nom d'utilisateur Instagram</FieldLabel>
                    <Input
                      id="instagram"
                      name="instagram"
                      type="text"
                      placeholder="Ex: @MaBoutiqueAgadir"
                      required
                    />
                  </Field>
                </FieldGroup>

                <Button
                  type="submit"
                  variant="secondary"
                  className="w-full h-12 text-base font-medium"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Spinner className="mr-2" />
                      Inscription en cours...
                    </>
                  ) : (
                    "Rejoindre la liste d'attente"
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
