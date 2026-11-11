// Dates and times for the live cards, always in Adelaide time.
const TZ = "Australia/Adelaide";

const part = (d: Date, opts: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("en-AU", { timeZone: TZ, ...opts }).format(d);

/** "Mon 9 Nov" */
export const dayMonth = (d: Date) =>
  `${part(d, { weekday: "short" })} ${part(d, { day: "numeric" })} ${part(d, { month: "short" })}`;

/** "3:00 AM" */
export const clock = (d: Date) =>
  part(d, { hour: "numeric", minute: "2-digit", hour12: true }).replace(
    /\s?([ap])\.?m\.?/i,
    (_, p) => ` ${p.toUpperCase()}M`,
  );

/** "11 NOV, 9:40 PM" */
export const stamp = (d: Date) =>
  `${part(d, { day: "numeric" })} ${part(d, { month: "short" }).toUpperCase()}, ${clock(d)}`;

/** "1 NOV" */
export const shortDate = (d: Date) =>
  `${part(d, { day: "numeric" })} ${part(d, { month: "short" }).toUpperCase()}`;
