import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  metadataBase: new URL("https://clausify-six.vercel.app"),
  title: {
    default: "Clausify — Générateur de documents légaux par IA",
    template: "%s | Clausify",
  },
  description:
    "Générez vos CGV, mentions légales et politique de confidentialité conformes au droit français et au RGPD en 30 secondes. Sans avocat, propulsé par l'IA.",
  keywords: [
    "CGV",
    "mentions légales",
    "politique de confidentialité",
    "RGPD",
    "documents légaux",
    "générateur juridique",
    "conformité droit français",
  ],
  authors: [{ name: "Clausify" }],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://clausify-six.vercel.app",
    siteName: "Clausify",
    title: "Clausify — Documents légaux générés en 30 secondes",
    description:
      "CGV, mentions légales et politique de confidentialité conformes au droit français et au RGPD. Sans avocat, sans effort.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Clausify — Générateur de documents légaux par IA",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Clausify — Documents légaux générés en 30 secondes",
    description:
      "CGV, mentions légales et politique de confidentialité conformes au droit français et au RGPD.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", inter.variable)}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
