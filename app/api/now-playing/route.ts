import { getNowPlaying } from "@/lib/live/spotify";

// What Ru is listening to. Vercel's edge cache shares one answer between all visitors
// for 30 seconds, so Spotify is asked at most about twice a minute.
export const dynamic = "force-dynamic";

export async function GET() {
  const data = await getNowPlaying();
  return Response.json(data, {
    headers: { "Cache-Control": "public, max-age=0, s-maxage=30, stale-while-revalidate=60" },
  });
}
