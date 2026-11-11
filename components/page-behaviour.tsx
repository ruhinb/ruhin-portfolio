"use client";

import { useEffect } from "react";
import { scrollToY } from "@/lib/scroll";

// In-page links (#about, #contact…) are handled here on every device.
// The hero and contact sections are sticky, so the browser's own jump can't find them.
// After scrolling, focus moves to the section so keyboard and screen-reader users land there too.
export function PageBehaviour() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const a = (e.target as Element | null)?.closest?.('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute("href")!.slice(1);
      const el = id ? document.getElementById(id) : null;
      if (id && !el) return;
      e.preventDefault();
      const doc = document.scrollingElement ?? document.documentElement;
      if (!el || id === "top" || id === "main") scrollToY(0);
      else if (id === "contact") scrollToY(doc.scrollHeight);
      else scrollToY(el.getBoundingClientRect().top + window.scrollY - 10);
      const target = el ?? document.getElementById("top");
      if (target) {
        if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
