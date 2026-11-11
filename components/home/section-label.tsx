// The small numbered label above each section heading, e.g. "02 — EXPERIENCE".
export function SectionLabel({
  n,
  children,
  reveal = true,
}: {
  n: string;
  children: string;
  reveal?: boolean;
}) {
  return (
    <span className={`${reveal ? "rv " : ""}tc text-fa font-mono text-xs tracking-[0.1em]`}>
      {n} — {children.toUpperCase()}
    </span>
  );
}
