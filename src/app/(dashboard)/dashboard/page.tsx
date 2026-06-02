"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Bonjour 👋</h1>
        <p className="text-slate-500 mt-1">
          Générez vos documents légaux en quelques secondes.
        </p>
        <div className="mt-4 flex gap-3">
          <Button asChild variant="outline">
            <Link href="/dashboard/documents">Mes documents</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/dashboard/upgrade">Upgrader mon plan</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover:border-blue-300 transition cursor-pointer">
          <CardHeader>
            <CardTitle className="text-lg">CGV</CardTitle>
            <CardDescription>
              Conditions Générales de Vente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" asChild>
              <Link href="/dashboard/generate?type=CGV">Générer</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:border-blue-300 transition cursor-pointer">
          <CardHeader>
            <CardTitle className="text-lg">Mentions légales</CardTitle>
            <CardDescription>
              Obligatoires pour tout site web
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" asChild>
              <Link href="/dashboard/generate?type=MENTIONS_LEGALES">Générer</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:border-blue-300 transition cursor-pointer">
          <CardHeader>
            <CardTitle className="text-lg">Politique de confidentialité</CardTitle>
            <CardDescription>
              Conformité RGPD
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" asChild>
              <Link href="/dashboard/generate?type=POLITIQUE_CONFIDENTIALITE">Générer</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}