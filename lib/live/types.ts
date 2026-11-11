// The shapes the live cards draw from. The server fetches each feed and turns it into these.

export type Result = "W" | "D" | "L";

export type FootballData = {
  teamId: number;
  next: { title: string; when: string } | null;
  then: string;
  form: { r: Result; score: string; opp: string }[];
  table: {
    pos: number;
    teamId: number;
    team: string;
    played: number;
    pts: number;
    gapBefore?: boolean;
  }[];
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

export type NowPlaying =
  | { status: "off" }
  | {
      status: "playing" | "recent";
      title: string;
      artist: string;
      url: string;
      art: string | null;
      progressMs: number;
      durationMs: number;
    };
