"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import { useTranslation } from "@/components/LanguageProvider"

export function WaitlistForm() {
  const { t } = useTranslation()
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
        throw new Error(result.error || t("waitlist.errorSubmit"))
      }

      setIsSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : t("waitlist.errorSubmit"))
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
              {t("waitlist.title")}
            </CardTitle>
            <CardDescription className="text-base mt-2">
              {t("waitlist.description")}
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
                <h3 className="text-xl font-semibold mb-2">{t("waitlist.thankYou")}</h3>
                <p className="text-muted-foreground">
                  {t("waitlist.followUp")}
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
                    <FieldLabel htmlFor="name">{t("waitlist.nameLabel")}</FieldLabel>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder={t("waitlist.namePlaceholder")}
                      required
                    />
                  </Field>
                </FieldGroup>

                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="local">{t("waitlist.localLabel")}</FieldLabel>
                    <Input
                      id="local"
                      name="local"
                      type="text"
                      placeholder={t("waitlist.localPlaceholder")}
                      required
                    />
                  </Field>
                </FieldGroup>

                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="whatsapp">{t("waitlist.whatsappLabel")}</FieldLabel>
                    <Input
                      id="whatsapp"
                      name="whatsapp"
                      type="tel"
                      placeholder={t("waitlist.whatsappPlaceholder")}
                      required
                    />
                  </Field>
                </FieldGroup>

                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="instagram">{t("waitlist.instagramLabel")}</FieldLabel>
                    <Input
                      id="instagram"
                      name="instagram"
                      type="text"
                      placeholder={t("waitlist.instagramPlaceholder")}
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
                      <Spinner className="me-2" />
                      {t("waitlist.submitting")}
                    </>
                  ) : (
                    t("waitlist.submit")
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
