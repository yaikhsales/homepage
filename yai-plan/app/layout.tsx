import type { Metadata } from "next";
import { Inter, Allura } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

const allura = Allura({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-allura",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Yai · Strategic DTV",
  description: "Confidential. Yai / Texlink Technologies — Strategic DTV portal.",
  robots: { index: false, follow: false },
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${allura.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
