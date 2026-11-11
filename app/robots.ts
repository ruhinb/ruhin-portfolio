import type { MetadataRoute } from "next";
import { site } from "@/content/site";

// /robots.txt: search engines may read every page except the API routes.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/u/"] },
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
