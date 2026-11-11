import { site } from "@/content/site";
import { SectionLabel } from "./section-label";

// Stand-in until stage 3 brings the stacked case-study cards.
export function ProjectsSoon() {
  return (
    <section
      id="work"
      aria-labelledby="work-h"
      className="scroll-mt-5 px-6 pt-[100px] pb-20 outline-none"
    >
      <div className="mx-auto flex max-w-[1180px] flex-col gap-10">
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
        <div className="rv tc bg-sf border-bd flex flex-wrap items-center justify-between gap-6 rounded-[28px] border px-8 py-8 sm:px-10">
          <p className="text-tx2 m-0 max-w-[52ch] text-[17px] leading-[1.6]">
            Three case studies are on their way here: patient no-shows across a clinic network,
            retail discount limits, and a pizza kitchen&apos;s rush hours. Until then, the SQL,
            Python and Power BI files are on GitHub.
          </p>
          <a
            href={site.links.projectsRepo}
            target="_blank"
            rel="noopener noreferrer"
            className="tc bg-inv text-inv-tx inline-flex h-[50px] items-center rounded-full px-6 text-[15px] font-medium no-underline"
          >
            View on GitHub ↗
          </a>
        </div>
      </div>
    </section>
  );
}
