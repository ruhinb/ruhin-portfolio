import type { MetadataRoute } from "next";
import { caseStudies } from "@/content/projects";
import { site } from "@/content/site";

// /sitemap.xml: the list of pages Google is told about (submitted in Search Console).
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: site.url, changeFrequency: "weekly", priority: 1 },
    ...caseStudies.map((c) => ({
      url: `${site.url}/projects/${c.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    { url: `${site.url}/privacy`, changeFrequency: "yearly", priority: 0.2 },
  ];
}
