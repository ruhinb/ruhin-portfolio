import Image from "next/image";
import { about } from "@/content/about";
import { SectionLabel } from "./section-label";

export function About() {
  const words = about.summary
    .split(" ")
    .map((w) => ({ em: w.startsWith("*"), t: w.replace(/^\*/, "") }));
  const [lineA, lineB] = about.headline;
  const [firstWord, ...restB] = lineB.split(" ");

  return (
    <section
      id="about"
      aria-labelledby="about-h"
      className="scroll-mt-5 px-6 pt-[130px] pb-[120px] outline-none"
    >
      <div className="mx-auto flex max-w-[1180px] flex-wrap items-center gap-16">
        <div className="max-w-[460px] min-w-0 flex-[1_1_320px]">
          <div className="portrait tc bg-sf2 relative aspect-[4/5] overflow-hidden rounded-3xl">
            <Image
              src={about.portrait.src}
              alt={about.portrait.alt}
              fill
              sizes="(max-width: 760px) 100vw, 460px"
              className="par object-cover"
            />
            <span className="absolute bottom-3.5 left-3.5 inline-flex items-center gap-2 rounded-full bg-[rgba(13,14,16,0.62)] px-3 py-[7px] font-mono text-[11px] tracking-[0.06em] text-[#ededea] backdrop-blur-[8px]">
              <span className="pulse bg-accent h-[7px] w-[7px] rounded-full" />
              ADELAIDE, SA
            </span>
          </div>
        </div>
        <div className="flex min-w-0 flex-[1.4_1_420px] flex-col gap-7">
          <SectionLabel n="01">About</SectionLabel>
          <h2
            id="about-h"
            className="m-0 font-serif text-[clamp(44px,5vw,72px)] leading-none font-normal tracking-[-0.015em]"
          >
            <span className="mask">
              <span className="mline">{lineA}</span>
            </span>
            <span className="mask">
              <span className="mline">
                <span className="italic">{firstWord}</span> {restB.join(" ")}
              </span>
            </span>
          </h2>
          <p className="m-0 max-w-[54ch] text-xl leading-[1.6]">
            {words.map((w, i) => (
              <span key={i} className={`word tc ${w.em ? "text-ac-tx font-semibold" : "text-tx"}`}>
                {w.t}{" "}
              </span>
            ))}
          </p>
          <dl className="rv m-0 grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-x-6 gap-y-[22px]">
            {about.facts.map((f) => (
              <div key={f.k} className="tc border-bd flex flex-col gap-1.5 border-t pt-3.5">
                <dt className="tc text-fa font-mono text-[11px] tracking-[0.08em]">{f.k}</dt>
                <dd className="m-0 text-[15px] leading-normal">{f.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
