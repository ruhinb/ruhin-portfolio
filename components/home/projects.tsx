"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, type KeyboardEvent } from "react";
import {
  caseStudies,
  moreProjects,
  projectCategories,
  type CaseStudy,
  type ProjectCategory,
} from "@/content/projects";
import { SectionLabel } from "./section-label";

// Case studies count as "Analytics"; smaller projects carry their own categories.
const inCategory = (cat: ProjectCategory, cats: readonly string[]) =>
  cat === "All" || cats.includes(cat);
const countFor = (cat: ProjectCategory) =>
  caseStudies.filter(() => inCategory(cat, ["Analytics"])).length +
  moreProjects.filter((p) => inCategory(cat, p.categories)).length;

const arrowIcon = (d: string) => (
  <svg
    width="17"
    height="17"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d={d} />
  </svg>
);

// Where each report page sits in the stack, relative to the one in front (d = 0).
function cardStyle(d: number) {
  if (d < 0)
    return {
      transform: "translateX(-112%) rotate(-6deg) scale(.96)",
      opacity: 0,
      zIndex: 5,
      boxShadow: "none",
    };
  if (d === 0)
    return {
      transform: "none",
      opacity: 1,
      zIndex: 30,
      boxShadow: "0 24px 60px rgba(20,23,26,0.18), 0 0 0 1px rgba(20,23,26,0.06)",
    };
  if (d === 1)
    return {
      transform: "translateY(-20px) scale(.95)",
      opacity: 0.7,
      zIndex: 29,
      boxShadow: "0 10px 30px rgba(20,23,26,0.1)",
    };
  if (d === 2)
    return {
      transform: "translateY(-38px) scale(.9)",
      opacity: 0.4,
      zIndex: 28,
      boxShadow: "none",
    };
  return { transform: "translateY(-50px) scale(.86)", opacity: 0, zIndex: 20, boxShadow: "none" };
}

