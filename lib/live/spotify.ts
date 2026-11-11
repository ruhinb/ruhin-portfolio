import type { NowPlaying } from "./types";

// Spotify: what Ru is playing now, or the last thing he played.
// Uses a refresh token from a one-time login (see app/api/spotify/*) with read-only permissions.
const TOKEN_URL = "https://accounts.spotify.com/api/token";
const API = "https://api.spotify.com/v1/me/player";
export const SPOTIFY_SCOPES = "user-read-currently-playing user-read-recently-played";

// Spotify leaves fields out for local files and unavailable songs, so all but the name are optional.
type Track = {
  name: string;
  duration_ms?: number;
  external_urls?: { spotify?: string };
  artists?: { name: string }[];
  album?: { images?: { url: string; width: number | null }[] };
};

/** Why the one-time setup pages are switched off, or null if they're open. Says which setting is missing, never its value. */
export function setupClosedReason(): string | null {
  const missing = ["SPOTIFY_CLIENT_ID", "SPOTIFY_CLIENT_SECRET"].filter(
    (k) => !process.env[k]?.trim(),
  );
  if (missing.length)
    return `Spotify setup is off: ${missing.join(" and ")} ${missing.length > 1 ? "aren't" : "isn't"} set for this deployment.`;
  if (process.env.SPOTIFY_REFRESH_TOKEN?.trim())
    return "Spotify is already connected, so this setup page is switched off.";
  return null;
}

export const basicAuth = (id: string, secret: string) =>
  "Basic " + Buffer.from(`${id}:${secret}`).toString("base64");

const fromTrack = (t: Track, status: "playing" | "recent", progressMs = 0): NowPlaying => {
  // The smallest cover that's still sharp at 58px on a retina screen.
  const images = [...(t.album?.images ?? [])].sort((a, b) => (a.width ?? 0) - (b.width ?? 0));
  const art =
    images.find((i) => (i.width ?? 0) >= 120)?.url ?? images[images.length - 1]?.url ?? null;
  return {
    status,
    title: t.name,
    artist: (t.artists ?? []).map((a) => a.name).join(", "),
    url: t.external_urls?.spotify ?? "https://open.spotify.com",
    art,
    progressMs,
    durationMs: t.duration_ms ?? 0,
  };
};

/**
 * Pure, so it can be tested: the currently-playing body (null for "204 nothing playing")
 * and the recently-played body.
 *
 * Which song counts as "last played", most reliable first:
 * 1. The track Spotify still has loaded (paused or stopped). Spotify keeps it for a while
 *    after you stop, and it's always the real last song.
 * 2. Otherwise the listening history, newest first by its played_at time. The history is
 *    known to lag or skip songs, so it's only the fallback.
 */
export function parseNowPlaying(
  current: {
    is_playing: boolean;
    progress_ms: number | null;
    item: Track | null;
    currently_playing_type?: string;
  } | null,
  recent: { items: { track: Track; played_at?: string }[] } | null,
): NowPlaying {
  const isTrack = (current?.currently_playing_type ?? "track") === "track";
  if (current?.item && isTrack) {
    return current.is_playing
      ? fromTrack(current.item, "playing", current.progress_ms ?? 0)
      : fromTrack(current.item, "recent");
  }
  const time = (at?: string) => Date.parse(at ?? "") || 0;
  const newest = (recent?.items ?? [])
    .filter((i) => i?.track?.name)
    .sort((a, b) => time(b.played_at) - time(a.played_at))[0]?.track;
  return newest ? fromTrack(newest, "recent") : { status: "off", reason: "no history" };
}

async function accessToken() {
  const id = process.env.SPOTIFY_CLIENT_ID;
  const secret = process.env.SPOTIFY_CLIENT_SECRET;
  const refresh = process.env.SPOTIFY_REFRESH_TOKEN;
  if (!id || !secret || !refresh) return null;
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: basicAuth(id, secret),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: refresh }),
    cache: "no-store",
    signal: AbortSignal.timeout(6000),
  });
  if (!res.ok) throw new Error(`spotify token: ${res.status}`);
  return ((await res.json()) as { access_token: string }).access_token;
}

export async function getNowPlaying(): Promise<NowPlaying> {
  if (process.env.LIVE_DATA_FIXTURES === "1") return (await import("./fixtures")).nowPlaying;
  try {
    const token = await accessToken();
    if (!token) return { status: "off", reason: "not set up" };
    const opts = {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store" as const,
      signal: AbortSignal.timeout(6000),
    };
    const cur = await fetch(`${API}/currently-playing`, opts);
    if (cur.status !== 200 && cur.status !== 204) console.error("[spotify] now:", cur.status);
    const current = cur.status === 200 ? await cur.json() : null;
    if (current?.item && (current.currently_playing_type ?? "track") === "track")
      return parseNowPlaying(current, null);
    const rec = await fetch(`${API}/recently-played?limit=20`, opts);
    if (!rec.ok) {
      console.error("[spotify] history:", rec.status);
      return { status: "off", reason: `history ${rec.status}` };
    }
    return parseNowPlaying(current, await rec.json());
  } catch (err) {
    console.error("[spotify]", err);
    const msg = err instanceof Error ? err.message : "";
    return { status: "off", reason: msg.startsWith("spotify token") ? msg : "error" };
  }
}
