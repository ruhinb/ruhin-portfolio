"use client";

import { sections } from "@/content/site";
import { useActiveSection } from "@/lib/active-section";
import { ThemeToggle } from "./theme-toggle";

const links = sections.filter((s) => s.live);

// The floating pill at the top: logo, section links and the theme switch.
// On phones only the logo and switch stay; the links move to the bottom bar.
export function TopNav() {
  const active = useActiveSection();

  return (
    <div className="topwrap sticky top-3.5 z-60 flex h-0 justify-center overflow-visible px-4 pt-3.5">
      <nav
        aria-label="Sections"
        className="navshrink topnav tc border-bd box-border flex h-[52px] max-w-full items-center gap-1 rounded-full border p-[5px] backdrop-blur-[14px]"
        style={{ background: "var(--nav-bg)" }}
      >
        <a
          href="#top"
          aria-label="Back to top"
          className="tc bg-inv text-inv-tx flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-serif text-[19px] italic no-underline"
        >
          Ru
        </a>
        <div className="navlinks flex min-w-0 gap-0.5 overflow-x-auto [scrollbar-width:none]">
          {links.map((s) => {
            const on = s.id === active;
            return (
              <a
                key={s.id}
                href={`#${s.id}`}
                aria-current={on ? "location" : undefined}
                className={`navlink inline-flex h-10 items-center rounded-full px-[15px] text-[13.5px] font-medium whitespace-nowrap no-underline ${
                  on ? "bg-inv text-inv-tx" : "text-mu hover:text-tx bg-transparent"
                }`}
              >
                {s.label}
              </a>
            );
          })}
        </div>
        <ThemeToggle />
      </nav>
    </div>
  );
}
