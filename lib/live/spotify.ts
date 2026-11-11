import type { NowPlaying } from "./types";

// Spotify: what Ru is playing now, or the last thing he played.
// Uses a refresh token from a one-time login (see app/api/spotify/*) with read-only permissions.
const TOKEN_URL = "https://accounts.spotify.com/api/token";
const API = "https://api.spotify.com/v1/me/player";
export const SPOTIFY_SCOPES = "user-read-currently-playing user-read-recently-played";

type Track = {
  name: string;
  duration_ms: number;
  external_urls: { spotify: string };
  artists: { name: string }[];
  album: { images: { url: string; width: number }[] };
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
  const images = [...t.album.images].sort((a, b) => a.width - b.width);
  const art = images.find((i) => i.width >= 120)?.url ?? images[images.length - 1]?.url ?? null;
  return {
    status,
    title: t.name,
    artist: t.artists.map((a) => a.name).join(", "),
    url: t.external_urls.spotify,
    art,
    progressMs,
    durationMs: t.duration_ms,
  };
};

/** Pure, so it can be tested: the currently-playing body (null for "204 nothing playing") and recently-played body. */
export function parseNowPlaying(
  current: {
    is_playing: boolean;
    progress_ms: number | null;
    item: Track | null;
    currently_playing_type?: string;
  } | null,
  recent: { items: { track: Track }[] } | null,
): NowPlaying {
  if (
    current?.is_playing &&
    current.item &&
    (current.currently_playing_type ?? "track") === "track"
  ) {
    return fromTrack(current.item, "playing", current.progress_ms ?? 0);
  }
  const last = recent?.items?.[0]?.track;
  return last ? fromTrack(last, "recent") : { status: "off" };
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
    if (!token) return { status: "off" };
    const opts = {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store" as const,
      signal: AbortSignal.timeout(6000),
    };
    const cur = await fetch(`${API}/currently-playing`, opts);
    const current = cur.status === 200 ? await cur.json() : null;
    if (current?.is_playing) return parseNowPlaying(current, null);
    const rec = await fetch(`${API}/recently-played?limit=1`, opts);
    return parseNowPlaying(current, rec.ok ? await rec.json() : null);
  } catch (err) {
    console.error("[spotify]", err);
    return { status: "off" };
  }
}
