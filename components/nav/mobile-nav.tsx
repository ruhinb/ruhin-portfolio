"use client";

import { useEffect, useState } from "react";
import { sections, type SectionId } from "@/content/site";
import { useActiveSection } from "@/lib/active-section";

const all = sections.filter((s) => s.live);
const quick: SectionId[] = ["top", "work", "contact"];
const quickLinks = all.filter((s) => quick.includes(s.id));

// Phones: a bar at the bottom with three main links and a button for the full list.
export function MobileNav() {
  const active = useActiveSection();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const highlightMenu = open || !quick.includes(active);

  return (
    <>
      <nav
        aria-label="Sections"
        className="mnav tc border-bd fixed bottom-[18px] left-1/2 z-70 -translate-x-1/2 items-center gap-0.5 rounded-full border p-[5px] whitespace-nowrap shadow-[0_10px_30px_rgba(0,0,0,0.14)] backdrop-blur-[14px]"
        style={{ background: "var(--nav-bg)" }}
      >
        {quickLinks.map((s) => {
          const on = s.id === active;
          return (
            <a
              key={s.id}
              href={`#${s.id}`}
              onClick={() => setOpen(false)}
              aria-current={on ? "location" : undefined}
              className={`navlink inline-flex h-[42px] items-center rounded-full px-3.5 text-[13px] font-medium no-underline ${
                on ? "bg-inv text-inv-tx" : "text-mu bg-transparent"
              }`}
            >
              {s.label}
            </a>
          );
        })}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label="All sections"
          aria-expanded={open}
          aria-controls="msheet"
          className={`tc flex h-[42px] w-[42px] cursor-pointer items-center justify-center rounded-full border-0 ${
            highlightMenu ? "bg-inv text-inv-tx" : "text-tx bg-transparent"
          }`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <circle cx="5" cy="12" r="1.8" />
            <circle cx="12" cy="12" r="1.8" />
            <circle cx="19" cy="12" r="1.8" />
          </svg>
        </button>
      </nav>
      {open && (
        <div
          id="msheet"
          className="msheet tc bg-sf border-bd fixed right-3 bottom-[86px] left-3 z-71 rounded-3xl border px-5 py-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.18)]"
        >
          {all.map((s, i) => {
            const on = s.id === active;
            return (
              <a
                key={s.id}
                href={`#${s.id}`}
                onClick={() => setOpen(false)}
                className={`tc flex items-baseline justify-between py-3 no-underline ${
                  i === all.length - 1 ? "" : "border-bd border-b"
                } ${on ? "text-tx" : "text-mu"}`}
              >
                <span className={`font-serif text-[30px] leading-none ${on ? "italic" : ""}`}>
                  {s.label}
                </span>
                <span className="tc text-fa font-mono text-[11px]">0{i}</span>
              </a>
            );
          })}
        </div>
      )}
    </>
  );
}
