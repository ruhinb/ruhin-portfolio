import { site } from "@/content/site";
import { homeCard, ogSize } from "@/lib/og/card";

// The link preview for the home page (LinkedIn, Slack, iMessage, X and others).
export const alt = `${site.name}, ${site.role} in ${site.location}`;
export const size = ogSize;
export const contentType = "image/jpeg";

export default function Image() {
  return homeCard();
}
