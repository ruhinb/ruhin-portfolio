import { getF1 } from "@/lib/live/f1";
import { getFootball } from "@/lib/live/football";
import type { F1Data, FootballData, Result } from "@/lib/live/types";
import { LifeSong } from "./now-playing";
import { PhotoPreview } from "./photo-preview";

const resultStyle: Record<Result, { bg: string; fg: string }> = {
  W: { bg: "#2FBF71", fg: "#08130C" },
  D: { bg: "#FFF4E8", fg: "#5B0A10" },
  L: { bg: "#1B0204", fg: "#FFF4E8" },
};
const podiumColour = ["#F5B83D", "#C9CDD2", "#C98B5A"];
const mono = "font-mono text-[10.5px] tracking-[0.1em]";

function FootballCard({ d }: { d: FootballData }) {
  return (
    <article
      aria-labelledby="mu-h"
      className="lpanel relative box-border flex w-[min(1000px,90vw)] shrink-0 flex-wrap gap-7 overflow-hidden rounded-[28px] bg-[#A50E1A] p-8 text-[#FFF4E8]"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 800 560"
        preserveAspectRatio="xMidYMid slice"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-10"
      >
        <rect x="40" y="40" width="720" height="480" fill="none" stroke="#FFF4E8" strokeWidth="2" />
        <line x1="400" y1="40" x2="400" y2="520" stroke="#FFF4E8" strokeWidth="2" />
        <circle cx="400" cy="280" r="80" fill="none" stroke="#FFF4E8" strokeWidth="2" />
      </svg>
      <div className="relative flex min-w-0 flex-[1.25_1_380px] flex-col justify-between gap-[18px]">
        <div className="flex flex-col gap-2.5">
          <span className="font-mono text-[11px] tracking-[0.1em] opacity-80">
            FOOTBALL · PREMIER LEAGUE
          </span>
          <h3
            id="mu-h"
            className="m-0 font-serif text-[clamp(48px,5vw,76px)] leading-[0.9] font-normal tracking-[-0.02em]"
          >
            Manchester <span className="italic">United</span>
          </h3>
        </div>
        {d.next && (
          <div className="flex flex-col gap-2 rounded-[18px] bg-black/[0.22] px-5 py-[18px]">
            <span className={`${mono} opacity-75`}>NEXT MATCH</span>
            <span className="font-serif text-[34px] leading-none">{d.next.title}</span>
            <span className="text-[13.5px] opacity-85">{d.next.when}</span>
            <span className="text-[12.5px] opacity-70">{d.then}</span>
          </div>
        )}
        <div className="flex flex-col gap-2">
          <span className={`${mono} opacity-75`}>LAST FIVE</span>
          <ul className="m-0 flex list-none flex-wrap gap-1.5 p-0">
            {d.form.map((f, i) => (
              <li
                key={i}
                className="flex min-w-16 flex-col items-center gap-1 rounded-xl bg-[rgba(255,244,232,0.1)] px-1.5 py-2"
              >
                <span
                  className="flex h-[22px] w-[22px] items-center justify-center rounded-md font-mono text-[11px] font-medium"
                  style={{ background: resultStyle[f.r].bg, color: resultStyle[f.r].fg }}
                >
                  <span aria-hidden="true">{f.r}</span>
                  <span className="sr-only">
                    {f.r === "W" ? "Won" : f.r === "D" ? "Drew" : "Lost"}
                  </span>
                </span>
                <span className="font-mono text-[11px]">{f.score}</span>
                <span className="text-[10.5px] opacity-75">{f.opp}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="relative flex min-w-0 flex-[1_1_300px] flex-col gap-2.5">
        <div className={`flex justify-between ${mono} opacity-75`}>
          <span>TABLE</span>
          <span>P · PTS</span>
        </div>
        <ol className="m-0 flex list-none flex-col gap-2.5 p-0">
          {d.table.map((r) => {
            const me = r.teamId === d.teamId;
            return (
              <li key={r.team} className="flex flex-col gap-2.5">
                {r.gapBefore && (
                  <span aria-hidden="true" className="text-center text-xs leading-[0.6] opacity-50">
                    ⋯
                  </span>
                )}
                <span
                  className="flex items-center gap-2.5 rounded-[10px] px-3 py-2 text-[13.5px]"
                  style={{
                    background: me ? "#FFF4E8" : "rgba(255,244,232,.08)",
                    color: me ? "#7A0A13" : "#FFF4E8",
                    fontWeight: me ? 600 : 400,
                  }}
                >
                  <span className="w-[18px] font-mono text-[11.5px] opacity-80">{r.pos}</span>
                  <span className="flex-auto">{r.team}</span>
                  <span className="font-mono text-xs opacity-80">{r.played}</span>
                  <span className="w-7 text-right font-mono text-xs">{r.pts}</span>
                </span>
              </li>
            );
          })}
        </ol>
        <span className="mt-auto font-mono text-[10px] tracking-[0.06em] opacity-65">{d.asOf}</span>
      </div>
    </article>
  );
}

function F1Card({ d }: { d: F1Data }) {
  const top = d.standings[0]?.pts || 1;
  return (
    <article
      aria-labelledby="f1-h"
      className="lpanel relative box-border flex w-[min(1000px,90vw)] shrink-0 flex-wrap gap-7 overflow-hidden rounded-[28px] bg-[#121317] p-8 text-[#F1F1EE]"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 1000 600"
        preserveAspectRatio="xMidYMid slice"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.14]"
      >
        <path
          d="M-20,480 C180,470 260,330 420,360 S640,560 780,420 S900,160 1040,180"
          fill="none"
          stroke="#E10600"
          strokeWidth="3"
        />
        <path
          d="M-20,500 C180,490 260,350 420,380 S640,580 780,440 S900,180 1040,200"
          fill="none"
          stroke="#F1F1EE"
          strokeWidth="1"
          strokeDasharray="6 10"
        />
      </svg>
      <div className="relative flex min-w-0 flex-[1.1_1_360px] flex-col justify-between gap-[18px]">
        <div className="flex flex-col gap-2.5">
          <span className="font-mono text-[11px] tracking-[0.1em] opacity-70">
            FORMULA 1 · {d.season} SEASON
          </span>
          <h3
            id="f1-h"
            className="m-0 font-serif text-[clamp(48px,5vw,76px)] leading-[0.9] font-normal tracking-[-0.02em]"
          >
            Race <span className="italic">weekends</span>
          </h3>
        </div>
        <div className="flex flex-col gap-2">
          <span className={`${mono} opacity-70`}>{d.lastLabel}</span>
          <ol className="m-0 flex list-none flex-col gap-2 p-0">
            {d.podium.map((p, i) => (
              <li
                key={p.pos}
                className="flex items-center gap-3 rounded-xl bg-white/[0.06] px-3.5 py-2.5"
              >
                <span
                  className="flex h-[26px] w-[26px] items-center justify-center rounded-[7px] font-mono text-[11.5px] font-medium text-[#121317]"
                  style={{ background: podiumColour[i] }}
                >
                  {p.pos}
                </span>
                <span className="flex-auto text-[15px] font-medium">{p.name}</span>
                <span className="text-[12.5px] opacity-65">{p.team}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="flex flex-col gap-1.5 rounded-2xl border border-white/[0.14] px-4 py-3.5">
          <span className={`${mono} opacity-70`}>NEXT RACE</span>
          <span className="font-serif text-[28px] leading-none">{d.next}</span>
          <span className="text-[12.5px] opacity-70">{d.then}</span>
        </div>
      </div>
      <div className="relative flex min-w-0 flex-[1_1_300px] flex-col gap-3">
        <span className={`${mono} opacity-70`}>DRIVERS&apos; STANDINGS</span>
        <ol className="m-0 flex list-none flex-col gap-3 p-0">
          {d.standings.map((s, i) => (
            <li key={s.name} className="flex flex-col gap-1.5">
              <div className="flex justify-between text-[13.5px]">
                <span>
                  <span className="mr-2 font-mono opacity-60">{s.pos}</span>
                  {s.name} <span className="opacity-55">· {s.team}</span>
                </span>
                <span className="font-mono">{s.pts}</span>
              </div>
              <span
                aria-hidden="true"
                className="block h-1.5 overflow-hidden rounded-[3px] bg-white/[0.08]"
              >
                <span
                  className="block h-1.5 rounded-[3px]"
                  style={{
                    width: `${((s.pts / top) * 100).toFixed(1)}%`,
                    background: i === 0 ? "#E10600" : "rgba(241,241,238,.55)",
                  }}
                />
              </span>
            </li>
          ))}
        </ol>
        <span className="pt-1.5 text-[12.5px] opacity-70">{d.constructors}</span>
        <span className="mt-auto font-mono text-[10px] tracking-[0.06em] opacity-60">{d.asOf}</span>
      </div>
    </article>
  );
}

// "Off the clock": a sticky panel that scrolls sideways as you scroll down.
// On phones and short screens the panels stack vertically instead.
export async function Life() {
  // Fetched on the server when the page is (re)built; the page refreshes every 15 minutes.
  const [football, f1] = await Promise.all([getFootball(), getF1()]);

  return (
    <section
      id="life"
      aria-labelledby="life-h"
      className="lifesec relative h-[3000px] outline-none"
    >
      <div className="lifestick sticky top-0 flex h-svh flex-col justify-center gap-6 overflow-hidden">
        <div
          className="htrack box-content flex w-max items-stretch gap-6 px-6 pt-[70px]"
          style={{ height: "clamp(440px, min(max(70vh, 560px), calc(100vh - 150px)), 620px)" }}
        >
          <div className="lpanel box-border flex w-[min(520px,84vw)] shrink-0 flex-col justify-end gap-[22px] pt-0 pr-5 pb-1 pl-1">
            <span className="tc text-fa font-mono text-xs tracking-[0.1em]">04 — LIFE</span>
            <h2
              id="life-h"
              className="m-0 font-serif text-[clamp(56px,7vw,112px)] leading-[0.9] font-normal tracking-[-0.02em]"
            >
              Off the <span className="italic">clock</span>
            </h2>
            <p className="tc text-mu m-0 max-w-[34ch] text-[17px] leading-[1.6]">
              Photos, matchdays and race weekends.<span className="lkeep"> Keep scrolling →</span>
            </p>
            <LifeSong />
          </div>

          <PhotoPreview />
          {football && <FootballCard d={football} />}
          {f1 && <F1Card d={f1} />}
          <div className="lspacer w-6 shrink-0" />
        </div>
        <div className="lifebarwrap mx-auto box-border w-full max-w-[1180px] px-6">
          <div className="tc bg-bd h-0.5 overflow-hidden rounded-[1px]">
            <div className="lifebar bg-accent h-0.5 origin-left" />
          </div>
        </div>
      </div>
    </section>
  );
}
