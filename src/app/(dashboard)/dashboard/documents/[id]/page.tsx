"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import ReactMarkdown from "react-markdown"

interface Document {
  id: string
  type: string
  content: string
  hasWatermark: boolean
  createdAt: string
}

export default function DocumentPage() {
  const { id } = useParams()
  const router = useRouter()
  const [document, setDocument] = useState<Document | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchDocument() {
      try {
        const res = await fetch(`/api/documents/${id}`)
        const data = await res.json()
        if (!res.ok) throw new Error(data.error)
        setDocument(data.document)
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Erreur inconnue")
      } finally {
        setLoading(false)
      }
    }
    fetchDocument()
  }, [id])

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <p className="text-slate-500">Chargement...</p>
    </div>
  )

  if (error) return (
    <div className="flex items-center justify-center h-64">
      <p className="text-red-500">{error}</p>
    </div>
  )

  if (!document) return null

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <Button variant="outline" onClick={() => router.push("/dashboard")}>
          ← Retour
        </Button>
        <Button onClick={() => window.print()}>
          Télécharger PDF
        </Button>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-8 relative">
        {document.hasWatermark && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="text-slate-200 text-6xl font-bold rotate-[-35deg] select-none">
              CLAUSIFY FREE
            </p>
          </div>
        )}
        <div className="prose prose-slate max-w-none">
          <ReactMarkdown>{document.content}</ReactMarkdown>
        </div>
      </div>
    </div>
  )
}