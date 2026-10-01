import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--be-vietnam-pro",
  display: "swap",
});

const karumbi = localFont({
  src: "../public/fonts/karumbi-latin.woff2",
  variable: "--karumbi",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Studio Crave — Klantportaal",
  description: "The Branding Kitchen™ — klantportaal van Studio Crave",
  icons: { icon: "/brand/sc-monogram-bordeaux.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl" className={`${beVietnamPro.variable} ${karumbi.variable}`}>
      <body>{children}</body>
    </html>
  );
}
