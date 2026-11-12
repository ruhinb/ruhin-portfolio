import { getNowPlaying } from "@/lib/live/spotify";

// What Ru is listening to. Vercel's edge cache shares one answer between all visitors
// for 30 seconds, so Spotify is asked at most about twice a minute.
export const dynamic = "force-dynamic";

export async function GET() {
  const data = await getNowPlaying();
  // While Spotify has the site on a time-out, hold that answer for 15 minutes so the server
  // (and so Spotify) is barely asked until it ends.
  const limited = data.status === "off" && data.reason?.startsWith("rate limited");
  return Response.json(data, {
    headers: {
      "Cache-Control": limited
        ? "public, max-age=0, s-maxage=900"
        : "public, max-age=0, s-maxage=30, stale-while-revalidate=60",
    },
  });
}
