// Custom events for Umami (visitor stats). Safe to call anywhere: it does nothing when
// the stats script isn't loaded (local work, previews, ad blockers, Do Not Track).
//
// Links that open in a new tab can use data-umami-event="…" instead. Same-tab links and
// buttons call track() from their click handler, because Umami's automatic link tracking
// reloads the page, which would break the case-study transition and the PDF download.
type EventData = Record<string, string | number>;
type Umami = { track: (event: string, data?: EventData) => void };

export function track(event: string, data?: EventData) {
  try {
    (window as unknown as { umami?: Umami }).umami?.track(event, data);
  } catch {
    // Stats must never break the page.
  }
}
