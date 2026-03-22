import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getMessage, LOCALE_COOKIE, localeFromCookie } from "@/lib/translations"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, local_bab, whatsapp, instagram } = body

    const store = await cookies()
    const locale = localeFromCookie(store.get(LOCALE_COOKIE)?.value)

    if (!name || !local_bab || !whatsapp) {
      return NextResponse.json(
        { error: getMessage(locale, "waitlist.apiValidation") },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    const { error } = await supabase.from("waitlist").insert({
      name,
      local_bab,
      whatsapp,
      instagram: instagram || null,
    })

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json(
        { error: getMessage(locale, "waitlist.apiInsertError") },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Server error:", error)
    const store = await cookies()
    const locale = localeFromCookie(store.get(LOCALE_COOKIE)?.value)
    return NextResponse.json(
      { error: getMessage(locale, "waitlist.apiServerError") },
      { status: 500 }
    )
  }
}
