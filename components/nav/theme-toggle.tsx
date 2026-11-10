"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

// Stage 1 placeholder. The animated sun/moon toggle from the design replaces this in stage 2.
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  // The theme is only known in the browser, so render a neutral label on the server.
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const dark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(dark ? "light" : "dark")}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      className="border-bd2 text-tx hover:bg-sf2 inline-flex h-10 items-center gap-2 rounded-full border px-4 font-mono text-xs tracking-[0.08em] transition-colors"
    >
      <span aria-hidden="true" className="bg-accent h-2 w-2 rounded-full" />
      {mounted ? (dark ? "LIGHT" : "DARK") : "THEME"}
    </button>
  );
}
