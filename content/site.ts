// Everything about you that appears in more than one place lives here.
export const site = {
  name: "Rubaiyat Ruhin",
  shortName: "Ru",
  role: "Data Analyst",
  location: "Adelaide, South Australia",
  description:
    "Rubaiyat (Ru) Ruhin is a data analyst in Adelaide. SQL, Python and Power BI case studies on pricing, operations and patient care.",
  tagline: "I turn messy operational data into decisions people act on.",
  // The live address. NEXT_PUBLIC_SITE_URL can override it (e.g. http://localhost:3000 for local work).
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://rubaiyat.dev",
  domain: "rubaiyat.dev",
  // Split so the address never appears whole in the page's HTML (see components/home/email.tsx).
  email: { user: "rubaiyatalam.ruhin", domain: "gmail.com" },
  links: {
    linkedin: "https://linkedin.com/in/rubaiyatalamruhin",
    github: "https://github.com/ruhinb",
    projectsRepo: "https://github.com/ruhinb/Data_Analysis_Projects",
  },
  resume: {
    pdf: "/resume/Rubaiyat-Ruhin-Resume.pdf",
    image: "/resume/Rubaiyat-Ruhin-Resume.webp",
    // The web copy, without a phone number.
    ready: true,
  },
  // Umami visitor stats. The website ID is public (it appears in every page's HTML).
  // Stats are only sent from the live domain, never from previews or localhost.
  umamiWebsiteId: process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID ?? "",
} as const;

// The home page's sections, in order. `live: false` hides a section from the
// navigation until the stage that builds it.
export const sections = [
  { id: "top", label: "Overview", live: true },
  { id: "about", label: "About", live: true },
  { id: "experience", label: "Experience", live: true },
  { id: "work", label: "Projects", live: true },
  { id: "life", label: "Life", live: true },
  { id: "contact", label: "Contact", live: true },
] as const;

export type SectionId = (typeof sections)[number]["id"];
