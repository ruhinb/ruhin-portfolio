import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/content/site";

// The picture shown when a link to the site is shared on LinkedIn, Slack, iMessage and so on.
// Drawn at build time from the site's own fonts and colours (light theme).

export const ogSize = { width: 1200, height: 630 };

const c = {
  bg: "#f1ede5",
  tx: "#16181b",
  mu: "#5e636b",
  fa: "#6a6f77",
  bd: "#d9d3c7",
  accent: "#f5b83d",
  red: "#b4352a",
  green: "#1f7a52",
  blue: "#1f5fc4",
} as const;

export type Tone = "tx" | "red" | "green" | "blue" | "accent";
const toneColour = (t: Tone) => (t === "accent" ? "#8a5a00" : c[t]);

async function fonts() {
  const [serif, serifItalic, sans, sansMedium, mono] = await Promise.all([
    readFile(join(process.cwd(), "lib/og/instrument-serif-normal.ttf")),
    readFile(join(process.cwd(), "lib/og/instrument-serif-italic.ttf")),
    readFile(join(process.cwd(), "lib/og/Geist-Regular.ttf")),
    readFile(join(process.cwd(), "lib/og/Geist-Medium.ttf")),
    readFile(join(process.cwd(), "lib/og/GeistMono-Regular.ttf")),
  ]);
  return [
    { name: "Serif", data: serif, weight: 400 as const, style: "normal" as const },
    { name: "Serif", data: serifItalic, weight: 400 as const, style: "italic" as const },
    { name: "Sans", data: sans, weight: 400 as const, style: "normal" as const },
    { name: "Sans", data: sansMedium, weight: 500 as const, style: "normal" as const },
    { name: "Mono", data: mono, weight: 400 as const, style: "normal" as const },
  ];
}

function Brand() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        fontFamily: "Mono",
        fontSize: 20,
        letterSpacing: 2,
        color: c.fa,
      }}
    >
      <div style={{ width: 12, height: 12, borderRadius: 12, background: c.accent }} />
      {site.domain.toUpperCase()}
    </div>
  );
}

// Home page card: name, tagline and portrait. Saved as a JPEG: with a photo in it, a PNG
// is around 500 KB, and WhatsApp skips previews over about 300 KB.
export async function homeCard() {
  const png = await homeCardPng();
  const sharp = (await import("sharp")).default;
  const jpg = await sharp(Buffer.from(await png.arrayBuffer()))
    .jpeg({ quality: 88, mozjpeg: true })
    .toBuffer();
  return new Response(new Uint8Array(jpg), { headers: { "Content-Type": "image/jpeg" } });
}

async function homeCardPng() {
  const portrait = await readFile(join(process.cwd(), "public/images/portrait.jpg"));
  const src = `data:image/jpeg;base64,${portrait.toString("base64")}`;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        background: c.bg,
        padding: 64,
        gap: 56,
        fontFamily: "Sans",
      }}
    >
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Brand />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: "auto",
            gap: 26,
          }}
        >
          <div
            style={{
              display: "flex",
              fontFamily: "Serif",
              fontSize: 112,
              lineHeight: 0.92,
              letterSpacing: -2,
              color: c.tx,
              flexWrap: "wrap",
            }}
          >
            <span>Rubaiyat&nbsp;</span>
            <span style={{ fontStyle: "italic" }}>Ruhin</span>
          </div>
          <div style={{ fontFamily: "Serif", fontSize: 40, lineHeight: 1.2, color: c.mu }}>
            {site.tagline}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 10,
              paddingTop: 22,
              borderTop: `1px solid ${c.bd}`,
              fontFamily: "Mono",
              fontSize: 18,
              letterSpacing: 1.2,
              color: c.fa,
            }}
          >
            DATA ANALYST · ADELAIDE · SQL · POWER BI · PYTHON
          </div>
        </div>
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element -- drawn into a picture, not a page */}
      <img
        src={src}
        alt=""
        width={400}
        height={502}
        style={{ borderRadius: 28, objectFit: "cover", width: 400, height: 502 }}
      />
    </div>,
    { ...ogSize, fonts: await fonts() },
  );
}

// Case study card: title, one-line result and the headline numbers.
export async function caseCard(p: {
  t1: string;
  t2: string;
  lead: string;
  kpis: { k: string; v: string; tone: Tone }[];
}) {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: c.bg,
        padding: 64,
        fontFamily: "Sans",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Brand />
        <div style={{ fontFamily: "Mono", fontSize: 20, letterSpacing: 2, color: c.fa }}>
          CASE STUDY
        </div>
      </div>
      <div
        style={{
          display: "flex",
          marginTop: 56,
          fontFamily: "Serif",
          fontSize: 96,
          lineHeight: 0.95,
          letterSpacing: -1.5,
          color: c.tx,
          flexWrap: "wrap",
        }}
      >
        <span>{p.t1}&nbsp;</span>
        <span style={{ fontStyle: "italic" }}>{p.t2}</span>
      </div>
      <div
        style={{
          marginTop: 24,
          fontFamily: "Serif",
          fontSize: 34,
          lineHeight: 1.25,
          color: c.mu,
          maxWidth: 1000,
        }}
      >
        {p.lead}
      </div>
      <div
        style={{
          display: "flex",
          marginTop: "auto",
          borderTop: `1px solid ${c.bd}`,
        }}
      >
        {p.kpis.slice(0, 4).map((k) => (
          <div
            key={k.k}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: 10,
              paddingTop: 22,
              paddingRight: 20,
            }}
          >
            <div style={{ fontFamily: "Mono", fontSize: 15, letterSpacing: 1.2, color: c.fa }}>
              {k.k}
            </div>
            <div
              style={{
                fontFamily: "Serif",
                fontSize: 52,
                lineHeight: 1,
                color: toneColour(k.tone),
              }}
            >
              {k.v}
            </div>
          </div>
        ))}
      </div>
    </div>,
    { ...ogSize, fonts: await fonts() },
  );
}
