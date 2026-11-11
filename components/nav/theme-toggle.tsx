"use client";

import { useTheme } from "next-themes";
import { useId } from "react";
import { useMounted } from "@/lib/use-mounted";

// The sun/moon switch from the design. Its look follows the `dark` class on <html>
// (set before the page draws), so it never shows the wrong state while loading.
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();
  const dark = mounted && resolvedTheme === "dark";
  const maskId = "moon" + useId().replace(/[^a-zA-Z0-9]/g, "");
  const label = !mounted ? "Switch theme" : dark ? "Switch to light theme" : "Switch to dark theme";

  return (
    <button
      type="button"
      onClick={() => setTheme(dark ? "light" : "dark")}
      aria-label={label}
      title={mounted ? label : undefined}
      className="tc border-bd bg-sf relative h-10 w-16 shrink-0 cursor-pointer rounded-full border p-0"
    >
      <span
        aria-hidden="true"
        className="bg-tx absolute top-[11px] left-3 h-[3px] w-[3px] rounded-full opacity-0 transition-opacity duration-500 dark:opacity-100"
      />
      <span
        aria-hidden="true"
        className="bg-tx absolute top-6 left-[19px] h-0.5 w-0.5 rounded-full opacity-0 transition-opacity delay-100 duration-500 dark:opacity-100"
      />
      <span
        aria-hidden="true"
        className="bg-accent absolute top-[5px] left-[5px] flex h-7 w-7 items-center justify-center rounded-full text-white dark:translate-x-6 dark:bg-[#262c38] dark:text-[#f3e9c6]"
        style={{
          transition:
            "transform .6s cubic-bezier(.65,0,.25,1.25), background-color .5s ease, color .5s ease",
        }}
      >
        <svg
          width="17"
          height="17"
          viewBox="0 0 24 24"
          className="rotate-90 dark:-rotate-[25deg]"
          style={{ transition: "transform .7s cubic-bezier(.65,0,.25,1)" }}
        >
          <mask id={maskId}>
            <rect width="24" height="24" fill="white" />
            <circle
              cx="30"
              cy="-6"
              r="8"
              fill="black"
              className="[cx:30px] [cy:-6px] dark:[cx:17px] dark:[cy:7px]"
              style={{ transition: "cx .6s ease, cy .6s ease" }}
            />
          </mask>
          <circle
            cx="12"
            cy="12"
            r="5"
            fill="currentColor"
            mask={`url(#${maskId})`}
            className="[r:5px] dark:[r:8px]"
            style={{ transition: "r .6s ease" }}
          />
          <g
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="origin-center scale-100 opacity-100 dark:scale-[0.4] dark:opacity-0"
            style={{
              transformBox: "view-box",
              transformOrigin: "12px 12px",
              transition: "opacity .4s ease, transform .6s ease",
            }}
          >
            <path d="M12 1.5v2.5M12 20v2.5M1.5 12h2.5M20 12h2.5M4.6 4.6l1.8 1.8M17.6 17.6l1.8 1.8M4.6 19.4l1.8-1.8M17.6 6.4l1.8-1.8" />
          </g>
        </svg>
      </span>
    </button>
  );
}
