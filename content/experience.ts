// Work and study, newest first. The entry with `now: true` gets the "Now" badge.
// `open` marks the row that starts expanded.
export type Experience = {
  id: string;
  dates: string;
  role: string;
  org: string;
  now?: boolean;
  open?: boolean;
  points: string[];
};

export const experience: Experience[] = [
  {
    id: "cibo",
    dates: "2024 — NOW",
    role: "Barista",
    org: "CIBO Espresso · Adelaide",
    now: true,
    points: [
      "Managed inventory and stock ordering, and reconciled POS takings daily with zero cash discrepancies over 12+ months.",
      "Kept communication clear and calm with customers and teammates in a busy, multicultural team, and trained new staff as team lead.",
    ],
  },
  {
    id: "mds",
    dates: "2024 — 2025",
    role: "Master of Data Science",
    org: "The University of Adelaide",
    points: [
      "Capstone project: emotional shifts across 42,961 Beyond Blue forum messages, using transformer models and time-series analysis.",
    ],
  },
  {
    id: "fb",
    dates: "2022 — 2023",
    role: "Data Analyst",
    org: "Fieldbooster Limited · Bangladesh",
    open: true,
    points: [
      "Found a reminder change that cut no-shows by 23% among the highest-risk patients, projected to keep BDT 0.87M a year, by evaluating a six-week pilot as an A/B test in SQL and Power BI.",
      "Cut weekly reporting time by 74% (244 to 62.5 minutes) by automating data preparation in PostgreSQL.",
      "Built Power BI dashboards with DAX and clinic, specialty and date filters, so the operations team could answer follow-up questions without an analyst.",
    ],
  },
  {
    id: "ieee",
    dates: "2021",
    role: "Treasurer (elected)",
    org: "IEEE AESS, BRAC University Student Branch",
    points: [
      "Ran DataCON 1.0, a flagship countrywide data analytics workshop for 200+ participants.",
      "Secured event funding by analysing budget needs and preparing proposals for the university.",
    ],
  },
  {
    id: "bsc",
    dates: "2018 — 2022",
    role: "BSc, Electrical & Electronics Engineering",
    org: "BRAC University",
    points: [
      "Capstone project: an IoT entry gate with COVID-19 checks, built on a Raspberry Pi with RFID, mask detection, temperature and SpO2 sensors.",
    ],
  },
];
