import localFont from "next/font/local";

export { GeistSans } from "geist/font/sans";
export { GeistMono } from "geist/font/mono";

// Instrument Serif (SIL Open Font License 1.1), self-hosted so no request leaves the site.
export const InstrumentSerif = localFont({
  src: [
    { path: "./fonts/instrument-serif-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/instrument-serif-latin-400-italic.woff2", weight: "400", style: "italic" },
  ],
  variable: "--font-instrument-serif",
  display: "swap",
  fallback: ["Georgia", "Times New Roman", "serif"],
});
