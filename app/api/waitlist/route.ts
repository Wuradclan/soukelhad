import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, local_bab, whatsapp, instagram } = body

    // Validate required fields
    if (!name || !local_bab || !whatsapp) {
      return NextResponse.json(
        { error: "Nom, Local/Bab et WhatsApp sont requis" },
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
        { error: "Erreur lors de l'inscription" },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    )
  }
}
