"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { site } from "@/content/site";
import { onOpenResume } from "@/lib/resume";
import { lockScroll } from "@/lib/scroll";

// Full-screen resume viewer: the page as an image, plus a Download PDF button.
// Escape closes it, Tab stays inside it, and focus goes back to the button that opened it.
export function ResumeViewer() {
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const returnTo = useRef<HTMLElement | null>(null);

  useEffect(
    () =>
      onOpenResume(() => {
        returnTo.current = document.activeElement as HTMLElement | null;
        setOpen(true);
      }),
    [],
  );

  useEffect(() => {
    if (!open) return;
    lockScroll(true);
    closeBtn.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
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
    return () => {
      document.removeEventListener("keydown", onKey);
      lockScroll(false);
      const r = returnTo.current;
      returnTo.current = null;
      if (r && document.contains(r)) r.focus();
    };
  }, [open]);

  if (!open || !site.resume.ready) return null;

  return (
    <div
      ref={dialog}
      role="dialog"
      aria-modal="true"
      aria-label="Resume"
      className="gfade fixed inset-0 z-285 flex flex-col bg-[rgba(8,9,11,0.94)] text-[#ededea] backdrop-blur-[10px]"
    >
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] px-7 py-5">
        <div className="flex flex-wrap items-baseline gap-3.5">
          <span className="font-serif text-[34px] leading-none italic">Resume</span>
          <span className="font-mono text-xs tracking-[0.08em] opacity-60">
            RUBAIYAT (RU) RUHIN · 1 PAGE
          </span>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={site.resume.pdf}
            download="Rubaiyat-Ruhin-Resume.pdf"
            className="inline-flex h-[42px] items-center gap-2 rounded-full border border-white/20 px-4 text-[13.5px] no-underline"
          >
            Download PDF
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
              <path d="M12 4v12" />
              <path d="M6 11l6 6 6-6" />
              <path d="M5 20h14" />
            </svg>
          </a>
          <button
            ref={closeBtn}
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close resume"
            className="flex h-[42px] w-[42px] cursor-pointer items-center justify-center rounded-full border-0 bg-[#ededea] text-[#0b0c0e]"
          >
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
          </button>
        </div>
      </div>
      <div
        className="flex-auto overflow-y-auto overscroll-contain px-4 pt-7 pb-12"
        data-lenis-prevent
      >
        <Image
          quality={90}
          src={site.resume.image}
          alt="Resume of Rubaiyat (Ru) Ruhin, Data Analyst in Adelaide: summary, skills, experience, projects and education"
          width={1654}
          height={2339}
          sizes="(max-width: 900px) 100vw, 860px"
          className="gpop mx-auto block h-auto w-full max-w-[860px] rounded-md bg-white shadow-[0_30px_80px_rgba(0,0,0,0.45)]"
          priority
        />
      </div>
    </div>
  );
}
