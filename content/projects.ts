// Case studies and other projects.
//
// To add a case study: copy one of the objects in `caseStudies`, give it a new `slug`,
// put its images in public/images/projects/<slug>/, and add the slug to `featuredOrder`.
// The home page card, the case study page at /projects/<slug> and the "next project"
// chain all come from this file.

export type Tone = "tx" | "red" | "green" | "blue" | "accent";

export type Img = { src: string; w: number; h: number; alt: string };

export type CaseStudy = {
  slug: string;
  /** Title in two parts: the second is set in italics. */
  t1: string;
  t2: string;
  /** Home page card. */
  card: {
    meta: string;
    question: string;
    stat: string;
    statText: string;
    /** Report pages shown as the stacked cards: tab name, image, caption. */
    pages: { name: string; img: Img; caption: string }[];
  };
  /** Case study page. */
  overline: string;
  lead: string;
  hero: Img & { caption: string };
  kpis: { k: string; v: string; tone: Tone }[];
  question: string;
  questionBody: string;
  findings: { title: string; body: string; img: Img; layout: "side" | "side-reverse" | "wide" }[];
  decision: {
    nav: string;
    over: string;
    /** Headline in three parts; the middle one is italic. */
    a: string;
    b: string;
    c: string;
    modesLabel: string;
    modes: { id: string; label: string; value: string; text: string; width: string }[];
    scale: [string, string, string];
    note?: string;
  };
  camps: { title: string; tag: string; list: string; tone: Tone }[];
  method: { k: string; v: string }[];
  github: string;
  githubLabel: string;
  footNote?: string;
};

const img = (slug: string, file: string, w: number, h: number, alt: string): Img => ({
  src: `/images/projects/${slug}/${file}.jpg`,
  w,
  h,
  alt,
});

