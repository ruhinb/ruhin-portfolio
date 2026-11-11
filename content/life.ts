// Data for the Manchester United and Formula 1 cards in the Life section.
// These are snapshots from the design; stage 5 replaces them with live data
// fetched by the site's own server routes, in exactly these shapes.

export type Result = "W" | "D" | "L";

export type FootballData = {
  next: { title: string; when: string } | null;
  then: string;
  form: { r: Result; score: string; opp: string }[];
  table: { pos: number; team: string; played: number; pts: number; gapBefore?: boolean }[];
  team: string;
  asOf: string;
};

export type F1Data = {
  season: string;
  lastLabel: string;
  podium: { pos: string; name: string; team: string }[];
  next: string;
  then: string;
  standings: { pos: string; name: string; team: string; pts: number }[];
  constructors: string;
  asOf: string;
};

export const footballSnapshot: FootballData = {
  team: "Manchester United",
  next: { title: "vs Aston Villa", when: "Home · Mon 9 Nov, 3:00 AM Adelaide time" },
  then: "Then: Liverpool (away) Mon 23 Nov · Brentford (home) Sun 29 Nov",
  form: [
    { r: "L", score: "0–2", opp: "Chelsea" },
    { r: "L", score: "0–3", opp: "B'mouth" },
    { r: "D", score: "1–1", opp: "Leeds" },
    { r: "D", score: "1–1", opp: "Spurs" },
    { r: "D", score: "1–1", opp: "Fulham" },
  ],
  table: [
    { pos: 1, team: "Arsenal", played: 10, pts: 27 },
    { pos: 2, team: "Manchester City", played: 10, pts: 21 },
    { pos: 3, team: "Brighton", played: 9, pts: 19 },
    { pos: 16, team: "Nottingham Forest", played: 10, pts: 9, gapBefore: true },
    { pos: 17, team: "Coventry City", played: 10, pts: 9 },
    { pos: 18, team: "Manchester United", played: 9, pts: 7 },
    { pos: 19, team: "Crystal Palace", played: 9, pts: 7 },
    { pos: 20, team: "Sunderland", played: 9, pts: 5 },
  ],
  asOf: "SNAPSHOT · 8 NOV 2026 · KICK-OFFS IN ADELAIDE TIME",
};

export const f1Snapshot: F1Data = {
  season: "2026",
  lastLabel: "LAST RACE · MEXICO CITY GP · 1 NOV",
  podium: [
    { pos: "P1", name: "Max Verstappen", team: "Red Bull" },
    { pos: "P2", name: "Lewis Hamilton", team: "Ferrari" },
    { pos: "P3", name: "Kimi Antonelli", team: "Mercedes" },
  ],
  next: "São Paulo GP · Sun 8 Nov",
  then: "Then Las Vegas → Qatar → Abu Dhabi to close the season",
  standings: [
    { pos: "1", name: "Kimi Antonelli", team: "Mercedes", pts: 380 },
    { pos: "2", name: "Max Verstappen", team: "Red Bull", pts: 261 },
    { pos: "3", name: "Lewis Hamilton", team: "Ferrari", pts: 259 },
    { pos: "4", name: "George Russell", team: "Mercedes", pts: 250 },
    { pos: "5", name: "Charles Leclerc", team: "Ferrari", pts: 245 },
  ],
  constructors: "Constructors: Mercedes 630 · Ferrari 504 · Red Bull 382",
  asOf: "SNAPSHOT · AFTER MEXICO CITY GP, 1 NOV 2026",
};
