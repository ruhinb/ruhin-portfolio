"use client";

import { useState } from "react";
import { site } from "@/content/site";
import { useMounted } from "@/lib/use-mounted";

const address = `${site.email.user}@${site.email.domain}`;

// The email link and its Copy button. The address is split in the page's HTML and the
// mailto link is only added in the browser, which keeps simple spam scrapers away.
export function Email() {
  const mounted = useMounted();
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(address);
    } catch {
      // Older browsers, or the clipboard permission was refused.
      const ta = document.createElement("textarea");
      ta.value = address;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <a
        href={mounted ? `mailto:${address}` : undefined}
        className="email font-serif text-[clamp(26px,3vw,40px)] [overflow-wrap:anywhere] underline decoration-1 underline-offset-8"
      >
        {site.email.user}
        <span>@</span>
        {site.email.domain}
      </a>
      <button
        type="button"
        onClick={copy}
        className={`tc h-10 cursor-pointer rounded-full border px-4 font-sans text-[13px] font-medium ${
          copied ? "bg-accent border-accent text-[#0b0d10]" : "border-bd2 text-tx bg-transparent"
        }`}
      >
        {copied ? "Copied ✓" : "Copy"}
      </button>
      <span role="status" className="sr-only">
        {copied ? "Email address copied" : ""}
      </span>
    </div>
  );
}
