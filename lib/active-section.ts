"use client";

import { useSyncExternalStore } from "react";
import { sections, type SectionId } from "@/content/site";

// Works out which home-page section the visitor is reading, for the navigation highlight.
// One scroll listener is shared by every component that asks.

const spyIds = sections
  .filter((s) => s.live && s.id !== "top" && s.id !== "contact")
  .map((s) => s.id);

let current: SectionId = "top";
const listeners = new Set<() => void>();
let queued = false;

function compute() {
  queued = false;
  const vh = window.innerHeight;
  const doc = document.scrollingElement ?? document.documentElement;
  const maxY = doc.scrollHeight - vh;
  const sheet = document.getElementById("sheet");
  let next: SectionId = "top";
  // The contact section sits underneath the sheet, so it's "current" once the sheet has mostly lifted away.
  if (
    maxY > 40 &&
    (window.scrollY >= maxY - 8 || (sheet && sheet.getBoundingClientRect().bottom < vh * 0.55))
  ) {
    next = "contact";
  } else {
    for (const id of spyIds) {
      const el = document.getElementById(id);
      if (el && el.getBoundingClientRect().top <= vh * 0.42) next = id;
    }
  }
  if (next !== current) {
    current = next;
    listeners.forEach((l) => l());
  }
}

function onScroll() {
  if (!queued) {
    queued = true;
    requestAnimationFrame(compute);
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1) {
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    onScroll();
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    }
  };
}

export function useActiveSection(): SectionId {
  return useSyncExternalStore(
    subscribe,
    () => current,
    () => "top",
  );
}
