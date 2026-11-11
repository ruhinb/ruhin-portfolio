// The opening screen: name line, a count to 100 and a progress bar, then it lifts away.
// Pure CSS, so it starts before any JavaScript loads. It's hidden on repeat visits in
// the same browser session by the `intro-seen` class (see components/intro-script.tsx).
export function Loader() {
  return (
    <div
      className="loader bg-inv text-inv-tx pointer-events-none fixed inset-0 z-400 box-border flex flex-col justify-between px-9 py-8"
      aria-hidden="true"
    >
      <div className="flex justify-between font-mono text-xs tracking-[0.1em] opacity-70">
        <span>RUBAIYAT RUHIN</span>
        <span>DATA ANALYST · AUSTRALIA</span>
      </div>
      <div className="flex items-end justify-between gap-6">
        <span className="block overflow-hidden font-serif text-[clamp(48px,7vw,104px)] leading-none">
          <span className="lname">
            Turning data into <span className="italic">decisions</span>
          </span>
        </span>
        <span className="font-serif text-[clamp(64px,9vw,140px)] leading-[0.85] tabular-nums">
          <span className="count" />
          <span className="text-[0.4em]">%</span>
        </span>
      </div>
      <span className="block h-px bg-[rgba(127,127,127,0.35)]">
        <span className="lbar bg-accent block h-px" />
      </span>
    </div>
  );
}