const patientcare: CaseStudy = {
  slug: "patientcare",
  t1: "PatientCare",
  t2: "Analytics",
  card: {
    meta: "POSTGRESQL · A/B TESTING · POWER BI · FIELDBOOSTER 2022–23",
    question:
      "Where do missed appointments concentrate across a 14-clinic network, and does a better reminder fix them? I unified 12 data sources and tested a six-week reminder pilot.",
    stat: "26.0% → 20.1%",
    statText: "semi-urban no-show rate, worth about BDT 0.87M a year.",
    pages: [
      {
        name: "Overview",
        img: img(
          "patientcare",
          "page-overview",
          1600,
          900,
          "Overview page of the PatientCare Power BI report",
        ),
        caption: "73,692 appointments across 14 clinics, in one model built from 12 data sources.",
      },
      {
        name: "Baseline",
        img: img(
          "patientcare",
          "page-baseline",
          1600,
          900,
          "Baseline page of the PatientCare report",
        ),
        caption:
          "Semi-urban patients missed 15.9% of appointments, against 11.9% for urban patients.",
      },
      {
        name: "Pilot results",
        img: img(
          "patientcare",
          "page-pilot-results",
          1600,
          900,
          "Pilot results page of the PatientCare report",
        ),
        caption: "The enhanced reminder cut their no-show rate from 26.0% to 20.1% (p = 0.013).",
      },
      {
        name: "Reporting",
        img: img(
          "patientcare",
          "page-reporting",
          1600,
          900,
          "Reporting page of the PatientCare report",
        ),
        caption: "Weekly reporting went from 244 to 62.5 minutes once the prep was automated.",
      },
      {
        name: "Outcomes",
        img: img(
          "patientcare",
          "page-outcomes",
          1600,
          900,
          "Outcomes page of the PatientCare report",
        ),
        caption: "Worth about BDT 0.87M a year, with next steps and limitations spelled out.",
      },
    ],
  },
  overline: "CASE STUDY · HEALTHCARE · POSTGRESQL, POWER BI · FIELDBOOSTER 2022–23",
  lead: "About one in seven patients missed their appointment. An enhanced reminder cut semi-urban no-shows by a fifth, worth about BDT 0.87M a year.",
  hero: {
    ...img(
      "patientcare",
      "page-overview",
      1600,
      900,
      "Overview page of the PatientCare Power BI report",
    ),
    caption: "The overview page of the five-page Power BI report, built for the operations team.",
  },
  kpis: [
    { k: "APPOINTMENTS", v: "73,692", tone: "tx" },
    { k: "NO-SHOW RATE, BASELINE", v: "13.9%", tone: "tx" },
    { k: "PILOT REDUCTION", v: "−5.9 pts", tone: "green" },
    { k: "WEEKLY REPORTING TIME", v: "−74%", tone: "green" },
  ],
  question: "Where do missed appointments concentrate, and does a better reminder fix them?",
  questionBody:
    "PatientCare is an outpatient network of 14 clinics in Bangladesh, with 115 doctors and 34,460 registered patients. From January 2022 to mid-June 2023 it booked 73,692 appointments, and about one in seven booked patients did not turn up. Working with the operations team, I brought 12 data sources (557,423 records) into one reporting model.",
  findings: [
    {
      title: "It’s where patients live, not when they book.",
      body: "Semi-urban patients missed 15.9% of appointments, against 11.9% for urban patients, in every month and every time slot. They hold about half of the baseline appointments and 56% of the missed fees.",
      img: img(
        "patientcare",
        "finding-1",
        1600,
        473,
        "Semi-urban vs urban no-show rate by month and by time of day",
      ),
      layout: "wide",
    },
    {
      title: "A second reminder cuts no-shows by a fifth.",
      body: "A 24-hour message plus a 2-hour follow-up cut semi-urban no-shows from 26.0% to 20.1% in a six-week pilot. The 1,409 appointments were split 1:1 within each clinic and month, so both groups faced the same clinics and months.",
      img: img(
        "patientcare",
        "finding-2",
        1600,
        519,
        "Pilot no-show rates and the 95% confidence interval of the reduction",
      ),
      layout: "wide",
    },
    {
      title: "Every no-show is a fee left behind.",
      body: "At BDT 1,139 per missed visit, no-shows cost about BDT 3.9M in fees over the seven-month baseline. The pilot kept about BDT 42k in six weeks; rolled out to every semi-urban patient, it would keep about BDT 0.87M a year.",
      img: img(
        "patientcare",
        "finding-3",
        1600,
        356,
        "Missed fees before the pilot, fees kept in the pilot and the 12-month projection",
      ),
      layout: "wide",
    },
  ],
  decision: {
    nav: "Pilot",
    over: "THE REMINDER PILOT · SIX WEEKS · SEMI-URBAN MORNINGS",
    a: "It works, and June says keep ",
    b: "measuring",
    c: ".",
    modesLabel: "Pilot period",
    modes: [
      {
        id: "all",
        label: "All six weeks",
        value: "−5.9 pts",
        text: "fewer no-shows across the whole pilot (95% CI 1.2 to 10.6 points, p = 0.013).",
        width: "59%",
      },
      {
        id: "may",
        label: "May 2023",
        value: "−8.2 pts",
        text: "in May alone (95% CI 1.9 to 14.4 points): a clear effect.",
        width: "82%",
      },
      {
        id: "jun",
        label: "June 2023",
        value: "−2.8 pts",
        text: "in June alone (95% CI −4.2 to 9.8 points): too small to call on its own.",
        width: "28%",
      },
    ],
    scale: [
      "0 pts",
      "Drop in the semi-urban no-show rate, enhanced vs standard reminder",
      "10 pts",
    ],
  },
  camps: [
    {
      title: "Roll out now",
      tag: "Operations",
      list: "The enhanced reminder for all semi-urban morning appointments: about BDT 0.44M a year in fees kept.",
      tone: "accent",
    },
    {
      title: "Extend next",
      tag: "Operations",
      list: "Semi-urban afternoon and evening slots, up to about BDT 0.87M a year in total. Then pilot walk-ins and same-day bookings (17.7% and 17.0%).",
      tone: "blue",
    },
    {
      title: "Keep measuring",
      tag: "Analytics",
      list: "Keep a small standard-reminder comparison group, review failed reminders monthly, and re-measure after six months.",
      tone: "green",
    },
  ],
  method: [
    {
      k: "PostgreSQL",
      v: "12 source extracts (557,423 records) cleaned into a star schema, with 4,342 data-quality issues logged instead of deleted.",
    },
    { k: "Checks", v: "41 automated tests run before every report." },
    {
      k: "Power BI",
      v: "A five-page report with 84 DAX measures, including the pilot’s 95% confidence interval and a two-proportion z-test.",
    },
    {
      k: "Reporting",
      v: "Automating the preparation cut the weekly report from 244 to 62.5 minutes, about three hours saved every week.",
    },
  ],
  github:
    "https://github.com/ruhinb/Data_Analysis_Projects/tree/main/patientcare-no-show-analytics",
  githubLabel: "SQL, report and sample data on GitHub ↗",
  footNote: "The original data is confidential; GitHub holds a sample with the same structure.",
};

