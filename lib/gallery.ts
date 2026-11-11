"use client";

import { track } from "./analytics";

// Opens the photo gallery from anywhere on the page: a photo number, or "grid" for all.
const EVENT = "ru:open-gallery";
export type GalleryView = number | "grid";

export function openGallery(view: GalleryView) {
  track("Open photo gallery", { view: view === "grid" ? "all photos" : "single photo" });
  window.dispatchEvent(new CustomEvent<GalleryView>(EVENT, { detail: view }));
}

export function onOpenGallery(handler: (view: GalleryView) => void) {
  const fn = (e: Event) => handler((e as CustomEvent<GalleryView>).detail);
  window.addEventListener(EVENT, fn);
  return () => window.removeEventListener(EVENT, fn);
}
