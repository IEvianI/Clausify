import { NextRequest, NextResponse } from "next/server"
import { verifyAccessToken } from "@/lib/jwt"
import { stripe, PLANS } from "@/lib/stripe"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
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

    const { plan } = await req.json()

    if (!plan || !PLANS[plan as keyof typeof PLANS]) {
      return NextResponse.json({ error: "Plan invalide" }, { status: 400 })
    }

    const selectedPlan = PLANS[plan as keyof typeof PLANS]

    if (!selectedPlan.priceId) {
      return NextResponse.json({ error: "Plan gratuit" }, { status: 400 })
    }

    const dbUser = await db.query.users.findFirst({
      where: eq(users.id, user.userId),
    })

    if (!dbUser) {
      return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 })
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      customer_email: dbUser.email,
      line_items: [
        {
          price: selectedPlan.priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/upgrade?cancelled=true`,
      metadata: {
        userId: user.userId,
        plan,
      },
    })

    return NextResponse.json({ url: session.url }, { status: 200 })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Erreur serveur"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}