"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { instagram, photos, photoSrc } from "@/content/photos";
import { onOpenGallery, type GalleryView } from "@/lib/gallery";
import { lockScroll } from "@/lib/scroll";

const count = photos.length;

function columnsFor(w: number) {
  return w >= 1100 ? 4 : w >= 800 ? 3 : w >= 480 ? 2 : 1;
}
function subscribeResize(cb: () => void) {
  window.addEventListener("resize", cb, { passive: true });
  return () => window.removeEventListener("resize", cb);
}

const closeIcon = (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    aria-hidden="true"
  >
    <path d="M6 6l12 12" />
    <path d="M18 6L6 18" />
  </svg>
);
const chevron = (d: string) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d={d} />
  </svg>
);

// Full-screen photo gallery: every photo in a grid, or one at a time with arrows.
// Escape closes it, the arrow keys move between photos, and Tab stays inside.
export function Gallery() {
  const [view, setView] = useState<GalleryView | null>(null);
  const dialog = useRef<HTMLDivElement>(null);
  const returnTo = useRef<HTMLElement | null>(null);
  const cols = useSyncExternalStore(
    subscribeResize,
    () => columnsFor(window.innerWidth),
    () => 4,
  );
  const open = view !== null;

  useEffect(
    () =>
      onOpenGallery((v) => {
        if (!dialog.current) returnTo.current = document.activeElement as HTMLElement | null;
        setView(v);
      }),
    [],
  );

  useEffect(() => {
    if (!open) return;
    lockScroll(true);
    dialog.current?.querySelector<HTMLElement>('[aria-label="Close gallery"]')?.focus();
    return () => {
      lockScroll(false);
      const r = returnTo.current;
      returnTo.current = null;
      if (r && document.contains(r)) r.focus();
    };
  }, [open]);

  useEffect(() => {
    if (view === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setView(null);
        return;
      }
      if (typeof view === "number" && (e.key === "ArrowRight" || e.key === "ArrowLeft")) {
        e.preventDefault();
        setView((view + (e.key === "ArrowRight" ? 1 : -1) + count) % count);
        return;
      }
      if (e.key !== "Tab" || !dialog.current) return;
      const f = Array.from(dialog.current.querySelectorAll<HTMLElement>("button, a[href]"));
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (!dialog.current.contains(document.activeElement)) {
        e.preventDefault();
        first.focus();
      } else if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [view]);

  if (view === null) return null;

  const single = typeof view === "number";
  const cur = single ? photos[view] : null;
  // Photos are dealt across the columns in turn, so the grid reads left to right, newest first.
  const columns = Array.from({ length: cols }, (_, c) =>
    photos.map((p, i) => ({ p, i })).filter(({ i }) => i % cols === c),
  );

  return (
    <div
      ref={dialog}
      role="dialog"
      aria-modal="true"
      aria-label="Instagram photos"
      className="gfade fixed inset-0 z-280 flex flex-col bg-[rgba(8,9,11,0.94)] text-[#ededea] backdrop-blur-[10px]"
    >
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] px-7 py-5">
        <div className="flex flex-wrap items-baseline gap-3.5">
          <span className="font-serif text-[34px] leading-none">
            Shot on <span className="italic">iPhone</span>
          </span>
          <span className="font-mono text-xs tracking-[0.08em] opacity-60">
            @{instagram.handle.toUpperCase()} · {count} PHOTOS
          </span>
        </div>
        <div className="flex items-center gap-2">
          {single && (
            <button
              type="button"
              onClick={() => setView("grid")}
              className="h-[42px] cursor-pointer rounded-full border border-white/20 bg-transparent px-4 font-sans text-[13.5px] text-inherit"
            >
              All photos
            </button>
          )}
          <a
            href={instagram.url}
            target="_blank"
            data-umami-event="Open Instagram"
            rel="noopener noreferrer"
            className="inline-flex h-[42px] items-center rounded-full border border-white/20 px-4 text-[13.5px] no-underline"
          >
            Open Instagram ↗
          </a>
          <button
            type="button"
            onClick={() => setView(null)}
            aria-label="Close gallery"
            className="flex h-[42px] w-[42px] cursor-pointer items-center justify-center rounded-full border-0 bg-[#ededea] text-[#0b0c0e]"
          >
            {closeIcon}
          </button>
        </div>
      </div>

      {!single && (
        <div
          className="flex-auto overflow-y-auto overscroll-contain px-7 pt-6 pb-10"
          data-lenis-prevent
        >
          <div className="mx-auto flex max-w-[1240px] items-start gap-3.5">
            {columns.map((col, c) => (
              <div key={c} className="flex min-w-0 flex-1 flex-col gap-3.5">
                {col.map(({ p, i }) => (
                  <button
                    key={p.file}
                    type="button"
                    onClick={() => setView(i)}
                    aria-label={`Open photo ${i + 1}: ${p.caption}`}
                    className="gtile gpop relative m-0 block w-full cursor-zoom-in overflow-hidden rounded-[14px] border-0 bg-transparent p-0"
                    style={{ animationDelay: `${i * 40}ms`, aspectRatio: `${p.w} / ${p.h}` }}
                  >
                    <Image
                      quality={90}
                      src={photoSrc(p)}
                      alt={p.caption}
                      fill
                      sizes="(max-width: 480px) 100vw, (max-width: 800px) 50vw, (max-width: 1100px) 33vw, 310px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {single && cur && (
        <div className="gsingle flex min-h-0 flex-auto items-center justify-center gap-5 px-7 py-6">
          <button
            type="button"
            onClick={() => setView((view - 1 + count) % count)}
            aria-label="Previous photo"
            className="gnav flex h-[52px] w-[52px] shrink-0 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-transparent text-inherit"
          >
            {chevron("M15 6l-6 6 6 6")}
          </button>
          <figure
            key={cur.file}
            className="gpop gfig relative m-0 h-full max-h-[78vh] max-w-[72vw] overflow-hidden rounded-[18px]"
            style={{ aspectRatio: `${cur.w} / ${cur.h}` }}
          >
            <Image
              quality={90}
              src={photoSrc(cur)}
              alt={cur.caption}
              fill
              sizes="(max-width: 760px) 90vw, 60vw"
              priority
              className="object-cover"
            />
            <figcaption className="absolute right-0 bottom-0 left-0 flex justify-between gap-3 bg-gradient-to-b from-transparent to-black/55 px-[18px] py-4 text-[13.5px]">
              <span>{cur.caption}</span>
              <span className="font-mono opacity-80">
                {view + 1} / {count}
              </span>
            </figcaption>
          </figure>
          <button
            type="button"
            onClick={() => setView((view + 1) % count)}
            aria-label="Next photo"
            className="gnav flex h-[52px] w-[52px] shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-[#ededea] text-[#0b0c0e]"
          >
            {chevron("M9 6l6 6-6 6")}
          </button>
        </div>
      )}
    </div>
  );
}
