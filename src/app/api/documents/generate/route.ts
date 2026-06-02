import { NextRequest, NextResponse } from "next/server"
import { verifyAccessToken } from "@/lib/jwt"
import { generateDocument } from "@/lib/claude"
import { db } from "@/lib/db"
import { documents, companies } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export async function POST(req: NextRequest) {
  try {
    const accessToken = req.cookies.get("access_token")?.value
    if (!accessToken) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const user = verifyAccessToken(accessToken)
    if (!user) {
      return NextResponse.json({ error: "Token invalide" }, { status: 401 })
    }

    const { type, company } = await req.json()

    if (!type || !company) {
      return NextResponse.json(
        { error: "Type et informations entreprise requis" },
        { status: 400 }
      )
    }

    // Créer ou récupérer l'entreprise
    let existingCompany = await db.query.companies.findFirst({
      where: eq(companies.userId, user.userId),
    })

    if (!existingCompany) {
      const [newCompany] = await db
        .insert(companies)
        .values({
          userId: user.userId,
          ...company,
        })
        .returning()
      existingCompany = newCompany
    }

    // Générer le document avec Claude
    const content = await generateDocument(type, {
      ...company,
      language: company.language || "fr",
    })

    // Sauvegarder en BDD
    const [document] = await db
      .insert(documents)
      .values({
        userId: user.userId,
        companyId: existingCompany.id,
        type,
        language: company.language || "fr",
        content,
        hasWatermark: true,
      })
      .returning()

    return NextResponse.json({ document }, { status: 201 })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Erreur serveur"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}