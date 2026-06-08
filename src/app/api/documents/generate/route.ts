import { NextRequest, NextResponse } from "next/server"
import { verifyAccessToken } from "@/lib/jwt"
import { generateDocumentStream } from "@/lib/claude"
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
        .values({ userId: user.userId, ...company })
        .returning()
      existingCompany = newCompany
    }

    const existingDocCount = await db
  .select()
  .from(documents)
  .where(eq(documents.userId, user.userId))
  .then(rows => rows.length)

    // Générer le stream
    const stream = await generateDocumentStream(type, {
      ...company,
      language: company.language || "fr",
    })

    // Collecter le contenu complet pour sauvegarder en BDD
    const [streamForDB, streamForClient] = stream.tee()

    // Sauvegarder en BDD en arrière-plan
    ;(async () => {
      const reader = streamForDB.getReader()
      const decoder = new TextDecoder()
      let fullContent = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        fullContent += decoder.decode(value)
      }

      await db.insert(documents).values({
        userId: user.userId,
        companyId: existingCompany!.id,
        type,
        language: company.language || "fr",
        content: fullContent,
        hasWatermark: existingDocCount > 0,
      })
    })()

    return new Response(streamForClient, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
        "X-Company-Id": existingCompany.id,
      },
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Erreur serveur"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}