function FeaturedCard({ p, index, total }: { p: CaseStudy; index: number; total: number }) {
  const [cur, setCur] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const pages = p.card.pages;
  const n = pages.length;
  const last = index === total - 1;
  const go = (i: number, focus = false) => {
    const next = (i + n) % n;
    setCur(next);
    if (focus) tabs.current[next]?.focus();
  };
  const onTabKey = (e: KeyboardEvent) => {
    const map: Record<string, number> = {
      ArrowRight: cur + 1,
      ArrowLeft: cur - 1,
      Home: 0,
      End: n - 1,
    };
    if (e.key in map) {
      e.preventDefault();
      go(map[e.key], true);
    }
  };
  const pad = (v: number) => String(v).padStart(2, "0");

  return (
    <article
      aria-labelledby={`card-${p.slug}`}
      className={`fc${index}${last ? "" : ` shrink${index}`} stackcard tc bg-sf border-bd sticky flex origin-top flex-wrap items-center gap-x-14 gap-y-8 rounded-[28px] border px-10 pt-7 pb-8`}
      style={{
        top: 96 + Math.min(index, 4) * 18,
        boxShadow: "0 -10px 50px rgba(0,0,0,var(--card-shadow))",
      }}
    >
      <span
        aria-hidden="true"
        className="dimv bg-sheet pointer-events-none absolute -inset-px z-50 rounded-[28px] opacity-0"
      />

      <div className="flex min-w-0 flex-[1.75_1_520px] flex-col gap-3.5">
        <div className="relative pt-10">
          <div className="relative aspect-video">
            {pages.map((pg, i) => {
              const d = i - cur;
              return (
                <button
                  key={pg.name}
                  type="button"
                  tabIndex={-1}
                  aria-hidden="true"
                  onClick={() => setCur(i)}
                  className="card absolute inset-0 origin-top overflow-hidden rounded-2xl border-0 bg-white p-0"
                  style={{
                    ...cardStyle(d),
                    cursor: d === 1 ? "pointer" : "default",
                    pointerEvents: d === 1 ? "auto" : "none",
                  }}
                >
                  <Image
                    quality={90}
                    src={pg.img.src}
                    alt=""
                    width={pg.img.w}
                    height={pg.img.h}
                    sizes="(max-width: 900px) 100vw, 700px"
                    className="block h-full w-full object-cover object-top"
                  />
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => go(cur - 1)}
              aria-label="Previous report page"
              className="arrow tc border-bd bg-sf text-tx absolute top-1/2 -left-[22px] z-40 -mt-6 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
              style={{ opacity: cur === 0 ? 0.4 : 1 }}
            >
              {arrowIcon("M15 6l-6 6 6 6")}
            </button>
            <button
              type="button"
              onClick={() => go(cur + 1)}
              aria-label="Next report page"
              className="arrow tc border-bd bg-sf text-tx absolute top-1/2 -right-[22px] z-40 -mt-6 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
            >
              {arrowIcon("M9 6l6 6-6 6")}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div
            role="tablist"
            aria-label={`${p.t1} ${p.t2} report pages`}
            className="tc border-bd flex flex-wrap gap-0.5 border-b"
          >
            {pages.map((pg, i) => {
              const on = i === cur;
              return (
                <button
                  key={pg.name}
                  ref={(el) => {
                    tabs.current[i] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`tab-${p.slug}-${i}`}
                  aria-selected={on}
                  aria-controls={`panel-${p.slug}`}
                  tabIndex={on ? 0 : -1}
                  onClick={() => setCur(i)}
                  onKeyDown={onTabKey}
                  className={`navlink h-[38px] cursor-pointer border-0 bg-transparent px-[11px] font-sans text-[12.5px] font-medium ${
                    on ? "text-tx" : "text-mu"
                  }`}
                  style={{ boxShadow: `inset 0 -2px 0 ${on ? "var(--accent)" : "transparent"}` }}
                >
                  {pg.name}
                </button>
              );
            })}
          </div>
          <span className="tc text-fa font-mono text-xs">
            {pad(cur + 1)} / {pad(n)}
          </span>
        </div>
        <p
          id={`panel-${p.slug}`}
          role="tabpanel"
          aria-labelledby={`tab-${p.slug}-${cur}`}
          className="tc text-tx2 m-0 text-sm leading-normal"
        >
          {pages[cur].caption}
          <span className="sr-only"> ({pages[cur].img.alt})</span>
        </p>
      </div>

      <div className="flex min-w-0 flex-[1_1_300px] flex-col gap-5">
        <span className="tc text-fa font-mono text-[11.5px] tracking-[0.08em]">
          {pad(index + 1)} / {pad(total)}
        </span>
        <div className="flex flex-col gap-3">
          <span className="tc text-fa font-mono text-[11px] leading-[1.6] tracking-[0.08em]">
            {p.card.meta}
          </span>
          <h3
            id={`card-${p.slug}`}
            className="m-0 font-serif text-[44px] leading-none font-normal tracking-[-0.01em]"
          >
            {p.t1} {p.t2}
          </h3>
        </div>
        <p className="tc text-mu m-0 text-[15.5px] leading-[1.65]">{p.card.question}</p>
        <div className="tc border-bd flex flex-col gap-2 border-t pt-[18px]">
          <span className="tc text-ac-tx font-serif text-5xl leading-none">{p.card.stat}</span>
          <span className="tc text-mu text-sm leading-normal">{p.card.statText}</span>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href={`/projects/${p.slug}`}
            data-mag
            className="tc bg-inv text-inv-tx inline-flex h-[46px] items-center gap-2.5 rounded-full px-5 text-sm font-medium no-underline"
          >
            Read the case study
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14" />
              <path d="M13 6l6 6-6 6" />
            </svg>
          </Link>
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
    </article>
  );
}

export function Projects() {
  const [cat, setCat] = useState<ProjectCategory>("All");
  const [hov, setHov] = useState<number | null>(null);
  const featured = caseStudies.filter(() => inCategory(cat, ["Analytics"]));
  const more = moreProjects.filter((p) => inCategory(cat, p.categories));

  return (
    <section
      id="work"
      aria-labelledby="work-h"
      className="scroll-mt-5 px-6 pt-[100px] pb-20 outline-none"
    >
      <div className="mx-auto flex max-w-[1180px] flex-col gap-12">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex flex-col gap-3.5">
            <SectionLabel n="03">Projects</SectionLabel>
            <h2
              id="work-h"
              className="m-0 font-serif text-[clamp(44px,6vw,84px)] leading-[0.95] font-normal tracking-[-0.02em]"
            >
              <span className="mask">
                <span className="mline">
                  Selected <span className="italic">work</span>
                </span>
              </span>
            </h2>
          </div>
          <div
            role="group"
            aria-label="Filter projects"
            className="rv tc border-bd flex flex-wrap gap-0.5 rounded-full border p-1"
          >
            {projectCategories.map((c) => {
              const on = c === cat;
              return (
                <button
                  key={c}
                  type="button"
                  aria-pressed={on}
                  onClick={() => {
                    setCat(c);
                    setHov(null);
                  }}
                  className={`navlink h-[38px] cursor-pointer rounded-full border-0 px-3.5 font-sans text-[13px] font-medium ${
                    on ? "bg-inv text-inv-tx" : "text-mu bg-transparent"
                  }`}
                >
                  {c} <span className="font-mono text-[11px] opacity-60">{countFor(c)}</span>
                </button>
              );
            })}
          </div>
        </div>

        {featured.length > 0 && (
          <div className="stack flex flex-col gap-12">
            {featured.map((p, i) => (
              <FeaturedCard key={p.slug} p={p} index={i} total={featured.length} />
            ))}
          </div>
        )}

        <div className="rv flex flex-col pt-10">
          <h3 className="tc text-fa m-0 pb-4 font-mono text-xs font-normal tracking-[0.1em]">
            {featured.length ? "MORE PROJECTS" : "PROJECTS"}
          </h3>
          <ul className="m-0 list-none p-0" onMouseLeave={() => setHov(null)}>
            {more.map((p, i) => (
              <li key={p.title}>
                <a
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => setHov(i)}
                  onFocus={() => setHov(i)}
                  onBlur={() => setHov(null)}
                  className="prow tc border-bd text-tx flex min-h-[104px] items-center gap-6 border-t no-underline"
                  style={{ opacity: hov === null || hov === i ? 1 : 0.4 }}
                >
                  <span className="tc text-fa w-7 shrink-0 font-mono text-xs">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex min-w-0 flex-auto flex-col gap-1.5 py-[18px]">
                    <span className="font-serif text-[30px] leading-[1.05]">{p.title}</span>
                    <span className="tc text-mu text-sm leading-normal">{p.description}</span>
                  </span>
                  <span className="tc text-fa hidden text-right font-mono text-[11.5px] whitespace-nowrap sm:inline">
                    {p.context}
                  </span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    className="shrink-0"
                  >
                    <path d="M7 17L17 7" />
                    <path d="M9 7h8v8" />
                  </svg>
                  <span className="sr-only">(opens GitHub in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
          <div className="tc border-bd border-t" />
          {more.length === 0 && (
            <p className="tc text-mu m-0 py-7 text-[15px]">
              That&apos;s everything in this category.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
