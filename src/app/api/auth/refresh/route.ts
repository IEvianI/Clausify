import { NextRequest, NextResponse } from "next/server"
import { refreshUserToken } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("refresh_token")?.value

    if (!token) {
      return NextResponse.json(
        { error: "Token manquant" },
        { status: 401 }
      )
    }

    const data = await refreshUserToken(token)

    const response = NextResponse.json(
      { accessToken: data.accessToken },
      { status: 200 }
    )

    response.cookies.set("refresh_token", data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    })

    return response
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Erreur serveur"
    return NextResponse.json({ error: message }, { status: 401 })
  }
}