const discount: CaseStudy = {
  slug: "discount",
  t1: "Discount",
  t2: "Guardrails",
  card: {
    meta: "SQL SERVER · PYTHON · POWER BI · 2014–17 RETAIL DATA",
    question:
      "What maximum discount should each product group allow? Every order line, analysed in T-SQL, with a what-if report for the Head of Sales.",
    stat: "$135K",
    statText: "lost on discounts above 20%, almost half of the $286K profit.",
    pages: [
      {
        name: "Overview",
        img: img(
          "discount",
          "page-overview",
          1600,
          895,
          "Overview page of the Discount Guardrails Power BI report",
        ),
        caption: "Heavy discounts cost $135K, almost half of the profit.",
      },
      {
        name: "Product groups",
        img: img(
          "discount",
          "page-product-groups",
          1600,
          896,
          "Product groups page of the Discount Guardrails report",
        ),
        caption: "17 product groups fall into three camps: cap, review prices, or leave alone.",
      },
      {
        name: "What if we cap?",
        img: img(
          "discount",
          "page-what-if",
          1600,
          895,
          "What-if page of the Discount Guardrails report",
        ),
        caption: "A 20% cap adds +$135K to +$219K, depending on how customers react.",
      },
      {
        name: "Quarterly check-up",
        img: img(
          "discount",
          "page-quarterly",
          1600,
          895,
          "Quarterly check-up page of the Discount Guardrails report",
        ),
        caption: "A page the Head of Sales opens every quarter to see if the habit is fading.",
      },
    ],
  },
  overline: "CASE STUDY · RETAIL · SQL SERVER, PYTHON, POWER BI",
  lead: "Discounts above 20% lost $135K over four years, almost half of the profit. A 20% cap was the best option I tested.",
  hero: {
    ...img(
      "discount",
      "page-overview",
      1600,
      895,
      "Overview page of the Discount Guardrails Power BI report",
    ),
    caption: "The overview page of the four-page Power BI report, built for the Head of Sales.",
  },
  kpis: [
    { k: "SALES", v: "$2.30M", tone: "tx" },
    { k: "PROFIT", v: "$286K", tone: "tx" },
    { k: "MARGIN", v: "12.5%", tone: "tx" },
    { k: "LOST ABOVE 20% OFF", v: "−$135K", tone: "red" },
  ],
  question: "What maximum discount should each product group allow?",
  questionBody:
    "A US office-supply retailer took 5,009 orders between 2014 and 2017, with discounts from 0% to 80% off. The Head of Sales sets discount limits once a year. I analysed every one of its 9,994 order lines in SQL Server to give that decision a number.",
  findings: [
    {
      title: "The line is 20%.",
      body: "Up to 20% off, sales stayed profitable at an 11.9% margin. Every discount level above 20% made a net loss, and above 50% off every single sale lost money.",
      img: img(
        "discount",
        "finding-1",
        1600,
        896,
        "Bar chart of total profit at each discount level",
      ),
      layout: "side",
    },
    {
      title: "It’s the discount, not the products.",
      body: "The products sold at 30–50% off make 27¢ on every $1 at full price, close to the company average. At those discounts they lost 20¢. And it was routine: 565 of 793 customers got at least one discount above 20%.",
      img: img(
        "discount",
        "page-product-groups",
        1600,
        896,
        "Product groups page of the Power BI report",
      ),
      layout: "side-reverse",
    },
    {
      title: "20% is the best cap I tested.",
      body: "I re-priced every past order under caps from 20% to 50%. The 20% cap adds the most profit under every assumption. Tables, Storage and Supplies still lose money even at up to 20% off, so they need a price review as well.",
      img: img(
        "discount",
        "finding-3",
        1600,
        896,
        "Chart comparing extra profit under 20 to 50 percent caps",
      ),
      layout: "side",
    },
  ],
  decision: {
    nav: "Decision",
    over: "WHAT IF WE CAP AT 20%? · MODELLED",
    a: "It pays, however customers ",
    b: "react",
    c: ".",
    modesLabel: "Customer reaction",
    modes: [
      {
        id: "all",
        label: "Everyone still buys",
        value: "+$219K",
        text: "if every customer still buys at the capped price.",
        width: "100%",
      },
      {
        id: "lost",
        label: "Those sales lost",
        value: "+$135K",
        text: "if the deeply discounted sales are lost entirely.",
        width: "61.6%",
      },
      {
        id: "orders",
        label: "Whole orders cancelled",
        value: "+$111K",
        text: "even if every affected order were cancelled outright.",
        width: "50.7%",
      },
    ],
    scale: ["$0", "Extra profit over 2014–17, with a 20% cap", "$219K"],
  },
  camps: [
    {
      title: "Cap at 20%",
      tag: "8 groups",
      list: "Binders, Tables, Machines, Bookcases, Appliances, Chairs, Phones, Furnishings",
      tone: "accent",
    },
    {
      title: "Review prices",
      tag: "3 groups",
      list: "Tables, Storage, Supplies: losing money even at up to 20% off",
      tone: "red",
    },
    {
      title: "Fine as they are",
      tag: "7 groups",
      list: "Labels, Paper, Envelopes, Copiers, Fasteners, Accessories, Art",
      tone: "green",
    },
  ],
  method: [
    {
      k: "SQL Server",
      v: "T-SQL with CTEs, window functions and stored procedures for the scenario and monitoring logic.",
    },
    {
      k: "Checks",
      v: "33 automated checks that reconcile totals, plus Python cross-checks against the SQL results.",
    },
    {
      k: "Power BI",
      v: "A four-page report with a what-if page and Deneb custom visuals, for a quarterly check-in.",
    },
    {
      k: "Recommendation",
      v: "Pilot the 20% cap in two regions for two quarters before rolling it out, because the real risk is losing customers.",
    },
  ],
  github: "https://github.com/ruhinb/Data_Analysis_Projects/tree/main/discount-guardrails",
  githubLabel: "SQL, report and data on GitHub ↗",
};

