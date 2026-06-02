import Anthropic from "@anthropic-ai/sdk"

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

type DocumentType =
  | "CGV"
  | "MENTIONS_LEGALES"
  | "POLITIQUE_CONFIDENTIALITE"
  | "CGVU"

interface CompanyInfo {
  name: string
  sector: string
  activity: string
  email: string
  country: string
  language: string
}

function getPrompt(type: DocumentType, company: CompanyInfo): string {
  const typeLabels = {
    CGV: "Conditions Générales de Vente",
    MENTIONS_LEGALES: "Mentions Légales",
    POLITIQUE_CONFIDENTIALITE: "Politique de Confidentialité",
    CGVU: "Conditions Générales de Vente et d'Utilisation",
  }

  return `Tu es un expert juridique spécialisé en droit français et européen.
  
Génère un document de type "${typeLabels[type]}" complet et professionnel pour l'entreprise suivante :

- Nom : ${company.name}
- Secteur : ${company.sector}
- Activité : ${company.activity}
- Email de contact : ${company.email}
- Pays : ${company.country}

Exigences :
- Document rédigé en ${company.language === "fr" ? "français" : company.language}
- Conforme au droit français et au RGPD
- Structuré avec des titres et sous-titres clairs
- Complet et utilisable directement
- Format Markdown

Génère uniquement le document, sans introduction ni commentaire.`
}

export async function generateDocumentStream(
  type: DocumentType,
  company: CompanyInfo
): Promise<ReadableStream> {
  const stream = await client.messages.stream({
    model: "claude-sonnet-4-5",
    max_tokens: 4000,
    messages: [
      {
        role: "user",
        content: getPrompt(type, company),
      },
    ],
  })

  return new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        if (
          chunk.type === "content_block_delta" &&
          chunk.delta.type === "text_delta"
        ) {
          controller.enqueue(new TextEncoder().encode(chunk.delta.text))
        }
      }
      controller.close()
    },
  })
}

export async function generateDocument(
  type: DocumentType,
  company: CompanyInfo
): Promise<string> {
  const message = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 4000,
    messages: [
      {
        role: "user",
        content: getPrompt(type, company),
      },
    ],
  })

  const content = message.content[0]
  if (content.type !== "text") {
    throw new Error("Réponse inattendue de Claude")
  }

  return content.text
}