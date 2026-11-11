"use client";

import { useState } from "react";
import { experience } from "@/content/experience";
import { SectionLabel } from "./section-label";

export function Experience() {
  const [open, setOpen] = useState<string | null>(experience.find((e) => e.open)?.id ?? null);

  return (
    <section
      id="experience"
      aria-labelledby="experience-h"
      className="scroll-mt-5 px-6 py-[100px] outline-none"
    >
      <div className="mx-auto flex max-w-[1180px] flex-wrap items-start gap-12">
        <div className="xhead sticky top-[110px] flex min-w-0 flex-[1_1_280px] flex-col gap-3.5">
          <SectionLabel n="02">Experience</SectionLabel>
          <h2
            id="experience-h"
            className="m-0 font-serif text-[clamp(44px,6vw,84px)] leading-[0.95] font-normal tracking-[-0.02em]"
          >
            <span className="mask">
              <span className="mline">
                Work &amp; <span className="italic">study</span>
              </span>
            </span>
          </h2>
          <p className="rv tc text-mu m-0 max-w-[34ch] text-[15px] leading-[1.6]">
            Engineer turned data analyst, capped with a Master&apos;s degree in Data Science. Open
            any row for the details.
          </p>
        </div>

        <div className="rv flex min-w-0 flex-[2_1_560px] flex-col">
          {experience.map((e) => {
            const on = e.id === open;
            return (
              <div key={e.id} className="tc border-bd border-t">
                <h3 className="m-0">
                  <button
                    type="button"
                    id={`x-${e.id}-btn`}
                    aria-expanded={on}
                    aria-controls={`x-${e.id}`}
                    onClick={() => setOpen(on ? null : e.id)}
                    className="xrow text-tx flex w-full cursor-pointer items-center gap-5 border-0 bg-transparent py-[26px] text-left font-sans"
                  >
                    <span className="xdate tc text-fa w-[110px] shrink-0 font-mono text-xs">
                      {e.dates}
                    </span>
                    <span className="flex min-w-0 flex-auto flex-col gap-1">
                      <span className="font-serif text-[30px] leading-[1.05] font-normal">
                        {e.role}
                      </span>
                      <span className="tc text-mu text-sm">{e.org}</span>
                    </span>
                    {e.now && (
                      <span className="xnow tc border-bd2 text-mu rounded-full border px-2.5 py-1 font-mono text-[10.5px]">
                        NOW
                      </span>
                    )}
                    <span
                      className="chev tc border-bd2 flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full border"
                      style={{ transform: on ? "rotate(45deg)" : "none" }}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        aria-hidden="true"
                      >
                        <path d="M12 5v14" />
                        <path d="M5 12h14" />
                      </svg>
                    </span>
                  </button>
                </h3>
                <div
                  id={`x-${e.id}`}
                  role="region"
                  aria-labelledby={`x-${e.id}-btn`}
                  aria-hidden={!on}
                  className="acc grid"
                  style={{ gridTemplateRows: on ? "1fr" : "0fr", opacity: on ? 1 : 0 }}
                >
                  <div className="overflow-hidden">
                    <div className="xbody flex flex-col gap-3 pb-[30px] pl-[130px]">
                      {e.points.map((p, i) => (
                        <p
                          key={i}
                          className="tc text-tx2 m-0 max-w-[62ch] text-[15px] leading-[1.6]"
                        >
                          {p}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <div className="tc border-bd border-t" />
        </div>
      </div>
    </section>
  );
}
