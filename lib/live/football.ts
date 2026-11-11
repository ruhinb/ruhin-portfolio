import { clock, dayMonth, stamp } from "./format";
import type { FootballData, Result } from "./types";

// Manchester United, from football-data.org's free tier (Premier League and Champions League).
// Two requests per refresh: the league table, then United's matches around today.
const API = "https://api.football-data.org/v4";
const TLA = "MUN";
const REVALIDATE = 900; // seconds; well under the free tier's 10 requests a minute

type Team = { id: number; name: string; shortName: string; tla: string };
type Match = {
  utcDate: string;
  status: string;
  homeTeam: Team;
  awayTeam: Team;
  score: { fullTime: { home: number | null; away: number | null } };
};
type Standings = {
  standings: {
    type: string;
    table: { position: number; team: Team; playedGames: number; points: number }[];
  }[];
};

const ymd = (d: Date) => d.toISOString().slice(0, 10);

/** Turns the API's standings and matches into the card's shape. Pure, so it can be tested. */
export function parseFootball(
  standings: Standings,
  matches: { matches: Match[] },
  now: Date,
): FootballData | null {
  const table = standings.standings.find((s) => s.type === "TOTAL")?.table ?? [];
  const meIndex = table.findIndex((r) => r.team.tla === TLA);
  if (meIndex < 0) return null;
  const me = table[meIndex].team;

  // Top three, then two either side of United.
  const picks = new Set([0, 1, 2]);
  for (let i = meIndex - 2; i <= meIndex + 2; i++) if (i >= 0 && i < table.length) picks.add(i);
  const rows = [...picks].sort((a, b) => a - b);

  const opponent = (m: Match) => (m.homeTeam.id === me.id ? m.awayTeam : m.homeTeam);
  const home = (m: Match) => m.homeTeam.id === me.id;
  const finished = matches.matches
    .filter((m) => m.status === "FINISHED" && m.score.fullTime.home !== null)
    .sort((a, b) => a.utcDate.localeCompare(b.utcDate));
  const upcoming = matches.matches
    .filter((m) => ["SCHEDULED", "TIMED"].includes(m.status) && new Date(m.utcDate) > now)
    .sort((a, b) => a.utcDate.localeCompare(b.utcDate));

  const form = finished.slice(-5).map((m) => {
    const us = home(m) ? m.score.fullTime.home! : m.score.fullTime.away!;
    const them = home(m) ? m.score.fullTime.away! : m.score.fullTime.home!;
    const r: Result = us > them ? "W" : us < them ? "L" : "D";
    return { r, score: `${us}–${them}`, opp: opponent(m).shortName };
  });

  const [next, ...later] = upcoming;
  return {
    teamId: me.id,
    next: next
      ? {
          title: `vs ${opponent(next).shortName}`,
          when: `${home(next) ? "Home" : "Away"} · ${dayMonth(new Date(next.utcDate))}, ${clock(new Date(next.utcDate))} Adelaide time`,
        }
      : null,
    then: later.length
      ? "Then: " +
        later
          .slice(0, 2)
          .map(
            (m) =>
              `${opponent(m).shortName} (${home(m) ? "home" : "away"}) ${dayMonth(new Date(m.utcDate))}`,
          )
          .join(" · ")
      : "",
    form,
    table: rows.map((i, k) => ({
      pos: table[i].position,
      teamId: table[i].team.id,
      team: table[i].team.shortName,
      played: table[i].playedGames,
      pts: table[i].points,
      gapBefore: k > 0 && i !== rows[k - 1] + 1,
    })),
    asOf: `UPDATED ${stamp(now)} · KICK-OFFS IN ADELAIDE TIME`,
  };
}

async function get<T>(path: string, token: string): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    headers: { "X-Auth-Token": token },
    next: { revalidate: REVALIDATE },
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`football-data ${path}: ${res.status}`);
  return res.json() as Promise<T>;
}

/** Live data for the United card, or null if it isn't available right now (the card then hides). */
export async function getFootball(): Promise<FootballData | null> {
  if (process.env.LIVE_DATA_FIXTURES === "1") return (await import("./fixtures")).football;
  const token = process.env.FOOTBALL_DATA_TOKEN;
  if (!token) return null;
  try {
    const now = new Date();
    const standings = await get<Standings>("/competitions/PL/standings", token);
    const me = standings.standings.flatMap((s) => s.table).find((r) => r.team.tla === TLA);
    if (!me) return null;
    const from = ymd(new Date(now.getTime() - 120 * 864e5));
    const to = ymd(new Date(now.getTime() + 60 * 864e5));
    const matches = await get<{ matches: Match[] }>(
      `/teams/${me.team.id}/matches?dateFrom=${from}&dateTo=${to}`,
      token,
    );
    return parseFootball(standings, matches, now);
  } catch (err) {
    console.error("[football]", err);
    return null;
  }
}
