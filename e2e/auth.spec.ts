import { test, expect } from "@playwright/test"

// Un email unique PAR test → zéro collision, même avec fullyParallel
const uniqueEmail = () =>
  `test_${Date.now()}_${Math.random().toString(36).slice(2, 8)}@clausify.fr`
const testPassword = "TestPassword123!"

test.describe("Authentification", () => {
  test("devrait créer un compte et accéder au dashboard", async ({ page }) => {
    const email = uniqueEmail()

    await page.goto("/register")
    await page.fill('input[type="email"]', email)
    await page.fill('input[type="password"]', testPassword)
    await page.click('button[type="submit"]')

    await page.waitForURL("**/dashboard")
    await expect(page.locator("h1")).toContainText("Bonjour")
  })

  test("devrait se connecter avec un compte existant", async ({ page }) => {
    const email = uniqueEmail()

    // Chaque test crée son propre compte
    await page.goto("/register")
    await page.fill('input[type="email"]', email)
    await page.fill('input[type="password"]', testPassword)
    await page.click('button[type="submit"]')
    await page.waitForURL("**/dashboard")

    // Déconnexion
    // ⚠️ Si "Déconnexion" est dans un menu déroulant (clic avatar puis menu),
    //    il faut d'abord ouvrir le menu avant ce clic, sinon l'élément est caché.
    await page.click("text=Déconnexion")
    await page.waitForURL("**/login")

    // Reconnexion
    await page.fill('input[type="email"]', email)
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

  test("devrait afficher une erreur avec un mauvais mot de passe", async ({ page }) => {
    const email = uniqueEmail()

    // On crée un VRAI compte pour tester le vrai cas "mauvais mot de passe"
    await page.goto("/register")
    await page.fill('input[type="email"]', email)
    await page.fill('input[type="password"]', testPassword)
    await page.click('button[type="submit"]')
    await page.waitForURL("**/dashboard")

    // On repart déconnecté sans dépendre du bouton logout
    await page.context().clearCookies()

    await page.goto("/login")
    await page.fill('input[type="email"]', email)
    await page.fill('input[type="password"]', "mauvais_mdp")
    await page.click('button[type="submit"]')

    // ⚠️ Sélecteur fragile (lié à une classe Tailwind, casse si tu changes le style).
    //    Plus robuste : mets role="alert" sur ton bloc d'erreur → page.getByRole("alert")
    await expect(page.locator("p.text-red-500")).toBeVisible()
  })
})