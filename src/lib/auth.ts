import bcrypt from "bcryptjs"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { generateAccessToken, generateRefreshToken } from "@/lib/jwt"

export async function registerUser(email: string, password: string) {
  const existing = await db.query.users.findFirst({
    where: eq(users.email, email),
  })

  if (existing) {
    throw new Error("Email déjà utilisé")
  }

  const passwordHash = await bcrypt.hash(password, 12)

  const [user] = await db
    .insert(users)
    .values({ email, passwordHash })
    .returning()

  const accessToken = generateAccessToken(user.id)
  const refreshToken = generateRefreshToken(user.id)

  await db
    .update(users)
    .set({ refreshToken })
    .where(eq(users.id, user.id))

  return { accessToken, refreshToken, user: { id: user.id, email: user.email, plan: user.plan } }
}

export async function loginUser(email: string, password: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  })

  if (!user) {
    throw new Error("Email ou mot de passe incorrect")
  }

  const valid = await bcrypt.compare(password, user.passwordHash)

  if (!valid) {
    throw new Error("Email ou mot de passe incorrect")
  }

  const accessToken = generateAccessToken(user.id)
  const refreshToken = generateRefreshToken(user.id)

  await db
    .update(users)
    .set({ refreshToken })
    .where(eq(users.id, user.id))

  return { accessToken, refreshToken, user: { id: user.id, email: user.email, plan: user.plan } }
}

export async function refreshUserToken(token: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.refreshToken, token),
  })

  if (!user) {
    throw new Error("Token invalide")
  }

  const accessToken = generateAccessToken(user.id)
  const refreshToken = generateRefreshToken(user.id)

  await db
    .update(users)
    .set({ refreshToken })
    .where(eq(users.id, user.id))

  return { accessToken, refreshToken }
}