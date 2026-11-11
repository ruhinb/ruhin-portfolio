import type { Metadata, Viewport } from "next";
import { GeistMono, GeistSans, InstrumentSerif } from "./fonts";
import { Umami } from "@/components/analytics/umami";
import { IntroScript } from "@/components/intro-script";
import { ThemeProvider } from "@/components/theme-provider";
import { Cursor } from "@/components/ui/cursor";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { site } from "@/content/site";
import "./globals.css";
import "./motion.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} · ${site.role}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_AU",
    url: "/",
    siteName: site.name,
    title: `${site.name} · ${site.role}`,
    description: site.description,
  },
  twitter: { card: "summary_large_image" },
};

// Tells Google who the site is about (shown in search results and the knowledge panel).
const person = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Rubaiyat Alam Ruhin",
  alternateName: ["Rubaiyat Ruhin", "Ru"],
  url: site.url,
  image: `${site.url}/images/portrait.jpg`,
  jobTitle: site.role,
  description: site.description,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Adelaide",
    addressRegion: "SA",
    addressCountry: "AU",
  },
  alumniOf: [
    { "@type": "CollegeOrUniversity", name: "The University of Adelaide" },
    { "@type": "CollegeOrUniversity", name: "BRAC University" },
  ],
  knowsAbout: ["Data analysis", "SQL", "Power BI", "Python", "Excel", "R"],
  sameAs: [site.links.linkedin, site.links.github],
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f1ede5" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0c0e" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // next-themes sets the class on <html> before React loads, so React is told not to warn about it.
    <html
      lang="en-AU"
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable} ${InstrumentSerif.variable} antialiased`}
    >
      <head>
        <IntroScript />
        <Umami />
        <script
          type="application/ld+json"
          // JSON.stringify output with "<" escaped can't close the script tag early.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(person).replace(/</g, "\\u003c"),
          }}
        />
      </head>
      <body className="min-h-dvh">
        <ThemeProvider>
          {children}
          <Cursor />
          <SmoothScroll />
        </ThemeProvider>
      </body>
    </html>
  );
}
