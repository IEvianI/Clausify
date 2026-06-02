"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Document {
  id: string
  type: string
  language: string
  hasWatermark: boolean
  createdAt: string
}

const documentLabels: Record<string, string> = {
  CGV: "Conditions Générales de Vente",
  MENTIONS_LEGALES: "Mentions Légales",
  POLITIQUE_CONFIDENTIALITE: "Politique de Confidentialité",
  CGVU: "CGV et Conditions d'Utilisation",
}

const languageLabels: Record<string, string> = {
  fr: "Français",
  en: "Anglais",
  es: "Espagnol",
  de: "Allemand",
}

export default function DocumentsPage() {
  const router = useRouter()
  const [docs, setDocs] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDocuments() {
      try {
        const res = await fetch("/api/documents", {
          credentials: "include",
        })
        const data = await res.json()
        if (res.ok) setDocs(data.documents)
      } finally {
        setLoading(false)
      }
    }
    fetchDocuments()
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <p className="text-slate-500">Chargement...</p>
    </div>
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Mes documents</h1>
          <p className="text-slate-500 mt-1">{docs.length} document{docs.length > 1 ? "s" : ""} généré{docs.length > 1 ? "s" : ""}</p>
        </div>
        <Button onClick={() => router.push("/dashboard")}>
          + Nouveau document
        </Button>
      </div>

      {docs.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 gap-4">
            <p className="text-slate-500">Aucun document généré pour l&apos;instant</p>
            <Button onClick={() => router.push("/dashboard")}>
              Générer mon premier document
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {docs.map((doc) => (
            <Card
              key={doc.id}
              className="hover:border-blue-300 transition cursor-pointer"
              onClick={() => router.push(`/dashboard/documents/${doc.id}`)}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-base">
                    {documentLabels[doc.type] || doc.type}
                  </CardTitle>
                  <div className="flex gap-2 items-center">
                    {doc.hasWatermark && (
                      <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-medium">
                        Free
                      </span>
                    )}
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                      {languageLabels[doc.language] || doc.language}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-500">
                  Généré le {new Date(doc.createdAt).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}