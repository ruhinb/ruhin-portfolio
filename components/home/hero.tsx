import type { CSSProperties } from "react";
import { site } from "@/content/site";
import { ResumeButton } from "@/components/ui/resume-button";
import { HeroSong } from "./now-playing";

// Delays line up with the loader; `--off` moves everything earlier on repeat visits.
const delay = (s: number): CSSProperties => ({ animationDelay: `calc(${s}s + var(--off))` });

function Letters({ word, start, step }: { word: string; start: number; step: number }) {
  return word.split("").map((ch, i) => (
    <span key={i} className="ch" style={delay(start + i * step)}>
      {ch}
    </span>
  ));
}

export function Hero() {
  return (
    <section
      id="top"
      aria-label="Introduction"
      className="tc bg-bg sticky top-0 z-0 box-border flex h-svh min-h-[680px] items-center overflow-hidden px-6 py-[120px] outline-none"
    >
      {/* Background: two drifting glows and a dotted grid. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <span
          className="glow1 absolute -top-[20%] -right-[10%] h-[60vw] max-h-[900px] w-[60vw] max-w-[900px] rounded-full blur-[40px]"
          style={{ background: "radial-gradient(circle, var(--glow-a) 0%, transparent 62%)" }}
        />
        <span
          className="glow2 absolute -bottom-[30%] -left-[16%] h-[55vw] max-h-[820px] w-[55vw] max-w-[820px] rounded-full blur-[40px]"
          style={{ background: "radial-gradient(circle, var(--glow-b) 0%, transparent 62%)" }}
        />
        <span
          className="tc absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(var(--grid) 1px, transparent 1.2px)",
            backgroundSize: "26px 26px",
            WebkitMaskImage:
              "radial-gradient(ellipse 60% 55% at 72% 42%, #000 0%, transparent 75%)",
            maskImage: "radial-gradient(ellipse 60% 55% at 72% 42%, #000 0%, transparent 75%)",
          }}
        />
      </div>

      {/* The trend line draws across the bottom and ends at the yellow dot. */}
      <svg
        aria-hidden="true"
        className="draw absolute right-0 bottom-0 left-0 h-[38%] w-full"
        viewBox="0 0 1440 300"
        preserveAspectRatio="none"
      >
        <path
          className="tc"
          d="M-10,250 C120,246 210,238 300,232 S470,236 560,214 S720,206 820,170 S990,168 1080,128 S1250,96 1330,70"
          fill="none"
          stroke="var(--line)"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <span
        aria-hidden="true"
        className="dotin pointer-events-none absolute -mb-[5px] -ml-[5px] h-2.5 w-2.5"
        style={{ left: "92.36%", bottom: "29.13%" }}
      >
        <span className="pulse bg-accent block h-2.5 w-2.5 rounded-full" />
      </span>

      <div className="heroout relative mx-auto flex w-full max-w-[1180px] origin-[30%_50%] flex-col gap-[30px]">
        <h1
          aria-label={site.name}
          className="m-0 font-serif text-[clamp(64px,11vw,168px)] leading-[0.95] font-normal tracking-[-0.02em]"
        >
          <span className="wmask" aria-hidden="true">
            <Letters word="Rubaiyat" start={2.05} step={0.045} />
          </span>{" "}
          <span className="wmask italic" aria-hidden="true">
            <Letters word="Ruhin" start={2.45} step={0.05} />
          </span>
        </h1>
        <p
          className="intro tc text-mu m-0 max-w-[34ch] text-[clamp(18px,1.7vw,22px)] leading-normal"
          style={delay(2.75)}
        >
          {site.tagline}
        </p>
        <div className="intro flex flex-wrap items-center gap-[22px]" style={delay(2.9)}>
          <a
            href="#work"
            data-mag
            className="tc bg-inv text-inv-tx inline-flex h-[50px] items-center gap-2.5 rounded-full px-6 text-[15px] font-medium no-underline"
          >
            See my work
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 5v14" />
              <path d="M6 13l6 6 6-6" />
            </svg>
          </a>
          <ResumeButton className="tc decoration-bd2 hover:decoration-accent inline-flex h-[50px] cursor-pointer items-center border-0 bg-transparent p-0 text-[15px] font-medium text-inherit underline underline-offset-[6px]" />
        </div>
      </div>

      <HeroSong />

      <div
        aria-hidden="true"
        className="herocue tc text-fa absolute bottom-[34px] left-1/2 flex -translate-x-1/2 flex-col items-center gap-2.5 font-mono text-[10px] tracking-[0.2em]"
      >
        <span>SCROLL</span>
        <span className="tc bg-bd relative h-10 w-px overflow-hidden">
          <span className="cue bg-tx absolute top-0 -left-px h-2 w-[3px] rounded-sm" />
        </span>
      </div>
    </section>
  );
}
