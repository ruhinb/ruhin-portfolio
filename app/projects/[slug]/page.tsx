import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CaseNav } from "@/components/case/case-nav";
import { Curtain } from "@/components/case/curtain";
import { Decision } from "@/components/case/decision";
import { ScrollFallback } from "@/components/motion/scroll-fallback";
import { PageBehaviour } from "@/components/page-behaviour";
import { caseStudies, getCaseStudy, nextCaseStudy, type Tone } from "@/content/projects";
import { site } from "@/content/site";
import { buildYear } from "@/lib/build-date";

// Only the case studies listed in content/projects.ts exist; any other slug is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = getCaseStudy(slug);
  if (!p) return {};
  return {
    title: `${p.t1} ${p.t2}`,
    description: p.lead,
    openGraph: { title: `${p.t1} ${p.t2} · ${site.name}`, description: p.lead, type: "article" },
  };
}

const toneClass: Record<Tone, string> = {
  tx: "text-tx",
  red: "text-red",
  green: "text-green",
  blue: "text-blue",
  accent: "text-ac-tx",
};
const toneBorder: Record<Tone, string> = {
  tx: "var(--tx)",
  red: "var(--red)",
  green: "var(--green)",
  blue: "var(--blue)",
  accent: "var(--accent)",
};

const label = "tc text-fa font-mono text-xs tracking-[0.1em]";
const delay = (s: number) => ({ animationDelay: `calc(${s}s + var(--cd))` });

