"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const plans = [
  {
    id: "FREE",
    name: "Free",
    price: 0,
    description: "Pour essayer Clausify",
    features: [
      "1 document par mois",
      "Filigrane sur les documents",
      "Export PDF",
    ],
    cta: "Plan actuel",
    disabled: true,
  },
  {
    id: "PRO",
    name: "Pro",
    price: 9,
    description: "Pour les indépendants",
    features: [
      "Documents illimités",
      "Sans filigrane",
      "Export PDF + Word",
      "Historique complet",
    ],
    cta: "Passer au Pro",
    disabled: false,
    highlighted: true,
  },
  {
    id: "BUSINESS",
    name: "Business",
    price: 19,
    description: "Pour les équipes",
    features: [
      "Tout le plan Pro",
      "Plusieurs entreprises",
      "Templates personnalisés",
      "Support prioritaire",
    ],
    cta: "Passer au Business",
    disabled: false,
  },
]

export default function UpgradePage() {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  async function handleUpgrade(planId: string) {
    setLoading(planId)
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ plan: planId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      router.push(data.url)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-slate-900">
          Choisissez votre plan
        </h1>
        <p className="text-slate-500 mt-2">
          Générez des documents légaux professionnels sans limite
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={`relative overflow-visible ${plan.highlighted ? "border-blue-500 border-2" : ""}`}
          >
            {plan.highlighted && (
  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
    <span className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
      Populaire
    </span>
  </div>
)}
            <CardHeader>
              <CardTitle className="text-lg">{plan.name}</CardTitle>
              <div className="mt-2">
                <span className="text-3xl font-bold">{plan.price}€</span>
                {plan.price > 0 && (
                  <span className="text-slate-500 text-sm">/mois</span>
                )}
              </div>
              <p className="text-slate-500 text-sm">{plan.description}</p>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <ul className="flex flex-col gap-2">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2 text-sm text-slate-600"
                  >
                    <span className="text-blue-500">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                className="w-full"
                disabled={plan.disabled || loading === plan.id}
                variant={plan.highlighted ? "default" : "outline"}
                onClick={() => !plan.disabled && handleUpgrade(plan.id)}
              >
                {loading === plan.id ? "Redirection..." : plan.cta}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center mt-8">
        <Button variant="ghost" onClick={() => router.push("/dashboard")}>
          ← Retour au dashboard
        </Button>
      </div>
    </div>
  )
}