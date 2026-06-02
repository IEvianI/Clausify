import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { db } from "@/lib/db"
import { users, documents } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get("stripe-signature")!

  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Erreur webhook"
    return NextResponse.json({ error: message }, { status: 400 })
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object
      const userId = session.metadata?.userId
      const plan = session.metadata?.plan as "PRO" | "BUSINESS"

      if (userId && plan) {
        await db
          .update(users)
          .set({ plan })
          .where(eq(users.id, userId))

        // Supprimer le filigrane sur tous les documents existants
        await db
          .update(documents)
          .set({ hasWatermark: false })
          .where(eq(documents.userId, userId))
      }
      break
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object
      const customer = await stripe.customers.retrieve(
        subscription.customer as string
      )

      if ("email" in customer && customer.email) {
        const user = await db.query.users.findFirst({
          where: eq(users.email, customer.email),
        })

        if (user) {
          await db
            .update(users)
            .set({ plan: "FREE" })
            .where(eq(users.id, user.id))
        }
      }
      break
    }
  }

  return NextResponse.json({ received: true }, { status: 200 })
}