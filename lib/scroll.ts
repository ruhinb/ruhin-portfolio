// Smoothly scrolls the page to a position. Lenis takes this over in stage 4.
export function scrollToY(y: number) {
  const doc = document.scrollingElement ?? document.documentElement;
  const maxY = Math.max(0, doc.scrollHeight - window.innerHeight);
  const top = Math.max(0, Math.min(maxY, y));
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
}

// Locks page scrolling while an overlay is open.
export function lockScroll(locked: boolean) {
  document.documentElement.style.overflow = locked ? "hidden" : "";
}
