import { randomBytes } from "node:crypto";
import { SPOTIFY_SCOPES, setupClosedReason } from "@/lib/live/spotify";

// One-time setup: sends Ru to Spotify to allow read-only access to what he's playing.
// Only works until SPOTIFY_REFRESH_TOKEN is saved in Vercel; after that it's a 404.
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const id = process.env.SPOTIFY_CLIENT_ID!;
  const closed = setupClosedReason();
  if (closed)
    return new Response(closed, { status: 404, headers: { "Cache-Control": "no-store" } });
  const origin = new URL(request.url).origin;
  const state = randomBytes(16).toString("hex");
  const url = new URL("https://accounts.spotify.com/authorize");
  url.search = new URLSearchParams({
    response_type: "code",
    client_id: id,
    scope: SPOTIFY_SCOPES,
    redirect_uri: `${origin}/api/spotify/callback`,
    state,
    show_dialog: "true",
  }).toString();
  return new Response(null, {
    status: 302,
    headers: {
      Location: url.toString(),
      "Set-Cookie": `spotify_state=${state}; Path=/api/spotify; HttpOnly; Secure; SameSite=Lax; Max-Age=600`,
      "Cache-Control": "no-store",
    },
  });
}
