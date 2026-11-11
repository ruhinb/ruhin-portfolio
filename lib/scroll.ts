import type Lenis from "lenis";

// The smooth-scroll engine, when it's running (desktop with a mouse or trackpad).
let lenis: Lenis | null = null;
export function setLenis(instance: Lenis | null) {
  lenis = instance;
}

// Smoothly scrolls the page to a position.
export function scrollToY(y: number) {
  const doc = document.scrollingElement ?? document.documentElement;
  const maxY = Math.max(0, doc.scrollHeight - window.innerHeight);
  const top = Math.max(0, Math.min(maxY, y));
  if (lenis) {
    lenis.scrollTo(top, { duration: 1.2 });
    return;
  }
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
}

// Locks page scrolling while an overlay is open.
export function lockScroll(locked: boolean) {
  document.documentElement.style.overflow = locked ? "hidden" : "";
  if (locked) lenis?.stop();
  else lenis?.start();
}