export default async function CaseStudyPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const p = getCaseStudy(slug);
  if (!p) notFound();
  const next = nextCaseStudy(slug);
  const year = await buildYear();

  return (
    <div className="case bg-bg text-tx relative min-h-dvh">
      <Curtain slug={p.slug} t1={p.t1} t2={p.t2} />

      <div
        aria-hidden="true"
        className="progress bg-accent sticky top-0 z-60 h-0.5 origin-left"
        style={{ transform: "scaleX(0)" }}
      />
      <CaseNav decisionLabel={p.decision.nav} />

      <main id="main">
        <header id="top" className="chead px-6 pt-[170px] pb-[70px]">
          <div className="mx-auto flex max-w-[1180px] flex-col gap-7">
            <span className={`cintro ${label} leading-[1.6]`} style={delay(0.05)}>
              {p.overline}
            </span>
            <h1
              className="cintro m-0 font-serif text-[clamp(56px,9vw,136px)] leading-[0.9] font-normal tracking-[-0.02em]"
              style={delay(0.12)}
            >
              {p.t1} <span className="italic">{p.t2}</span>
            </h1>
            <p
              className="cintro tc text-mu m-0 max-w-[40ch] font-serif text-[clamp(24px,2.6vw,34px)] leading-[1.25]"
              style={delay(0.2)}
            >
              {p.lead}
            </p>
            <div className="cintro" style={delay(0.2)}>
              <a
                href={p.github}
                target="_blank"
                rel="noopener noreferrer"
                data-mag
                className="tc border-bd2 inline-flex h-[46px] items-center rounded-full border px-[18px] text-sm font-medium no-underline"
              >
                View on GitHub ↗
              </a>
            </div>
          </div>
        </header>

        <section aria-label="Key figures" className="px-6 pb-20">
          <dl className="rv tc border-bd mx-auto m-0 grid max-w-[1180px] grid-cols-[repeat(auto-fit,minmax(160px,1fr))] border-t">
            {p.kpis.map((k) => (
              <div key={k.k} className="flex flex-col gap-2 pt-6 pr-6">
                <dt className="tc text-fa font-mono text-[11px] tracking-[0.08em]">{k.k}</dt>
                <dd
                  className={`tc m-0 font-serif text-[clamp(40px,4vw,52px)] leading-none ${toneClass[k.tone]}`}
                >
                  {k.v}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="px-6 pb-[120px]">
          <figure className="rv mx-auto m-0 flex max-w-[1180px] flex-col gap-3.5">
            <div className="imgin tc border-bd overflow-hidden rounded-[20px] border bg-white">
              <Image
                quality={90}
                src={p.hero.src}
                alt={p.hero.alt}
                width={p.hero.w}
                height={p.hero.h}
                sizes="(max-width: 1228px) 100vw, 1180px"
                priority
                className="block h-auto w-full"
              />
            </div>
            <figcaption className="tc text-fa text-[13px]">{p.hero.caption}</figcaption>
          </figure>
        </section>

        <section
          id="context"
          aria-labelledby="context-h"
          className="scroll-mt-[90px] px-6 pb-[120px]"
        >
          <div className="mx-auto flex max-w-[1180px] flex-wrap gap-x-16 gap-y-8">
            <h2 id="context-h" className={`rv ${label} m-0 flex-[1_1_220px] font-normal`}>
              THE QUESTION
            </h2>
            <div className="rv flex min-w-0 flex-[3_1_560px] flex-col gap-[18px]">
              <p className="m-0 font-serif text-[clamp(28px,3vw,40px)] leading-[1.2]">
                {p.question}
              </p>
              <p className="tc text-mu m-0 max-w-[62ch] text-[17px] leading-[1.7]">
                {p.questionBody}
              </p>
            </div>
          </div>
        </section>

        <section id="findings" aria-label="Findings" className="scroll-mt-[90px] px-6 pb-[60px]">
          <div className="mx-auto flex max-w-[1180px] flex-col gap-[120px]">
            {p.findings.map((f, i) => {
              const wide = f.layout === "wide";
              return (
                <article
                  key={f.title}
                  className={`flex flex-wrap gap-x-16 gap-y-10 ${
                    wide
                      ? "flex-col items-stretch"
                      : f.layout === "side-reverse"
                        ? "flex-row-reverse items-center"
                        : "flex-row items-center"
                  }`}
                >
                  <div
                    className={`rv flex min-w-0 flex-col gap-[18px] ${wide ? "max-w-[760px] flex-none" : "flex-[1_1_340px]"}`}
                  >
                    <span className={label}>FINDING {String(i + 1).padStart(2, "0")}</span>
                    <h2 className="m-0 font-serif text-[clamp(36px,4vw,56px)] leading-none font-normal tracking-[-0.01em]">
                      {f.title}
                    </h2>
                    <p className="tc text-mu m-0 text-[16.5px] leading-[1.7]">{f.body}</p>
                  </div>
                  <figure className={`rv m-0 min-w-0 ${wide ? "flex-none" : "flex-[1.5_1_480px]"}`}>
                    <div className="imgin tc border-bd overflow-hidden rounded-[18px] border bg-white">
                      <Image
                        quality={90}
                        src={f.img.src}
                        alt={f.img.alt}
                        width={f.img.w}
                        height={f.img.h}
                        sizes={
                          wide
                            ? "(max-width: 1228px) 100vw, 1180px"
                            : "(max-width: 900px) 100vw, 700px"
                        }
                        className="block h-auto w-full"
                      />
                    </div>
                  </figure>
                </article>
              );
            })}
          </div>
        </section>

        <section
          id="decision"
          aria-labelledby="decision-h"
          className="scroll-mt-[90px] px-6 pt-[140px] pb-[120px]"
        >
          <div className="mx-auto flex max-w-[1180px] flex-col gap-12">
            <div className="rv flex flex-col gap-3.5">
              <span className={`${label} leading-[1.6]`}>{p.decision.over}</span>
              <h2
                id="decision-h"
                className="m-0 font-serif text-[clamp(40px,5vw,72px)] leading-[0.98] font-normal tracking-[-0.015em]"
              >
                {p.decision.a}
                <span className="italic">{p.decision.b}</span>
                {p.decision.c}
              </h2>
            </div>
            <Decision d={p.decision} />
            <div className="rv grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-4">
              {p.camps.map((c) => (
                <div
                  key={c.title}
                  className="tc flex flex-col gap-2.5 border-t-2 pt-[18px]"
                  style={{ borderTopColor: toneBorder[c.tone] }}
                >
                  <h3 className="m-0 text-[17px] font-semibold">
                    {c.title}{" "}
                    <span className="tc text-fa font-mono text-xs font-normal">· {c.tag}</span>
                  </h3>
                  <p className="tc text-mu m-0 text-[14.5px] leading-[1.6]">{c.list}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="method"
          aria-labelledby="method-h"
          className="scroll-mt-[90px] px-6 pt-10 pb-[120px]"
        >
          <div className="mx-auto flex max-w-[1180px] flex-wrap gap-x-16 gap-y-8">
            <h2 id="method-h" className={`rv ${label} m-0 flex-[1_1_220px] font-normal`}>
              HOW I BUILT IT
            </h2>
            <dl className="rv m-0 grid min-w-0 flex-[3_1_560px] grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-x-10 gap-y-7">
              {p.method.map((m) => (
                <div key={m.k} className="flex flex-col gap-2">
                  <dt className="text-base font-semibold">{m.k}</dt>
                  <dd className="tc text-mu m-0 text-[15px] leading-[1.6]">{m.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      </main>

      <section aria-label="Next project" className="px-6 pb-12">
        <div className="mx-auto flex max-w-[1180px] flex-col gap-10">
          <Link
            href={`/projects/${next.slug}`}
            className="rv tc border-bd flex flex-wrap items-center justify-between gap-6 border-y py-10 no-underline"
          >
            <span className="flex flex-col gap-2.5">
              <span className={label}>NEXT PROJECT</span>
              <span className="font-serif text-[clamp(40px,5vw,72px)] leading-none">
                {next.t1} <span className="italic">{next.t2}</span>
              </span>
            </span>
            <span className="tc bg-inv text-inv-tx flex h-16 w-16 items-center justify-center rounded-full">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h14" />
                <path d="M13 6l6 6-6 6" />
              </svg>
            </span>
          </Link>
          <footer className="tc text-fa flex flex-wrap justify-between gap-3 font-mono text-xs">
            <span>
              © {year} {site.name}
              {p.footNote ? ` · ${p.footNote}` : ""}
            </span>
            <a href={p.github} target="_blank" rel="noopener noreferrer" className="no-underline">
              {p.githubLabel}
            </a>
          </footer>
        </div>
      </section>

      <PageBehaviour />
      <ScrollFallback />
    </div>
  );
}
