// Everything about you that appears in more than one place lives here.
export const site = {
  name: "Rubaiyat Ruhin",
  shortName: "Ru",
  role: "Data Analyst",
  location: "Adelaide, South Australia",
  description:
    "Rubaiyat (Ru) Ruhin is a data analyst in Adelaide. SQL, Python and Power BI case studies on pricing, operations and patient care.",
  // Replace with the real domain in stage 6.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  links: {
    linkedin: "https://linkedin.com/in/rubaiyatalamruhin",
    github: "https://github.com/ruhinb",
  },
  resume: "/resume/Rubaiyat-Ruhin-Resume.pdf",
} as const;
