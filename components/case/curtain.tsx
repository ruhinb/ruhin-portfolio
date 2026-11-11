"use client";

import { useLayoutEffect, useRef, useSyncExternalStore } from "react";

const key = (slug: string) => `ru_case_${slug}`;
const read = (slug: string) => {
  try {
    return window.sessionStorage.getItem(key(slug)) === "1";
  } catch {
    return false;
  }
};
const noop = () => () => {};

// On a full page load this runs before the page draws: if the curtain has already
// played for this case study, it's hidden straight away and the intro skips its delay.
const preload = (slug: string) =>
  `try{var q=sessionStorage.getItem('${key(slug)}')==='1';var c=document.currentScript.previousElementSibling;if(q){c.style.display='none';document.documentElement.setAttribute('data-case-quick','')}else{document.documentElement.removeAttribute('data-case-quick')}}catch(e){}`;

// The title card that lifts away the first time each case study is opened in a session.
export function Curtain({ slug, t1, t2 }: { slug: string; t1: string; t2: string }) {
  // Read once per visit, so marking it as seen doesn't hide it mid-animation.
  const first = useRef<boolean | null>(null);
  const seen = useSyncExternalStore(
    noop,
    () => (first.current ??= read(slug)),
    () => false,
  );

  // Arriving by a link inside the site (no full load), the script above doesn't run.
  useLayoutEffect(() => {
    const root = document.documentElement;
    if (seen) root.setAttribute("data-case-quick", "");
    else root.removeAttribute("data-case-quick");
  }, [seen]);

  const markSeen = () => {
    try {
      window.sessionStorage.setItem(key(slug), "1");
    } catch {}
  };

  if (seen) return null;
  return (
    <>
      <div
        aria-hidden="true"
        onAnimationEnd={(e) => e.target === e.currentTarget && markSeen()}
        className="curtain bg-inv text-inv-tx pointer-events-none fixed inset-0 z-200 box-border flex items-end p-9"
      >
        <span className="block overflow-hidden font-serif text-[clamp(48px,8vw,120px)] leading-none">
          <span className="lname">
            {t1} <span className="italic">{t2}</span>
          </span>
        </span>
      </div>
      <script dangerouslySetInnerHTML={{ __html: preload(slug) }} />
    </>
  );
}
