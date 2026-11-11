import type { F1Data, FootballData, NowPlaying } from "./types";

// Stand-in data for tests and local development without API keys.
// Only used when LIVE_DATA_FIXTURES=1, which is never set on Vercel.

export const football: FootballData = {
  teamId: 66,
  next: { title: "vs Aston Villa", when: "Home · Mon 9 Nov, 3:00 AM Adelaide time" },
  then: "Then: Liverpool (away) Mon 23 Nov · Brentford (home) Sun 29 Nov",
  form: [
    { r: "L", score: "0–2", opp: "Chelsea" },
    { r: "L", score: "0–3", opp: "Bournemouth" },
    { r: "D", score: "1–1", opp: "Leeds" },
    { r: "W", score: "2–1", opp: "Spurs" },
    { r: "D", score: "1–1", opp: "Fulham" },
  ],
  table: [
    { pos: 1, teamId: 57, team: "Arsenal", played: 10, pts: 27 },
    { pos: 2, teamId: 65, team: "Man City", played: 10, pts: 21 },
    { pos: 3, teamId: 397, team: "Brighton Hove", played: 9, pts: 19 },
    { pos: 16, teamId: 351, team: "Nottingham", played: 10, pts: 9, gapBefore: true },
    { pos: 17, teamId: 1076, team: "Coventry", played: 10, pts: 9 },
    { pos: 18, teamId: 66, team: "Man United", played: 9, pts: 7 },
    { pos: 19, teamId: 354, team: "Crystal Palace", played: 9, pts: 7 },
    { pos: 20, teamId: 71, team: "Sunderland", played: 9, pts: 5 },
  ],
  asOf: "TEST DATA · KICK-OFFS IN ADELAIDE TIME",
};

export const f1: F1Data = {
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
  asOf: "TEST DATA",
};

export const nowPlaying: NowPlaying = {
  status: "playing",
  title: "Test Track",
  artist: "Test Artist",
  url: "https://open.spotify.com/",
  art: null,
  progressMs: 60_000,
  durationMs: 200_000,
};
