"use client";

import type { ReactNode } from "react";
import { site } from "@/content/site";
import { openResume } from "@/lib/resume";

// Opens the resume viewer. Hidden until the web copy of the resume is in place.
export function ResumeButton({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) {
  if (!site.resume.ready) return null;
  return (
    <button type="button" aria-haspopup="dialog" onClick={openResume} className={className}>
      {children ?? "Resume"}
    </button>
  );
}
