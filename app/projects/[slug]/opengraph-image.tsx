import { caseStudies, getCaseStudy } from "@/content/projects";
import { caseCard, ogSize } from "@/lib/og/card";

// The link preview for each case study: its title, result and headline numbers.
export const alt = "Case study by Rubaiyat Ruhin";
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getCaseStudy(slug) ?? caseStudies[0];
  return caseCard(p);
}
