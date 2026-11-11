// Everything about you that appears in more than one place lives here.
export const site = {
  name: "Rubaiyat Ruhin",
  shortName: "Ru",
  role: "Data Analyst",
  location: "Adelaide, South Australia",
  description:
    "Rubaiyat (Ru) Ruhin is a data analyst in Adelaide. SQL, Python and Power BI case studies on pricing, operations and patient care.",
  tagline: "I turn messy operational data into decisions people act on.",
  // Replace with the real domain in stage 6.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
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
} as const;

// The home page's sections, in order. `live: false` hides a section from the
// navigation until the stage that builds it.
export const sections = [
  { id: "top", label: "Overview", live: true },
  { id: "about", label: "About", live: true },
  { id: "experience", label: "Experience", live: true },
  { id: "work", label: "Projects", live: true },
  { id: "life", label: "Life", live: false },
  { id: "contact", label: "Contact", live: true },
] as const;

export type SectionId = (typeof sections)[number]["id"];
