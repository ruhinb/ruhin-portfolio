"use client";

import { useEffect, useRef } from "react";
import { track } from "@/lib/analytics";

// An invisible marker after the last section of a case study. When a reader scrolls
// down to it, Umami records "Read case study to end" once for that visit to the page.
export function ReadToEnd({ project }: { project: string }) {
  const el = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = el.current;
    if (!node || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        track("Read case study to end", { project });
        io.disconnect();
      }
    });
    io.observe(node);
    return () => io.disconnect();
  }, [project]);

  return <div ref={el} aria-hidden="true" className="h-px" />;
}
