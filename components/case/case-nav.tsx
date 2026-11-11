"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { ThemeToggle } from "@/components/nav/theme-toggle";

const ids = ["context", "findings", "decision", "method"];

function subscribe(cb: () => void) {
  window.addEventListener("scroll", cb, { passive: true });
  window.addEventListener("resize", cb, { passive: true });
  return () => {
    window.removeEventListener("scroll", cb);
    window.removeEventListener("resize", cb);
  };
}

function current() {
  const vh = window.innerHeight;
  const doc = document.scrollingElement ?? document.documentElement;
  let cur = "";
  for (const id of ids) {
    const el = document.getElementById(id);
    if (el && el.getBoundingClientRect().top <= vh * 0.4) cur = id;
  }
  if (doc.scrollHeight - vh > 40 && window.scrollY >= doc.scrollHeight - vh - 8) cur = "method";
  return cur;
}

export function CaseNav({ decisionLabel }: { decisionLabel: string }) {
  const active = useSyncExternalStore(subscribe, current, () => "");
  const links = [
    ["Question", "context"],
    ["Findings", "findings"],
    [decisionLabel, "decision"],
    ["Method", "method"],
  ];

  return (
    <div className="sticky top-3.5 z-50 flex h-0 justify-center overflow-visible px-4 pt-3">
      <nav
        aria-label="Case study sections"
        className="navshrink tc border-bd box-border flex h-[52px] max-w-full items-center gap-1 rounded-full border p-[5px] backdrop-blur-[14px]"
        style={{ background: "var(--nav-bg)" }}
      >
        <Link
          href="/#work"
          data-mag
          className="tc bg-inv text-inv-tx inline-flex h-10 shrink-0 items-center gap-2 rounded-full pr-4 pl-3 text-[13.5px] font-medium no-underline"
        >
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
            <path d="M19 12H5" />
            <path d="M11 6l-6 6 6 6" />
          </svg>
          All projects
        </Link>
        <div className="navlinks flex min-w-0 gap-0.5 overflow-x-auto [scrollbar-width:none] max-[640px]:hidden">
          {links.map(([label, id]) => {
            const on = id === active;
            return (
              <a
                key={id}
                href={`#${id}`}
                aria-current={on ? "location" : undefined}
                className={`navlink inline-flex h-10 items-center rounded-full px-3.5 text-[13.5px] font-medium whitespace-nowrap no-underline ${
                  on ? "bg-sf2 text-tx" : "text-mu hover:text-tx bg-transparent"
                }`}
              >
                {label}
              </a>
            );
          })}
        </div>
        <ThemeToggle />
      </nav>
    </div>
  );
}
