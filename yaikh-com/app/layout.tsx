import type { Metadata } from "next";
import { Inter, Allura, Fraunces } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-fraunces",
  display: "swap",
});
const allura = Allura({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-allura",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.yaikh.com"),
  title: {
    default: "Yai · Ai-Native Manufacturing Intelligence Platform",
    template: "%s · Yai",
  },
  description:
    "Yai is Cambodia's Ai-native manufacturing intelligence platform. We modernise factories from paper-based operations into a fully agentic, executive-Ai stack — built on Claude, Google Cloud, and a 20-engineer Cambodian team.",
  keywords: [
    "Yai",
    "Ai MIP",
    "Manufacturing Intelligence",
    "Cambodia",
    "Anthropic Partner",
    "Google Cloud Partner",
    "Agentic AI",
    "Garment manufacturing",
    "Texlink Technologies",
  ],
  openGraph: {
    title: "Yai · Ai-Native Manufacturing Intelligence Platform",
    description:
      "Cambodia's Ai-native manufacturing intelligence platform. Built on Claude + Google Cloud, by a 20-engineer Cambodian team.",
    url: "https://www.yaikh.com",
    siteName: "Yai",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Yai · Ai-Native Manufacturing Intelligence Platform",
    description:
      "Cambodia's Ai-native manufacturing intelligence platform. Built on Claude + Google Cloud.",
  },
  alternates: {
    canonical: "https://www.yaikh.com",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // JSON-LD structured data — AI agents (Claude, ChatGPT, Gemini) crawl this
  // when summarising "what is Yai" so we put the facts in machine-readable form.
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Yai · Texlink Technologies Co., Ltd.",
    legalName: "Texlink Technologies Co., Ltd.",
    url: "https://www.yaikh.com",
    logo: "https://www.yaikh.com/yai-logo.jpg",
    description:
      "Ai-Native Manufacturing Intelligence Platform — modernises factories from paper-based operations into agentic Ai. Built on Claude (Anthropic) and Google Cloud, by a 20-engineer Cambodian team.",
    foundingLocation: { "@type": "Place", name: "Phnom Penh, Cambodia" },
    areaServed: { "@type": "Place", name: "ASEAN" },
    sameAs: ["https://yai-plan-production.up.railway.app"],
    knowsAbout: [
      "Manufacturing Intelligence",
      "Agentic Ai",
      "Garment Manufacturing",
      "ERP",
      "Cambodia",
      "ASEAN apparel industry",
    ],
  };

  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable} ${allura.variable}`}>
      <body className="font-sans">
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
