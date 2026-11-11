"use client";

import Image from "next/image";
import { instagram, photos, photoSrc } from "@/content/photos";
import { openGallery } from "@/lib/gallery";

// The Instagram panel: three latest photos (the third doubles as "+12 more") and two buttons.
export function PhotoPreview() {
  const preview = photos.slice(0, 3);
  const extra = photos.length - 3;

  return (
    <div className="lpanel flex w-[min(720px,86vw)] shrink-0 flex-col gap-[18px]">
      <div className="lhead flex items-center justify-between gap-3">
        <div className="flex flex-col gap-1.5">
          <span className="tc text-fa font-mono text-[11px] tracking-[0.1em]">INSTAGRAM</span>
          <h3 className="m-0 font-serif text-5xl leading-none font-normal">
            Shot on <span className="italic">iPhone</span>
          </h3>
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          <button
            type="button"
            aria-haspopup="dialog"
            onClick={() => openGallery("grid")}
            data-mag
            className="tc bg-inv text-inv-tx inline-flex h-11 cursor-pointer items-center gap-2 rounded-full border-0 px-[18px] font-sans text-sm font-medium"
          >
            See all {photos.length} photos
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
              <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
            </svg>
          </button>
          <a
            href={instagram.url}
            target="_blank"
            data-umami-event="Open Instagram"
            rel="noopener noreferrer"
            data-mag
            className="tc border-bd2 inline-flex h-11 items-center rounded-full border px-4 text-sm font-medium no-underline"
          >
            @{instagram.handle} ↗
          </a>
        </div>
      </div>
      <div className="grid min-h-0 flex-auto grid-cols-3 gap-3 max-[759px]:aspect-[3/1.35]">
        {preview.map((p, i) => {
          const more = i === 2 && extra > 0;
          return (
            <button
              key={p.file}
              type="button"
              aria-haspopup="dialog"
              aria-label={
                more ? `See all ${photos.length} photos` : `Open photo ${i + 1}: ${p.caption}`
              }
              onClick={() => openGallery(more ? "grid" : i)}
              className="gtile relative min-h-[160px] cursor-zoom-in overflow-hidden rounded-[18px] border-0 bg-transparent p-0"
            >
              <Image
                quality={90}
                src={photoSrc(p)}
                alt={p.caption}
                fill
                sizes="(max-width: 760px) 50vw, 540px"
                className="object-cover"
              />
              {more && (
                <span className="absolute inset-0 flex items-center justify-center bg-[rgba(11,13,16,0.55)] font-serif text-[40px] text-white">
                  +{extra}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
