"use client";

import Link from "next/link";
import { useEffect } from "react";

// Shown if part of a page fails while loading in the browser, instead of a blank screen.
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main
      id="main"
      className="mx-auto flex min-h-dvh max-w-3xl flex-col items-start justify-center gap-6 px-6"
    >
      <p className="text-fa font-mono text-xs tracking-[0.12em]">SOMETHING WENT WRONG</p>
      <h1 className="font-serif text-[clamp(48px,8vw,96px)] leading-none font-normal">
        That didn&apos;t <span className="italic">load</span>.
      </h1>
      <p className="text-mu text-lg">
        A part of this page failed to load. Trying again usually fixes it.
      </p>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={reset}
          className="bg-inv text-inv-tx inline-flex h-12 cursor-pointer items-center rounded-full border-0 px-6 font-sans text-sm font-medium"
        >
          Try again
        </button>
        <Link
          href="/"
          className="border-bd2 inline-flex h-12 items-center rounded-full border px-6 text-sm font-medium no-underline"
        >
          Back to the home page
        </Link>
      </div>
    </main>
  );
}