const slice: CaseStudy = {
  slug: "slice",
  t1: "Slice & Co.",
  t2: "Pizza Operations",
  card: {
    meta: "POWER BI · POWER QUERY · DAX · FIVE-PAGE REPORT",
    question:
      "When does a pizza kitchen’s revenue come in, which pizzas earn it, and does staffing match demand? 21,350 orders and $817.9K of sales.",
    stat: "56%",
    statText: "of revenue arrives in two rushes, plus a $13K-a-year upsell.",
    pages: [
      {
        name: "Executive",
        img: img(
          "slice",
          "page-executive",
          1600,
          900,
          "Executive page of the Slice & Co. Power BI report",
        ),
        caption: "$817.9K of revenue from 21,350 orders in 2015.",
      },
      {
        name: "Demand",
        img: img("slice", "page-demand", 1600, 900, "Demand page of the Slice & Co. report"),
        caption: "56% of revenue arrives in two rushes, at lunch and dinner.",
      },
      {
        name: "Menu",
        img: img("slice", "page-menu", 1600, 900, "Menu page of the Slice & Co. report"),
        caption: "38% of orders are a single pizza. Converting 1 in 10 is worth about $13K a year.",
      },
      {
        name: "Trading days",
        img: img(
          "slice",
          "page-trading-days",
          1600,
          900,
          "Trading days page of the Slice & Co. report",
        ),
        caption: "21 unusual trading days, each checked against a typical same weekday.",
      },
      {
        name: "Workforce",
        img: img("slice", "page-workforce", 1600, 900, "Workforce page of the Slice & Co. report"),
        caption: "Does staffing match demand through the day?",
      },
    ],
  },
  overline: "CASE STUDY · HOSPITALITY · POWER BI, POWER QUERY, DAX",
  lead: "Sales were flat in 2015, so growth has to come from serving the rushes better, selling bigger baskets and rostering staff where the customers are.",
  hero: {
    ...img(
      "slice",
      "page-executive",
      1600,
      900,
      "Executive page of the Slice & Co. Power BI report",
    ),
    caption: "The executive page of the five-page Power BI report, built for the General Manager.",
  },
  kpis: [
    { k: "REVENUE", v: "$817.9K", tone: "tx" },
    { k: "ORDERS", v: "21,350", tone: "tx" },
    { k: "AVG ORDER VALUE", v: "$38.31", tone: "tx" },
    { k: "LABOUR, % OF REVENUE", v: "38.0%", tone: "red" },
  ],
  question: "When does the money come in, which pizzas earn it, and is the roster right?",
  questionBody:
    "Slice & Co. is a single-site pizza kitchen selling 32 pizzas across four categories and five sizes. In 2015 it took 21,350 orders worth $817.9K. The General Manager could see the daily takings, but not when the money came in, why some days were different, or whether staff were on at the right times. I analysed all 48,620 order lines.",
  findings: [
    {
      title: "Two rushes make the day.",
      body: "56% of revenue arrives in about five hours: lunch (12:00–1:30 PM, 21%) and dinner (4:30–8:00 PM, 35%). Friday is the busiest day at 70.8 orders, and Sunday the quietest at 50.5.",
      img: img(
        "slice",
        "finding-1",
        1600,
        394,
        "Orders by weekday and hour, and average orders by half-hour",
      ),
      layout: "wide",
    },
    {
      title: "The basket is the biggest lever.",
      body: "38% of orders are a single pizza, averaging $16.52 against $51.66 for multi-pizza orders. If 1 in 10 of them added a second pizza, revenue would rise by about $13K a year with no new customers.",
      img: img(
        "slice",
        "finding-2",
        1600,
        173,
        "Menu KPI cards: top pizzas, average selling price and single-pizza order share",
      ),
      layout: "wide",
    },
    {
      title: "Unusual days follow the calendar.",
      body: "21 days stood out against a typical same weekday. The biggest spikes fell on Independence Day, Thanksgiving, Black Friday and Super Bowl Sunday (+65% to +89%), and came from more customers, not bigger orders.",
      img: img(
        "slice",
        "finding-3",
        1600,
        560,
        "Investigation of Saturday 4 July 2015 against a typical Saturday",
      ),
      layout: "wide",
    },
  ],
  decision: {
    nav: "Roster",
    over: "WHAT IF THE ROSTER FOLLOWED DEMAND? · MODELLED",
    a: "Labour sits in the wrong ",
    b: "hours",
    c: ".",
    modesLabel: "Saving by day",
    modes: [
      {
        id: "week",
        label: "Whole week",
        value: "$39.6K",
        text: "saved a year, taking labour from 38.0% to 33.1% of revenue.",
        width: "100%",
      },
      {
        id: "sun",
        label: "Sunday",
        value: "$12.5K",
        text: "a year: Sunday gets the heavy weekend roster on the quietest day of the week.",
        width: "31.6%",
      },
      {
        id: "sat",
        label: "Saturday",
        value: "$10.2K",
        text: "a year from a lighter Saturday roster.",
        width: "25.8%",
      },
      {
        id: "fri",
        label: "Friday",
        value: "$7.9K",
        text: "a year, even on the busiest day of the week.",
        width: "19.9%",
      },
    ],
    scale: ["$0", "Yearly labour saving with a demand-based roster", "$39.6K"],
    note: "The staffing data is a synthetic scenario, disclosed in the README. The roster rule is a sizing signal, not a final roster.",
  },
  camps: [
    {
      title: "Serve the rushes",
      tag: "Kitchen lead",
      list: "Finish prep before 11:30 AM and 4:30 PM, and put the strongest team on Friday lunch and Friday 5–7 PM.",
      tone: "accent",
    },
    {
      title: "Grow the basket",
      tag: "Front counter",
      list: "Offer a second pizza or a side with every single-pizza order: about +$13K a year if 1 in 10 converts.",
      tone: "blue",
    },
    {
      title: "Fix menu and roster",
      tag: "General Manager",
      list: "Reprice or resize Brie Carre, stagger afternoon shift starts and give Sunday a lighter roster.",
      tone: "red",
    },
  ],
  method: [
    {
      k: "Power Query",
      v: "One flat file of 48,620 order lines reshaped into a star schema: three fact tables and five lookup tables.",
    },
    {
      k: "DAX",
      v: "99 measures in a dedicated table, including the typical-same-weekday comparison that flags unusual days.",
    },
    {
      k: "Power BI",
      v: "Five pages with one sidebar, filters, a Reset button and auto-written insight panels for the General Manager.",
    },
    {
      k: "Caveats",
      v: "One year of data, so comparisons stay within 2015. Impact estimates assume customers behave as they did that year.",
    },
  ],
  github: "https://github.com/ruhinb/Data_Analysis_Projects/tree/main/slice-and-co-pizza-analytics",
  githubLabel: "Report, data and findings on GitHub ↗",
};

