import { expect, test } from "@playwright/test";
import { parseF1 } from "@/lib/live/f1";
import { parseFootball } from "@/lib/live/football";
import { parseNowPlaying } from "@/lib/live/spotify";

// These check how each API's response is turned into what the cards show, using
// responses shaped like the real ones. They don't need a browser, so run them once.
test.beforeEach(({}, info) => test.skip(info.project.name !== "desktop-chrome", "run once"));

const team = (id: number, shortName: string, tla: string) => ({
  id,
  name: `${shortName} FC`,
  shortName,
  tla,
});
const MUN = team(66, "Man United", "MUN");

test("football: table window, form, next match in Adelaide time", () => {
  const names = [
    "Arsenal",
    "Man City",
    "Brighton",
    "Liverpool",
    "Chelsea",
    "Villa",
    "Spurs",
    "Newcastle",
    "Fulham",
    "Brentford",
    "Everton",
    "Wolves",
    "Palace",
    "West Ham",
    "Bournemouth",
    "Nottingham",
    "Coventry",
    "Man United",
    "Leeds",
    "Sunderland",
  ];
  const table = names.map((n, i) => ({
    position: i + 1,
    team: n === "Man United" ? MUN : team(100 + i, n, n.slice(0, 3).toUpperCase()),
    playedGames: 10,
    points: 30 - i,
  }));
  const standings = {
    standings: [
      { type: "TOTAL", table },
      { type: "HOME", table: [] },
    ],
  };
  const opp = (n: string) => team(500 + n.length, n, n.slice(0, 3).toUpperCase());
  const finished = (date: string, home: boolean, us: number, them: number, o: string) => ({
    utcDate: date,
    status: "FINISHED",
    homeTeam: home ? MUN : opp(o),
    awayTeam: home ? opp(o) : MUN,
    score: { fullTime: { home: home ? us : them, away: home ? them : us } },
  });
  const upcoming = (date: string, home: boolean, o: string) => ({
    utcDate: date,
    status: "TIMED",
    homeTeam: home ? MUN : opp(o),
    awayTeam: home ? opp(o) : MUN,
    score: { fullTime: { home: null, away: null } },
  });
  const matches = {
    matches: [
      upcoming("2026-11-22T16:30:00Z", false, "Liverpool"),
      finished("2026-09-01T14:00:00Z", true, 3, 0, "Oldest"),
      finished("2026-09-20T14:00:00Z", false, 0, 2, "Chelsea"),
      finished("2026-10-01T14:00:00Z", true, 0, 3, "Bournemouth"),
      finished("2026-10-10T14:00:00Z", false, 1, 1, "Leeds"),
      finished("2026-10-20T14:00:00Z", true, 2, 1, "Spurs"),
      finished("2026-11-01T14:00:00Z", false, 1, 1, "Fulham"),
      upcoming("2026-11-08T16:30:00Z", true, "Aston Villa"),
      upcoming("2026-11-29T03:00:00Z", true, "Brentford"),
    ],
  };
  const d = parseFootball(standings, matches, new Date("2026-11-05T00:00:00Z"))!;

  expect(d.teamId).toBe(66);
  expect(d.table.map((r) => r.pos)).toEqual([1, 2, 3, 16, 17, 18, 19, 20]);
  expect(d.table[3].gapBefore).toBe(true);
  expect(d.table.filter((r) => r.gapBefore)).toHaveLength(1);
  expect(d.form).toEqual([
    { r: "L", score: "0–2", opp: "Chelsea" },
    { r: "L", score: "0–3", opp: "Bournemouth" },
    { r: "D", score: "1–1", opp: "Leeds" },
    { r: "W", score: "2–1", opp: "Spurs" },
    { r: "D", score: "1–1", opp: "Fulham" },
  ]);
  // 16:30 UTC on Sunday 8 November is 3:00 AM on Monday 9 November in Adelaide (UTC+10:30).
  expect(d.next).toEqual({
    title: "vs Aston Villa",
    when: "Home · Mon 9 Nov, 3:00 AM Adelaide time",
  });
  expect(d.then).toBe("Then: Liverpool (away) Mon 23 Nov · Brentford (home) Sun 29 Nov");
  expect(d.asOf).toMatch(/^UPDATED 5 NOV, 10:30 AM/);
});

test("football: no United in the table means no card", () => {
  expect(
    parseFootball({ standings: [{ type: "TOTAL", table: [] }] }, { matches: [] }, new Date()),
  ).toBeNull();
});

