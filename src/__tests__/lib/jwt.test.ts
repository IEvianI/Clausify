import {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "@/lib/jwt"

describe("JWT Service", () => {
  const userId = "test-user-id-123"

  describe("generateAccessToken", () => {
    it("devrait générer un token valide", () => {
      const token = generateAccessToken(userId)
      expect(token).toBeDefined()
      expect(typeof token).toBe("string")
      expect(token.split(".")).toHaveLength(3)
    })
  })

  describe("generateRefreshToken", () => {
    it("devrait générer un refresh token valide", () => {
      const token = generateRefreshToken(userId)
      expect(token).toBeDefined()
      expect(typeof token).toBe("string")
      expect(token.split(".")).toHaveLength(3)
    })
  })

  describe("verifyAccessToken", () => {
    it("devrait vérifier un token valide", () => {
      const token = generateAccessToken(userId)
      const payload = verifyAccessToken(token)
      expect(payload).not.toBeNull()
      expect(payload?.userId).toBe(userId)
    })

    it("devrait retourner null pour un token invalide", () => {
      const payload = verifyAccessToken("token.invalide.ici")
      expect(payload).toBeNull()
    })

    it("devrait retourner null pour un token vide", () => {
      const payload = verifyAccessToken("")
      expect(payload).toBeNull()
    })
  })

  describe("verifyRefreshToken", () => {
    it("devrait vérifier un refresh token valide", () => {
      const token = generateRefreshToken(userId)
      const payload = verifyRefreshToken(token)
      expect(payload).not.toBeNull()
      expect(payload?.userId).toBe(userId)
    })

    it("devrait retourner null pour un refresh token invalide", () => {
      const payload = verifyRefreshToken("token.invalide.ici")
      expect(payload).toBeNull()
    })
  })
})