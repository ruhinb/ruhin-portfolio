import { basicAuth } from "@/lib/live/spotify";

// One-time setup, step 2: Spotify sends Ru back here with a code, which is swapped for a
// long-lived refresh token and shown once so he can save it in Vercel. Only works until
// SPOTIFY_REFRESH_TOKEN is saved; after that it's a 404.
export const dynamic = "force-dynamic";

const page = (title: string, body: string) =>
  new Response(
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${title}</title>
<style>body{font:16px/1.6 system-ui,sans-serif;max-width:640px;margin:48px auto;padding:0 20px;color:#16181b;background:#f6f4ef}code{display:block;padding:14px;background:#fff;border:1px solid #e2ded5;border-radius:10px;word-break:break-all;font-size:14px;user-select:all}li{margin:6px 0}</style>
</head><body>${body}</body></html>`,
    { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } },
  );

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

export async function GET(request: Request) {
  const id = process.env.SPOTIFY_CLIENT_ID;
  const secret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!id || !secret || process.env.SPOTIFY_REFRESH_TOKEN)
    return new Response("Not found", { status: 404 });

  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const cookie = request.headers.get("cookie")?.match(/(?:^|;\s*)spotify_state=([a-f0-9]+)/)?.[1];
  if (url.searchParams.get("error")) {
    return page(
      "Spotify not connected",
      `<h1>Not connected</h1><p>Spotify said: ${esc(url.searchParams.get("error")!)}. You can <a href="/api/spotify/login">try again</a>.</p>`,
    );
  }
  if (!code || !state || state !== cookie) {
    return page(
      "Spotify not connected",
      `<h1>That link has expired</h1><p><a href="/api/spotify/login">Start again</a>.</p>`,
    );
  }

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: basicAuth(id, secret),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: `${url.origin}/api/spotify/callback`,
    }),
    cache: "no-store",
  });
  if (!res.ok) {
    return page(
      "Spotify not connected",
      `<h1>Spotify refused the code</h1><p>Status ${res.status}. <a href="/api/spotify/login">Try again</a>.</p>`,
    );
  }
  const { refresh_token } = (await res.json()) as { refresh_token: string };
  return page(
    "Spotify connected",
    `<h1>Spotify is connected</h1>
<p>Save this code in Vercel. It lets your site see what you're playing, and nothing else.</p>
<code>${esc(refresh_token)}</code>
<ol>
<li>Copy the code above (click it once to select it all).</li>
<li>In Vercel, open <b>ruhin-portfolio → Settings → Environment Variables</b>.</li>
<li>Add <b>SPOTIFY_REFRESH_TOKEN</b> with the code as its value, for all environments, and save.</li>
<li>Open <b>Deployments</b>, click the <b>⋯</b> on the top one and choose <b>Redeploy</b>.</li>
</ol>
<p>Once it's saved, this page switches itself off. Don't share the code with anyone.</p>`,
  );
}
