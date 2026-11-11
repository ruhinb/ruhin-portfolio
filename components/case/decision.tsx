"use client";

import { useState } from "react";
import type { CaseStudy } from "@/content/projects";

// The interactive "what if" box: pick a scenario, see its number and bar.
export function Decision({ d }: { d: CaseStudy["decision"] }) {
  const [mode, setMode] = useState(d.modes[0].id);
  const m = d.modes.find((x) => x.id === mode) ?? d.modes[0];

  return (
    <div className="rv decbox tc border-bd bg-sf flex flex-col gap-[30px] rounded-3xl border p-8">
      <div
        role="group"
        aria-label={d.modesLabel}
        className="tc border-bd flex flex-wrap gap-0.5 self-start rounded-full border p-1"
      >
        {d.modes.map((x) => {
          const on = x.id === mode;
          return (
            <button
              key={x.id}
              type="button"
              aria-pressed={on}
              onClick={() => setMode(x.id)}
              className={`navlink h-10 cursor-pointer rounded-full border-0 px-4 font-sans text-[13.5px] font-medium ${
                on ? "bg-inv text-inv-tx" : "text-mu bg-transparent"
              }`}
            >
              {x.label}
            </button>
          );
        })}
      </div>
      <div aria-live="polite" className="flex flex-wrap items-end gap-5">
        <span className="tc text-ac-tx font-serif text-[clamp(72px,9vw,120px)] leading-[0.85]">
          {m.value}
        </span>
        <span className="tc text-mu max-w-[36ch] pb-2.5 text-[15px] leading-normal">{m.text}</span>
      </div>
      <div className="flex flex-col gap-2.5">
        <div className="tc bg-sf2 h-3.5 overflow-hidden rounded-[7px]" aria-hidden="true">
          <div className="bar bg-accent h-full rounded-[7px]" style={{ width: m.width }} />
        </div>
        <div className="tc text-fa flex justify-between gap-3 font-mono text-[11px]">
          <span>{d.scale[0]}</span>
          <span className="text-center">{d.scale[1]}</span>
          <span>{d.scale[2]}</span>
        </div>
      </div>
      {d.note && <p className="tc text-fa m-0 text-[13px] leading-[1.6]">{d.note}</p>}
    </div>
  );
}
