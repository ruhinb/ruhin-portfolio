import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Privacy",
  description: `What ${site.domain} records about visits, and what it doesn't.`,
  alternates: { canonical: "/privacy" },
};

const h2 = "m-0 mt-6 font-serif text-[clamp(28px,3vw,36px)] leading-tight font-normal";
const p = "tc text-mu m-0 text-[17px] leading-[1.7]";

export default function PrivacyPage() {
  return (
    <main id="main" className="mx-auto flex max-w-[720px] flex-col gap-5 px-6 pt-[120px] pb-24">
      <Link href="/" className="tc text-fa font-mono text-xs tracking-[0.1em] no-underline">
        ← {site.domain.toUpperCase()}
      </Link>
      <h1 className="m-0 font-serif text-[clamp(48px,8vw,88px)] leading-none font-normal">
        <span className="italic">Privacy</span>
      </h1>
      <p className="tc m-0 font-serif text-[clamp(22px,2.4vw,28px)] leading-[1.3]">
        This site counts visits so I know what people read. It doesn&apos;t use cookies,
        doesn&apos;t know who you are, and doesn&apos;t share anything with advertisers.
      </p>

      <h2 className={h2}>What is counted</h2>
      <p className={p}>
        Visitor stats come from Umami, a privacy-focused analytics service. For each visit it
        records the page, the site that linked here, your country, and your device type, browser and
        operating system. It also counts a few actions: opening or downloading the resume, copying
        or clicking the email address, opening the photo gallery, opening a case study or reading
        one to the end, and following a link to LinkedIn, GitHub or Instagram.
      </p>
      <p className={p}>
        Umami sets no cookies and stores nothing on your device. It doesn&apos;t keep your IP
        address, and it can&apos;t follow you to other websites. Everything is counted in aggregate,
        so no visit can be traced back to a person.
      </p>

      <h2 className={h2}>Do Not Track</h2>
      <p className={p}>
        If your browser sends a Do Not Track signal, nothing is counted at all. Ad blockers that
        block the stats script have the same effect, and the site works the same either way.
      </p>

      <h2 className={h2}>Everything else</h2>
      <p className={p}>
        The site is hosted on Vercel, which keeps standard server logs for security and reliability.
        Fonts and images are served from this site. The &ldquo;now playing&rdquo; card loads album
        art from Spotify&apos;s image server; Spotify, the football and the Formula 1 data are
        otherwise fetched by the server, not your browser. There are no forms, sign-ins or embedded
        social media widgets.
      </p>

      <h2 className={h2}>Questions</h2>
      <p className={p}>
        Email me at the address on the{" "}
        <Link href="/#contact" className="text-tx underline underline-offset-4">
          home page
        </Link>
        .
      </p>
      <p className="tc text-fa m-0 mt-6 font-mono text-xs tracking-[0.08em]">
        LAST UPDATED NOVEMBER 2026
      </p>
    </main>
  );
}
