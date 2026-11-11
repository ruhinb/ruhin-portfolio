import { site } from "@/content/site";

// Umami visitor stats: no cookies, no personal data, nothing shared with advertisers.
// The script and its requests go through this site's own address (see next.config.ts).
// data-domains means only visits to the live domain are counted, not previews or localhost.
// data-do-not-track respects visitors who have asked their browser not to be tracked.
export function Umami() {
  if (!site.umamiWebsiteId) return null;
  return (
    <script
      defer
      src="/u/s.js"
      data-website-id={site.umamiWebsiteId}
      data-host-url="/u"
      data-domains={site.domain}
      data-do-not-track="true"
      data-exclude-search="true"
    />
  );
}
