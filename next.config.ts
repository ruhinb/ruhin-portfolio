import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";
// Vercel serves only HTTPS. Locally and in CI the site runs on plain http://localhost,
// where Safari would follow upgrade-insecure-requests to https://localhost and fail.
const onVercel = process.env.VERCEL === "1";

/*
 * Content Security Policy: what the browser may load and run on this site.
 *
 * Scripts, styles, fonts and requests are limited to this site's own domain
 * (Umami analytics will also run through it). Images may also come from
 * Spotify's album-art server. Nothing may embed the site in a frame.
 *
 * Inline scripts are allowed because Next.js writes small ones into every page.
 * The alternative (a fresh nonce per request) would turn off pre-built pages and
 * make every visit slower. With no login, forms or visitor-written content,
 * the site has no way for an attacker to inject a script in the first place.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data: https://i.scdn.co",
  "font-src 'self'",
  "connect-src 'self'",
  "media-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(onVercel ? ["upgrade-insecure-requests"] : []),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [{ protocol: "https", hostname: "i.scdn.co" }],
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
