import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* NAV */}
      <nav className="border-b border-slate-100 px-6 py-4 flex justify-between items-center max-w-6xl mx-auto">
        <span className="font-bold text-xl text-blue-600">Clausify</span>
        <div className="flex gap-3">
          <Button variant="ghost" asChild>
            <Link href="/login">Se connecter</Link>
          </Button>
          <Button asChild className="hidden sm:inline-flex">
            <Link href="/register">Commencer gratuitement</Link>
          </Button>
        </div>
      </nav>

      {/* HERO */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <div className="inline-block bg-blue-50 text-blue-600 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          ✨ Propulsé par Claude AI
        </div>
        <h1 className="text-5xl font-bold text-slate-900 leading-tight mb-6">
          Vos documents légaux<br />
          <span className="text-blue-600">générés en 30 secondes</span>
        </h1>
        <p className="text-xl text-slate-500 mb-10 max-w-2xl mx-auto">
          CGV, mentions légales, politique de confidentialité — conformes au droit français et au RGPD. Sans avocat, sans effort.
        </p>
        <div className="flex gap-4 justify-center flex-wrap px-4">
          <Button size="lg" asChild>
            <Link href="/register">Générer mon premier document</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/login">Se connecter</Link>
          </Button>
        </div>
        <p className="text-sm text-slate-400 mt-4">1 document gratuit — sans carte bancaire</p>
      </section>

      {/* FEATURES */}
      <section className="bg-slate-50 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-4">
            Tout ce dont vous avez besoin
          </h2>
          <p className="text-center text-slate-500 mb-12">
            Des documents professionnels adaptés à votre activité
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: "📄",
                title: "CGV",
                desc: "Conditions Générales de Vente conformes au droit français pour votre e-commerce ou services."
              },
              {
                icon: "⚖️",
                title: "Mentions légales",
                desc: "Obligatoires pour tout site web. Générées en quelques secondes avec toutes les informations requises."
              },
              {
                icon: "🔒",
                title: "Politique de confidentialité",
                desc: "Conforme au RGPD. Protégez vos utilisateurs et évitez les sanctions."
              },
            ].map((f) => (
              <div key={f.title} className="bg-white rounded-xl p-6 border border-slate-200">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-bold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 px-6 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
          Comment ça marche ?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { step: "01", title: "Décrivez votre activité", desc: "Nom, secteur, email — 2 minutes de configuration." },
            { step: "02", title: "L'IA génère votre document", desc: "Claude AI rédige un document juridique complet et personnalisé." },
            { step: "03", title: "Téléchargez et utilisez", desc: "Export PDF prêt à publier sur votre site." },
          ].map((s) => (
            <div key={s.step} className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm mx-auto mb-4">
                {s.step}
              </div>
              <h3 className="font-bold text-slate-900 mb-2">{s.title}</h3>
              <p className="text-slate-500 text-sm">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section className="bg-slate-50 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Tarifs simples</h2>
          <p className="text-slate-500 mb-12">Commencez gratuitement, passez au Pro quand vous en avez besoin</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Free",
                price: "0€",
                desc: "Pour essayer",
                features: ["1 document", "Filigrane", "Export PDF"],
                cta: "Commencer",
                href: "/register",
                highlighted: false,
              },
              {
                name: "Pro",
                price: "9€/mois",
                desc: "Pour les indépendants",
                features: ["Documents illimités", "Sans filigrane", "Export PDF + Word"],
                cta: "Démarrer le Pro",
                href: "/register",
                highlighted: true,
              },
              {
                name: "Business",
                price: "19€/mois",
                desc: "Pour les équipes",
                features: ["Tout le Pro", "Plusieurs entreprises", "Support prioritaire"],
                cta: "Démarrer Business",
                href: "/register",
                highlighted: false,
              },
            ].map((p) => (
              <div
                key={p.name}
                className={`bg-white rounded-xl p-6 border ${p.highlighted ? "border-blue-500 border-2" : "border-slate-200"}`}
              >
                {p.highlighted && (
                  <div className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-3">
                    Populaire
                  </div>
                )}
                <div className="font-bold text-slate-900 mb-1">{p.name}</div>
                <div className="text-2xl font-bold text-slate-900 mb-1">{p.price}</div>
                <div className="text-slate-500 text-sm mb-4">{p.desc}</div>
                <ul className="text-sm text-slate-600 mb-6 space-y-2">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <span className="text-blue-500">✓</span>{f}
                    </li>
                  ))}
                </ul>
                <Button className="w-full" variant={p.highlighted ? "default" : "outline"} asChild>
                  <Link href={p.href}>{p.cta}</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center">
        <h2 className="text-4xl font-bold text-slate-900 mb-4">
          Prêt à générer vos documents ?
        </h2>
        <p className="text-slate-500 mb-8">Rejoignez des centaines d&apos;entrepreneurs qui font confiance à Clausify</p>
        <Button size="lg" asChild>
          <Link href="/register">Commencer gratuitement →</Link>
        </Button>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-100 py-8 px-6 text-center text-slate-400 text-sm">
        <p>© 2026 Clausify — Générateur de documents légaux propulsé par l&apos;IA</p>
      </footer>

    </div>
  )
}