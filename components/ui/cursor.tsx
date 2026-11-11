"use client";

import { useEffect, useRef } from "react";

const TRAIL = 14;

// The design's cursor: a small white dot (inverted against whatever is under it) with a
// fading trail, which grows over links and buttons. Buttons marked `data-mag` lean towards it.
// Only for a mouse or trackpad, and never when the visitor asks for less motion.
export function Cursor() {
  const dotRef = useRef<HTMLSpanElement>(null);
  const trailRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduce.matches) return;

    const root = document.documentElement;
    root.classList.add("curon");
    const dot = dotRef.current!;
    const trail = trailRefs.current;
    const mouse = { x: -200, y: -200, seen: false };
    const pts = Array.from({ length: TRAIL }, () => ({ x: -200, y: -200 }));
    let raf = 0;

    let mags: HTMLElement[] = [];
    const refreshMags = () =>
      (mags = Array.from(document.querySelectorAll<HTMLElement>("[data-mag]")));
    refreshMags();
    const magTimer = window.setInterval(refreshMags, 1500);

    const tick = () => {
      if (mouse.seen) {
        dot.style.opacity = "1";
        dot.style.transform = `translate3d(${mouse.x}px,${mouse.y}px,0)`;
      }
      let px = mouse.x;
      let py = mouse.y;
      let far = 0;
      for (let i = 0; i < TRAIL; i++) {
        const p = pts[i];
        p.x += (px - p.x) * 0.42;
        p.y += (py - p.y) * 0.42;
        const dist = Math.hypot(p.x - mouse.x, p.y - mouse.y);
        if (dist > far) far = dist;
        const el = trail[i];
        if (el && mouse.seen) {
          el.style.transform = `translate3d(${p.x.toFixed(1)}px,${p.y.toFixed(1)}px,0)`;
          el.style.opacity = dist > 2 ? (0.2 * (1 - i / TRAIL)).toFixed(3) : "0";
        }
        px = p.x;
        py = p.y;
      }
      // Rest once the trail has caught up; the next mouse move wakes it again.
      raf = far < 0.5 ? 0 : requestAnimationFrame(tick);
    };
    const wake = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      if (!mouse.seen) {
        mouse.seen = true;
        pts.forEach((p) => {
          p.x = mouse.x;
          p.y = mouse.y;
        });
      }
      for (const el of mags) {
        const r = el.getBoundingClientRect();
        const dx = mouse.x - (r.left + r.width / 2);
        const dy = mouse.y - (r.top + r.height / 2);
        const reach = Math.max(r.width, r.height) * 0.75 + 24;
        if (Math.abs(dx) < reach && Math.abs(dy) < reach) {
          el.style.transform = `translate(${(dx * 0.28).toFixed(1)}px,${(dy * 0.38).toFixed(1)}px)`;
        } else if (el.style.transform) {
          el.style.transform = "";
        }
      }
      wake();
    };
    const onOver = (e: MouseEvent) => {
      const hit = (e.target as Element | null)?.closest?.("a, button, [role=tab], summary, label");
      dot.classList.toggle("big", !!hit);
    };
    const onLeave = () => {
      mouse.seen = false;
      dot.style.opacity = "0";
      trail.forEach((el) => el && (el.style.opacity = "0"));
    };

    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });
    root.addEventListener("mouseleave", onLeave);

    return () => {
      root.classList.remove("curon");
      cancelAnimationFrame(raf);
      window.clearInterval(magTimer);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      root.removeEventListener("mouseleave", onLeave);
      mags.forEach((el) => (el.style.transform = ""));
    };
  }, []);

  return (
    <div aria-hidden="true" className="curlayer pointer-events-none fixed inset-0 z-300">
      {Array.from({ length: TRAIL }, (_, i) => {
        const size = Math.max(3, 10 - i * 0.5);
        return (
          <span
            key={i}
            ref={(el) => {
              trailRefs.current[i] = el;
            }}
            className="bg-tx fixed top-0 left-0 rounded-full opacity-0 will-change-transform"
            style={{
              width: size,
              height: size,
              margin: `${-size / 2}px 0 0 ${-size / 2}px`,
              transform: "translate3d(-200px,-200px,0)",
            }}
          />
        );
      })}
      <span
        ref={dotRef}
        className="curdot fixed top-0 left-0 -mt-1.5 -ml-1.5 h-3 w-3 rounded-full bg-white opacity-0 mix-blend-difference will-change-transform"
        style={{ transform: "translate3d(-200px,-200px,0)" }}
      />
    </div>
  );
}
