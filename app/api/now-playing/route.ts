import { getNowPlaying } from "@/lib/live/spotify";

// What Ru is listening to. Vercel's edge cache shares one answer between all visitors
// for 20 seconds, so Spotify is asked at most about three times a minute.
export const dynamic = "force-dynamic";

export async function GET() {
  const data = await getNowPlaying();
  return Response.json(data, {
    headers: { "Cache-Control": "public, max-age=0, s-maxage=20, stale-while-revalidate=40" },
  });
}
