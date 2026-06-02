import { NextRequest, NextResponse } from "next/server"
import { verifyAccessToken } from "@/lib/jwt"

const protectedRoutes = ["/dashboard"]
const authRoutes = ["/login", "/register"]

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const accessToken = req.headers.get("authorization")?.split(" ")[1]
    ?? req.cookies.get("access_token")?.value

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  )
  const isAuthRoute = authRoutes.some((route) =>
    pathname.startsWith(route)
  )

  const user = accessToken ? verifyAccessToken(accessToken) : null

  if (isProtected && !user) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}