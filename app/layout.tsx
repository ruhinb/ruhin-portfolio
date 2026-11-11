import type { Metadata, Viewport } from "next";
import { GeistMono, GeistSans, InstrumentSerif } from "./fonts";
import { IntroScript } from "@/components/intro-script";
import { ThemeProvider } from "@/components/theme-provider";
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
  openGraph: {
    type: "website",
    locale: "en_AU",
    siteName: site.name,
    title: `${site.name} · ${site.role}`,
    description: site.description,
  },
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
      </head>
      <body className="min-h-dvh">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