test("f1: podium, next race, standings and constructors", () => {
  const drv = (g: string, f: string) => ({ givenName: g, familyName: f });
  const last = {
    MRData: {
      RaceTable: {
        season: "2026",
        Races: [
          {
            season: "2026",
            round: "20",
            raceName: "Mexico City Grand Prix",
            date: "2026-11-01",
            time: "20:00:00Z",
            Results: [
              {
                position: "1",
                Driver: drv("Max", "Verstappen"),
                Constructor: { name: "Red Bull" },
              },
              { position: "2", Driver: drv("Lewis", "Hamilton"), Constructor: { name: "Ferrari" } },
              {
                position: "3",
                Driver: drv("Kimi", "Antonelli"),
                Constructor: { name: "Mercedes" },
              },
              {
                position: "4",
                Driver: drv("George", "Russell"),
                Constructor: { name: "Mercedes" },
              },
            ],
          },
        ],
      },
    },
  };
  const race = (raceName: string, date: string) => ({
    season: "2026",
    round: "x",
    raceName,
    date,
    time: "17:00:00Z",
  });
  const schedule = {
    MRData: {
      RaceTable: {
        season: "2026",
        Races: [
          race("Mexico City Grand Prix", "2026-11-01"),
          race("São Paulo Grand Prix", "2026-11-08"),
          race("Las Vegas Grand Prix", "2026-11-21"),
          race("Qatar Grand Prix", "2026-11-29"),
          race("Abu Dhabi Grand Prix", "2026-12-06"),
        ],
      },
    },
  };
  const ds = (pos: string, g: string, f: string, team: string, pts: string) => ({
    position: pos,
    points: pts,
    Driver: drv(g, f),
    Constructors: [{ name: team }],
  });
  const drivers = {
    MRData: {
      StandingsTable: {
        season: "2026",
        StandingsLists: [
          {
            DriverStandings: [
              ds("1", "Kimi", "Antonelli", "Mercedes", "380"),
              ds("2", "Max", "Verstappen", "Red Bull", "261"),
              ds("3", "Lewis", "Hamilton", "Ferrari", "259"),
              ds("4", "George", "Russell", "Mercedes", "250"),
              ds("5", "Charles", "Leclerc", "Ferrari", "245"),
              ds("6", "Lando", "Norris", "McLaren", "200"),
            ],
          },
        ],
      },
    },
  };
  const constructors = {
    MRData: {
      StandingsTable: {
        StandingsLists: [
          {
            ConstructorStandings: [
              { position: "1", points: "630", Constructor: { name: "Mercedes" } },
              { position: "2", points: "504", Constructor: { name: "Ferrari" } },
              { position: "3", points: "382", Constructor: { name: "Red Bull" } },
              { position: "4", points: "300", Constructor: { name: "McLaren" } },
            ],
          },
        ],
      },
    },
  };
  const d = parseF1(last, schedule, drivers, constructors, new Date("2026-11-03T00:00:00Z"))!;

  expect(d.season).toBe("2026");
  expect(d.lastLabel).toBe("LAST RACE · MEXICO CITY GP · 2 NOV");
  expect(d.podium.map((p) => p.name)).toEqual([
    "Max Verstappen",
    "Lewis Hamilton",
    "Kimi Antonelli",
  ]);
  expect(d.next).toBe("São Paulo GP · Mon 9 Nov");
  expect(d.then).toBe("Then Las Vegas → Qatar → Abu Dhabi to close the season");
  expect(d.standings).toHaveLength(5);
  expect(d.standings[0]).toEqual({ pos: "1", name: "Kimi Antonelli", team: "Mercedes", pts: 380 });
  expect(d.constructors).toBe("Constructors: Mercedes 630 · Ferrari 504 · Red Bull 382");

  // After the final race the card says so instead of showing a next race.
  const end = parseF1(last, schedule, drivers, constructors, new Date("2026-12-10T00:00:00Z"))!;
  expect(end.next).toBe("Season complete");
});

test("spotify: playing, last played, and nothing at all", () => {
  const track = {
    name: "Song",
    duration_ms: 200000,
    external_urls: { spotify: "https://open.spotify.com/track/x" },
    artists: [{ name: "A" }, { name: "B" }],
    album: {
      images: [
        { url: "big", width: 640 },
        { url: "mid", width: 300 },
        { url: "small", width: 64 },
      ],
    },
  };
  expect(parseNowPlaying({ is_playing: true, progress_ms: 5000, item: track }, null)).toEqual({
    status: "playing",
    title: "Song",
    artist: "A, B",
    url: "https://open.spotify.com/track/x",
    art: "mid",
    progressMs: 5000,
    durationMs: 200000,
  });
  // Paused or stopped: the track Spotify still has loaded is the last one played,
  // even if the listening history says otherwise.
  const older = { ...track, name: "Older song" };
  expect(
    parseNowPlaying(
      { is_playing: false, progress_ms: 0, item: track },
      { items: [{ track: older, played_at: "2026-11-11T10:00:00Z" }] },
    ),
  ).toMatchObject({ status: "recent", title: "Song" });
  // Nothing loaded: the newest entry in the history wins, whatever order it arrives in.
  expect(
    parseNowPlaying(null, {
      items: [
        { track: older, played_at: "2026-11-01T10:00:00Z" },
        { track, played_at: "2026-11-11T10:00:00Z" },
      ],
    }),
  ).toMatchObject({ status: "recent", title: "Song" });
  expect(
    parseNowPlaying(
      { is_playing: true, progress_ms: 0, item: track, currently_playing_type: "episode" },
      { items: [] },
    ),
  ).toEqual({ status: "off" });
  expect(parseNowPlaying(null, null)).toEqual({ status: "off" });
});
