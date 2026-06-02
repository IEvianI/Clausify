import { test, expect } from "@playwright/test"

const testEmail = `test_${Date.now()}@clausify.fr`
const testPassword = "TestPassword123!"

test.describe("Authentification", () => {
  test("devrait créer un compte et accéder au dashboard", async ({ page }) => {
    await page.goto("/register")

    await page.fill('input[type="email"]', testEmail)
    await page.fill('input[type="password"]', testPassword)
    await page.click('button[type="submit"]')

    await page.waitForURL("**/dashboard")
    await expect(page.locator("h1")).toContainText("Bonjour")
  })

  test("devrait se connecter avec un compte existant", async ({ page }) => {
    // Register d'abord
    await page.goto("/register")
    await page.fill('input[type="email"]', testEmail)
    await page.fill('input[type="password"]', testPassword)
    await page.click('button[type="submit"]')
    await page.waitForURL("**/dashboard")

    // Déconnexion
    await page.click("text=Déconnexion")
    await page.waitForURL("**/login")

    // Login
    await page.fill('input[type="email"]', testEmail)
    await page.fill('input[type="password"]', testPassword)
    await page.click('button[type="submit"]')

    await page.waitForURL("**/dashboard")
    await expect(page.locator("h1")).toContainText("Bonjour")
  })

  test("devrait rediriger vers login si non connecté", async ({ page }) => {
    await page.goto("/dashboard")
    await page.waitForURL("**/login")
    await expect(page).toHaveURL(/login/)
  })

  test("devrait afficher une erreur avec mauvais mot de passe", async ({ page }) => {
    await page.goto("/login")
    await page.fill('input[type="email"]', testEmail)
    await page.fill('input[type="password"]', "mauvais_mdp")
    await page.click('button[type="submit"]')

    await expect(page.locator("p.text-red-500")).toBeVisible()
  })
})