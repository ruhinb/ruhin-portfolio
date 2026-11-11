"use client";

import { useSyncExternalStore } from "react";
import type { NowPlaying } from "./types";

// One shared poll for every component that shows the song: every 30 seconds while the
// tab is visible, and straight away when it becomes visible again.
let data: NowPlaying | null = null;
let timer = 0;
const listeners = new Set<() => void>();

async function load() {
  try {
    const res = await fetch("/api/now-playing");
    if (res.ok) {
      data = (await res.json()) as NowPlaying;
      listeners.forEach((l) => l());
    }
  } catch {
    // Offline or blocked: keep whatever we had.
  }
}

function schedule() {
  window.clearInterval(timer);
  if (document.visibilityState === "visible") {
    load();
    timer = window.setInterval(load, 30_000);
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1) {
    schedule();
    document.addEventListener("visibilitychange", schedule);
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", schedule);
    }
  };
}

export function useNowPlaying() {
  return useSyncExternalStore(
    subscribe,
    () => data,
    () => null,
  );
}
