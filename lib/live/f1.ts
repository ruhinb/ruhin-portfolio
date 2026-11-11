import { dayMonth, shortDate, stamp } from "./format";
import type { F1Data } from "./types";

// Formula 1 from the Jolpica API (the open successor to Ergast). Free, no key; it asks
// callers to identify themselves with a User-Agent.
const API = "https://api.jolpi.ca/ergast/f1";
const REVALIDATE = 3600;

type Driver = { givenName: string; familyName: string };
type Race = {
  season: string;
  round: string;
  raceName: string;
  date: string;
  time?: string;
  Results?: { position: string; Driver: Driver; Constructor: { name: string } }[];
};
type LastResults = { MRData: { RaceTable: { season: string; Races: Race[] } } };
type Schedule = { MRData: { RaceTable: { season: string; Races: Race[] } } };
type DriverStandings = {
  MRData: {
    StandingsTable: {
      season: string;
      StandingsLists: {
        DriverStandings: {
          position: string;
          points: string;
          Driver: Driver;
          Constructors: { name: string }[];
        }[];
      }[];
    };
  };
};
type ConstructorStandings = {
  MRData: {
    StandingsTable: {
      StandingsLists: {
        ConstructorStandings: { position: string; points: string; Constructor: { name: string } }[];
      }[];
    };
  };
};

const gp = (name: string) => name.replace(/ Grand Prix$/, " GP");
const raceStart = (r: Race) => new Date(`${r.date}T${r.time ?? "12:00:00Z"}`);
const driverName = (d: Driver) => `${d.givenName} ${d.familyName}`;

/** Turns the four API responses into the card's shape. Pure, so it can be tested. */
export function parseF1(
  last: LastResults,
  schedule: Schedule,
  drivers: DriverStandings,
  constructors: ConstructorStandings,
  now: Date,
): F1Data | null {
  const race = last.MRData.RaceTable.Races[0];
  const standings = drivers.MRData.StandingsTable.StandingsLists[0]?.DriverStandings ?? [];
  if (!race?.Results?.length || !standings.length) return null;

  const upcoming = schedule.MRData.RaceTable.Races.filter((r) => raceStart(r) > now);
  const [next, ...later] = upcoming;
  const teams = constructors.MRData.StandingsTable.StandingsLists[0]?.ConstructorStandings ?? [];

  return {
    season: drivers.MRData.StandingsTable.season,
    lastLabel: `LAST RACE · ${gp(race.raceName).toUpperCase()} · ${shortDate(raceStart(race))}`,
    podium: race.Results.slice(0, 3).map((r) => ({
      pos: `P${r.position}`,
      name: driverName(r.Driver),
      team: r.Constructor.name,
    })),
    next: next ? `${gp(next.raceName)} · ${dayMonth(raceStart(next))}` : "Season complete",
    then: next
      ? later.length
        ? `Then ${later
            .slice(0, 3)
            .map((r) => gp(r.raceName).replace(/ GP$/, ""))
            .join(" → ")}${later.length <= 3 ? " to close the season" : ""}`
        : "The final race of the season"
      : "Back for the new season next year",
    standings: standings.slice(0, 5).map((s) => ({
      pos: s.position,
      name: driverName(s.Driver),
      team: s.Constructors[s.Constructors.length - 1]?.name ?? "",
      pts: Number(s.points),
    })),
    constructors: teams.length
      ? "Constructors: " +
        teams
          .slice(0, 3)
          .map((t) => `${t.Constructor.name} ${Number(t.points)}`)
          .join(" · ")
      : "",
    asOf: `UPDATED ${stamp(now)} · AFTER ${gp(race.raceName).toUpperCase()}`,
  };
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    headers: { "User-Agent": process.env.F1_USER_AGENT || "ruhin-portfolio (personal website)" },
    next: { revalidate: REVALIDATE },
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`jolpica ${path}: ${res.status}`);
  return res.json() as Promise<T>;
}

/** Live data for the F1 card, or null if it isn't available right now (the card then hides). */
export async function getF1(): Promise<F1Data | null> {
  if (process.env.LIVE_DATA_FIXTURES === "1") return (await import("./fixtures")).f1;
  try {
    // One after another: Jolpica allows only a few requests a second.
    const last = await get<LastResults>("/current/last/results.json");
    const schedule = await get<Schedule>("/current.json");
    const drivers = await get<DriverStandings>("/current/driverstandings.json");
    const constructors = await get<ConstructorStandings>("/current/constructorstandings.json");
    return parseF1(last, schedule, drivers, constructors, new Date());
  } catch (err) {
    console.error("[f1]", err);
    return null;
  }
}
