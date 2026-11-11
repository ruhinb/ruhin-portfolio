"use client";

import { useEffect } from "react";

// For browsers without native scroll timelines (Firefox, Safari before 26), this gives
// the same scroll-linked effects with GSAP. GSAP is only downloaded in those browsers.
// Tests can force this path by putting `motion-js` on <html>.
export function ScrollFallback() {
  useEffect(() => {
    const forced = document.documentElement.classList.contains("motion-js");
    if (!forced && CSS.supports("animation-timeline: view()")) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let revert: (() => void) | undefined;
    let cancelled = false;

    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      const vh = () => window.innerHeight;

      const ctx = gsap.context(() => {
        const scrub = (trigger: Element, start: string, end: string | (() => string)) => ({
          scrollTrigger: { trigger, start, end, scrub: true },
        });

        // Page-scroll effects, measured in pixels from the top.
        const byPage = (sel: string, end: number, from: gsap.TweenVars, to: gsap.TweenVars) =>
          gsap.utils.toArray<Element>(sel).forEach((el) =>
            gsap.fromTo(el, from, {
              ...to,
              ease: "none",
              scrollTrigger: { start: 0, end, scrub: true },
            }),
          );

        byPage(
          ".heroout",
          760,
          { opacity: 1, scale: 1, y: 0, filter: "blur(0px)" },
          { opacity: 0.15, scale: 0.9, y: -40, filter: "blur(5px)" },
        );
        if (window.innerWidth >= 760) {
          byPage(
            ".navshrink",
            240,
            { boxShadow: "0 0 0 rgba(0,0,0,0)", y: 6 },
            { boxShadow: "0 10px 40px rgba(0,0,0,0.12)", y: 0 },
          );
        }
        byPage(
          ".sheetin",
          700,
          { borderRadius: "56px 56px 0px 0px" },
          { borderRadius: "28px 28px 0px 0px" },
        );

        // Effects tied to an element coming into view.
        gsap.utils
          .toArray<Element>(".rv")
          .forEach((el) =>
            gsap.fromTo(
              el,
              { opacity: 0, y: 56 },
              { opacity: 1, y: 0, ease: "none", ...scrub(el, "top bottom", "70% bottom") },
            ),
          );
        gsap.utils.toArray<Element>(".mask").forEach((mask) => {
          const line = mask.querySelector(".mline");
          if (line)
            gsap.fromTo(
              line,
              { yPercent: 108, rotate: 2.5 },
              { yPercent: 0, rotate: 0, ease: "none", ...scrub(mask, "10% bottom", "90% bottom") },
            );
        });
        gsap.utils.toArray<HTMLElement>(".word").forEach((el) =>
          gsap.fromTo(
            el,
            { opacity: 0.14 },
            {
              opacity: 1,
              ease: "none",
              ...scrub(el, "30% bottom", () => `top+=${0.45 * (vh() + el.offsetHeight)} bottom`),
            },
          ),
        );
        gsap.utils.toArray<Element>(".portrait").forEach((el) =>
          gsap.fromTo(
            el,
            { clipPath: "inset(12% 14% 12% 14% round 240px)" },
            {
              clipPath: "inset(0% 0% 0% 0% round 24px)",
              ease: "none",
              ...scrub(el, "top bottom", "center center"),
            },
          ),
        );
        gsap.utils
          .toArray<Element>(".par")
          .forEach((el) =>
            gsap.fromTo(
              el,
              { yPercent: -7, scale: 1.08 },
              { yPercent: 7, scale: 1.08, ease: "none", ...scrub(el, "top bottom", "bottom top") },
            ),
          );
        gsap.utils.toArray<HTMLElement>(".bigtalk").forEach((el) =>
          gsap.fromTo(
            el,
            { scale: 0.72, y: 40, opacity: 0.2 },
            {
              scale: 1,
              y: 0,
              opacity: 1,
              ease: "none",
              ...scrub(el, "top bottom", () => `top+=${0.6 * (vh() + el.offsetHeight)} bottom`),
            },
          ),
        );

        // Project cards: each one shrinks and dims as the next slides up over it.
        // "contain 55%" = the next card's top has travelled 55% of the way from (vh - h) to 0.
        const cards = gsap.utils.toArray<HTMLElement>(".stackcard");
        if (window.innerWidth >= 900) {
          cards.forEach((card, i) => {
            const nextCard = cards[i + 1];
            if (!nextCard) return;
            const end = () => `top ${Math.max(0, 0.45 * (vh() - nextCard.offsetHeight))}px`;
            gsap.fromTo(
              card,
              { scale: 1 },
              { scale: 0.92, ease: "none", ...scrub(nextCard, "top bottom", end) },
            );
            const dim = card.querySelector(".dimv");
            if (dim)
              gsap.fromTo(
                dim,
                { opacity: 0 },
                { opacity: 0.72, ease: "none", ...scrub(nextCard, "top bottom", end) },
              );
          });
        }

        // Case study images open out as they come into view.
        gsap.utils.toArray<HTMLElement>(".imgin").forEach((el) =>
          gsap.fromTo(
            el,
            { clipPath: "inset(14% 8% 14% 8% round 28px)", scale: 1.06 },
            {
              clipPath: "inset(0% 0% 0% 0% round 20px)",
              scale: 1,
              ease: "none",
              ...scrub(el, "top bottom", () => `top+=${0.45 * (vh() + el.offsetHeight)} bottom`),
            },
          ),
        );

        // Reading progress bar on case studies.
        gsap.utils
          .toArray<HTMLElement>(".progress")
          .forEach((el) =>
            gsap.fromTo(
              el,
              { scaleX: 0 },
              { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: true } },
            ),
          );
      });
      revert = () => ctx.revert();
    })();

    return () => {
      cancelled = true;
      revert?.();
    };
  }, []);

  return null;
}
