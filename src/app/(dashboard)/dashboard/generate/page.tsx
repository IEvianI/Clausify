"use client"

import { useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ReactMarkdown from "react-markdown"

const documentLabels: Record<string, string> = {
  CGV: "Conditions Générales de Vente",
  MENTIONS_LEGALES: "Mentions Légales",
  POLITIQUE_CONFIDENTIALITE: "Politique de Confidentialité",
  CGVU: "CGV et Conditions d'Utilisation",
}

export default function GeneratePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const type = searchParams.get("type") || "CGV"

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [streamedContent, setStreamedContent] = useState<string>("")
  const [form, setForm] = useState({
    name: "",
    sector: "",
    activity: "",
    email: "",
    country: "France",
    language: "fr",
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setStreamedContent("")

    try {
      const res = await fetch("/api/documents/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ type, company: form }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error)
      }

      const reader = res.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) throw new Error("Pas de stream disponible")

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value)
        setStreamedContent((prev) => prev + chunk)
      }

      router.push("/dashboard/documents")
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur inconnue")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Générer : {documentLabels[type]}
        </h1>
        <p className="text-slate-500 mt-1">
          Renseignez les informations de votre entreprise
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Informations entreprise</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Nom de l&apos;entreprise</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Mon Entreprise SAS"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="sector">Secteur d&apos;activité</Label>
                <Input
                  id="sector"
                  name="sector"
                  placeholder="E-commerce, SaaS, Conseil..."
                  value={form.sector}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="activity">Description de l&apos;activité</Label>
                <Input
                  id="activity"
                  name="activity"
                  placeholder="Vente de produits en ligne..."
                  value={form.activity}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email de contact</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="contact@monentreprise.fr"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="country">Pays</Label>
                <Input
                  id="country"
                  name="country"
                  placeholder="France"
                  value={form.country}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="language">Langue du document</Label>
                <select
                  id="language"
                  name="language"
                  value={form.language}
                  onChange={handleChange}
                  className="border border-slate-200 rounded-md px-3 py-2 text-sm"
                >
                  <option value="fr">Français</option>
                  <option value="en">Anglais</option>
                  <option value="es">Espagnol</option>
                  <option value="de">Allemand</option>
                </select>
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Génération en cours..." : "Générer le document"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {streamedContent && (
          <div className="bg-white border border-slate-200 rounded-lg p-6 overflow-auto max-h-[600px] relative">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <p className="text-slate-100 text-4xl font-bold rotate-[-35deg] select-none">
                CLAUSIFY FREE
              </p>
            </div>
            <div className="prose prose-slate max-w-none text-sm">
              <ReactMarkdown>{streamedContent}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}