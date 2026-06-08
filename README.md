# Clausify

**Générateur de documents légaux propulsé par l'IA**

Clausify permet aux entrepreneurs, freelances et e-commerçants de générer des documents juridiques conformes au droit français et au RGPD (CGV, mentions légales, politique de confidentialité) en quelques secondes grâce à Claude AI.

🔗 **[clausify-six.vercel.app](https://clausify-six.vercel.app)**

---

## Stack technique

| Couche | Technologies |
|--------|-------------|
| Frontend | Next.js 15, React 19, TypeScript, Tailwind CSS, Shadcn/ui |
| Backend | Next.js API Routes, Node.js |
| Base de données | Supabase (PostgreSQL) + Drizzle ORM |
| Authentification | JWT maison + refresh token rotation |
| IA | Claude API (Anthropic) — streaming |
| Paiement | Stripe (abonnements free/pro/business) |
| Tests | Jest + React Testing Library + Playwright (e2e) |
| CI/CD | GitHub Actions → Vercel |

---

## Fonctionnalités

- 🔐 **Auth JWT maison** — register, login, refresh token rotation, middleware de protection des routes
- ⚡ **Génération en streaming** — le document s'affiche en temps réel comme ChatGPT
- 📄 **3 types de documents** — CGV, mentions légales, politique de confidentialité
- 🌍 **Multilingue** — français, anglais, espagnol, allemand
- 💳 **Stripe** — plans free (filigrane), pro (9€/mois), business (19€/mois)
- 📋 **Historique** — tous les documents générés accessibles depuis le dashboard
- ✅ **Tests** — unitaires Jest sur le service JWT + e2e Playwright sur le flow d'auth complet
- 🚀 **CI/CD** — lint + tests automatiques à chaque push sur main

---

## Architecture

```
clausify/
├── src/
│   ├── app/
│   │   ├── (auth)/          # Pages login / register
│   │   ├── (dashboard)/     # Dashboard, génération, historique, upgrade
│   │   └── api/             # Routes API — auth, documents, stripe
│   ├── lib/
│   │   ├── db/              # Schéma Drizzle + client Supabase
│   │   ├── jwt.ts           # Génération et vérification des tokens
│   │   ├── auth.ts          # Service register / login / refresh
│   │   ├── claude.ts        # Intégration Claude API + streaming
│   │   └── stripe.ts        # Client Stripe + plans
│   ├── hooks/
│   │   └── useAuth.ts       # Hook auth côté client
│   └── proxy.ts             # Middleware de protection des routes
├── e2e/                     # Tests Playwright
├── src/__tests__/           # Tests Jest
└── .github/workflows/       # CI/CD GitHub Actions
```

---

## Installation locale

```bash
# Cloner le repo
git clone https://github.com/IEvianI/clausify.git
cd clausify

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env.local
# Remplir les valeurs dans .env.local

# Pousser le schéma BDD
npx drizzle-kit push

# Lancer en développement
npm run dev
```

---

## Variables d'environnement

```env
DATABASE_URL=
JWT_SECRET=
JWT_REFRESH_SECRET=
ANTHROPIC_API_KEY=
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_PRO_PRICE_ID=
STRIPE_BUSINESS_PRICE_ID=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_APP_URL=
```

---

## Tests

```bash
# Tests unitaires
npm test

# Tests e2e (nécessite npm run dev dans un autre terminal)
npm run test:e2e
```

---

## Déploiement

Le projet est déployé automatiquement sur **Vercel** à chaque push sur `main` via GitHub Actions, après passage du lint et des tests unitaires.

---

## Modèle de pricing

| Plan | Prix | Documents | Filigrane |
|------|------|-----------|-----------|
| Free | 0€ | 1 | Oui |
| Pro | 9€/mois | Illimités | Non |
| Business | 19€/mois | Illimités | Non |

---

## Auteur

**Evan Allain** — [portfolio-evan-allain.vercel.app](https://portfolio-evan-allain.vercel.app) — [allainevan1@gmail.com](mailto:allainevan1@gmail.com)