export const caseStudies: CaseStudy[] = [patientcare, discount, slice];

export const getCaseStudy = (slug: string) => caseStudies.find((c) => c.slug === slug);

/** The case study that follows this one, wrapping round at the end. */
export const nextCaseStudy = (slug: string) => {
  const i = caseStudies.findIndex((c) => c.slug === slug);
  return caseStudies[(i + 1) % caseStudies.length];
};

// Smaller projects, listed under the featured cards. They link straight to GitHub.
export type MoreProject = {
  title: string;
  description: string;
  context: string;
  href: string;
  categories: ("Capstone" | "Machine learning")[];
};

export const moreProjects: MoreProject[] = [
  {
    title: "Emotional shifts on Beyond Blue",
    description:
      "42,961 forum messages scored with RoBERTa: 70% negative, and disasters didn’t shift it.",
    context: "MDS CAPSTONE · 2025",
    href: "https://github.com/ruhinb/Capstone_Projects",
    categories: ["Capstone", "Machine learning"],
  },
  {
    title: "IoT entry gate with COVID-19 checks",
    description: "Raspberry Pi: RFID, mask check, temperature and SpO2, logged to Firebase.",
    context: "BSC EEE CAPSTONE · 2022",
    href: "https://github.com/ruhinb/Capstone_Projects",
    categories: ["Capstone"],
  },
  {
    title: "Three networks, one image test",
    description: "ResNet-18 vs AlexNet vs a simple CNN on CIFAR-10. The winner: 81% accuracy.",
    context: "DEEP LEARNING · 2024",
    href: "https://github.com/ruhinb/Deep_learning_Projects",
    categories: ["Machine learning"],
  },
  {
    title: "Predicting Google’s share price",
    description:
      "LSTM and GRU within a few dollars a day, yet no better than a coin flip on direction.",
    context: "DEEP LEARNING · 2024",
    href: "https://github.com/ruhinb/Deep_learning_Projects",
    categories: ["Machine learning"],
  },
  {
    title: "Can one neuron spot diabetes?",
    description: "768 patients, 71% accuracy, and half the insulin readings were secretly zeros.",
    context: "DEEP LEARNING · 2024",
    href: "https://github.com/ruhinb/Deep_learning_Projects",
    categories: ["Machine learning"],
  },
];

export const projectCategories = ["All", "Analytics", "Machine learning", "Capstone"] as const;
export type ProjectCategory = (typeof projectCategories)[number];
