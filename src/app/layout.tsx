// Layout raíz: fuentes, metadata (SEO y Open Graph), scripts de arranque (intro e idioma) y componentes globales.

import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { site } from "@/data/profile";
import { MotionProvider } from "@/components/effects/MotionProvider";
import { RevealObserver } from "@/components/effects/RevealObserver";
import { INTRO_BOOT } from "@/components/intro/introState";
import { LANG_BOOT } from "@/i18n/boot";
import { LangSync } from "@/i18n/LangSync";
import "./globals.css";
import { T } from "@/i18n/Translate";

// Fuentes locales (sin peticiones a Google Fonts); cada una expone una variable CSS.
const display = localFont({
  src: "./fonts/space-grotesk-latin-wght-normal.woff2",
  variable: "--font-space",
  weight: "300 700",
  display: "swap",
});

const body = localFont({
  src: "./fonts/inter-latin-wght-normal.woff2",
  variable: "--font-inter",
  weight: "100 900",
  display: "swap",
});

const code = localFont({
  src: "./fonts/jetbrains-mono-latin-wght-normal.woff2",
  variable: "--font-jetbrains",
  weight: "100 800",
  display: "swap",
});

// editorial italic for the hero name only; the rest of the site keeps its type
const editorial = localFont({
  src: "./fonts/instrument-serif-latin-400-italic.woff2",
  variable: "--font-editorial",
  weight: "400",
  style: "italic",
  display: "swap",
});

// Metadata del sitio: título, descripción y Open Graph (la imagen está en src/app/opengraph-image.jpg;
// el favicon es src/app/icon.svg, que Next.js enlaza solo).
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: `%s — ${site.name}`,
  },
  applicationName: site.name,
  description: site.description,
  authors: [{ name: site.author }],
  creator: site.author,
  keywords: [
    "Walter Santos",
    "portfolio",
    "systems engineering",
    "software development",
    "machine learning",
    "artificial intelligence",
    "data analysis",
    "El Salvador",
  ],
  openGraph: {
    type: "website",
    title: site.headline,
    description: site.description,
    url: "/",
    siteName: site.name,
    locale: "en_US",
    alternateLocale: ["es_ES"],
  },
  twitter: {
    card: "summary_large_image",
    title: site.headline,
    description: site.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#080B10",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${display.variable} ${body.variable} ${code.variable} ${editorial.variable} antialiased`}
    >
      <head>
        {/* Antes del primer pintado: decide si se reproduce la intro y aplica el idioma guardado */}
        <script dangerouslySetInnerHTML={{ __html: INTRO_BOOT }} />
        {/* applies the stored language before first paint */}
        <script dangerouslySetInnerHTML={{ __html: LANG_BOOT }} />
      </head>
      <body className="min-h-dvh">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-fog focus:px-4 focus:py-2 focus:text-ink"
        >
          <T>Skip to content</T>
        </a>
        <MotionProvider>{children}</MotionProvider>
        <RevealObserver />
        <LangSync />
      </body>
    </html>
  );
}
