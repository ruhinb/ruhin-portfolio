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
    dates: "2025 — NOW",
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
      "Capstone project: analysed 42,961 Beyond Blue forum posts in Python, using transformer-based NLP and time-series analysis to measure how emotional tone shifts through user interactions.",
    ],
  },
  {
    id: "fb",
    dates: "2022 — 2023",
    role: "Data Analyst",
    org: "Fieldbooster Limited · Bangladesh",
    open: true,
    points: [
      "Gathered client requirements in product meetings and agreed feasible reporting solutions with developers.",
      "Consolidated multiple operational data sources into a PostgreSQL reporting model, validating the data with automated checks and logging data-quality issues for review.",
      "Analysed appointment data in SQL to identify the patient groups and booking channels driving no-shows, giving operations a clear basis for where to target interventions.",
      "Evaluated a six-week reminder pilot as an A/B test, identifying a change that cut no-shows by 23% among the highest-risk patients, projected to keep BDT 0.87M a year in fees.",
      "Built and maintained Power BI dashboards with DAX measures and clinic, specialty and date filters, letting the operations team answer follow-up questions without an analyst.",
      "Cut weekly reporting time by 74% (244 to 62.5 minutes) by automating data preparation in PostgreSQL.",
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
