"use client";

import { useEffect, useState } from "react";
import { useNowPlaying } from "@/lib/live/use-now-playing";

function Eq() {
  return (
    <span className="eq flex items-end gap-0.5" aria-hidden="true" style={{ height: 14 }}>
      <span />
      <span />
      <span />
      <span />
    </span>
  );
}

// The pill at the bottom of the hero. Hidden until there's a song to show.
export function HeroSong() {
  const np = useNowPlaying();
  if (!np || np.status === "off") return null;
  const playing = np.status === "playing";

  return (
    <a
      href="#life"
      className="gfade herosong tc border-bd absolute bottom-[30px] inline-flex max-w-[calc(50%-80px)] items-center gap-3 rounded-full border py-2 pr-4 pl-2.5 no-underline backdrop-blur-[12px]"
      style={{ left: "max(24px, calc(50% - 590px))", background: "var(--nav-bg)" }}
    >
      <span className="flex w-[18px] pl-1">{playing ? <Eq /> : <SpotifyDot />}</span>
      <span className="flex min-w-0 flex-col gap-px">
        <span className="tc text-fa font-mono text-[9.5px] tracking-[0.12em]">
          {playing ? "NOW PLAYING ON SPOTIFY" : "LAST PLAYED ON SPOTIFY"}
        </span>
        <span className="truncate text-[13px] font-medium">
          {np.title} <span className="tc text-mu font-normal">· {np.artist}</span>
        </span>
      </span>
    </a>
  );
}

function SpotifyDot() {
  return <span aria-hidden="true" className="inline-block h-2 w-2 rounded-full bg-[#1DB954]" />;
}

// The song card in the Life section, with the cover and a progress bar while playing.
export function LifeSong() {
  const np = useNowPlaying();
  const playing = np?.status === "playing";
  const [elapsed, setElapsed] = useState(0);

  // Move the progress bar along between polls.
  useEffect(() => {
    if (!playing) return;
    const start = Date.now();
    const id = window.setInterval(() => setElapsed(Date.now() - start), 1000);
    return () => {
      window.clearInterval(id);
      setElapsed(0);
    };
  }, [playing, np]);

  if (!np || np.status === "off") return null;
  const progress = playing
    ? Math.min(1, (np.progressMs + elapsed) / Math.max(1, np.durationMs))
    : 0;

  return (
    <a
      href={np.url}
      target="_blank"
      rel="noopener noreferrer"
      className="gfade tc bg-sf border-bd flex max-w-[420px] items-center gap-3.5 rounded-[18px] border py-3 pr-4 pl-3 no-underline"
    >
      <span
        aria-hidden="true"
        className="relative flex h-[58px] w-[58px] shrink-0 items-center justify-center overflow-hidden rounded-[10px] bg-[#121614]"
      >
        {np.art && (
          // A tiny remote cover; Next's image optimiser isn't worth it here.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={np.art}
            alt=""
            width={58}
            height={58}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        {playing && (
          <span className="relative rounded-md bg-black/55 px-1.5 py-1">
            <Eq />
          </span>
        )}
      </span>
      <span className="flex min-w-0 flex-auto flex-col gap-1">
        <span className="tc text-fa font-mono text-[10px] tracking-[0.12em]">
          <span className="mr-1.5 inline-block h-[7px] w-[7px] rounded-full bg-[#1DB954]" />
          {playing ? "NOW PLAYING · SPOTIFY" : "LAST PLAYED · SPOTIFY"}
        </span>
        <span className="truncate text-base font-semibold">{np.title}</span>
        <span className="tc text-mu truncate text-[13px]">{np.artist}</span>
        {playing && (
          <span
            className="tc bg-bd mt-1 block h-[3px] overflow-hidden rounded-sm"
            aria-hidden="true"
          >
            <span
              className="block h-[3px] origin-left bg-[#1DB954] transition-transform duration-1000 ease-linear"
              style={{ transform: `scaleX(${progress})` }}
            />
          </span>
        )}
      </span>
      <span className="sr-only">(opens Spotify in a new tab)</span>
    </a>
  );
}
