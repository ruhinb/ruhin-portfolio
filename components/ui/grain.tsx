// A faint film-grain texture over the whole page, as in the design.
export function Grain() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-250"
      style={{ opacity: "var(--grain)", mixBlendMode: "var(--grain-blend)" as never }}
    >
      <svg width="100%" height="100%" className="block">
        <filter id="grainf">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves={2}
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grainf)" />
      </svg>
    </div>
  );
}
