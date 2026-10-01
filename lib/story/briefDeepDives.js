// Deep dives on /story/aaron: Competition and Launch Plan.
// Competitor facts gathered Oct 2026 from public sources; positions on the map
// are our judgment, not measurements.

export const COMP_INTRO =
  "Lots of products touch this age group: school purpose curricula, campus mental-health apps, AI journals, chatbots, admissions tools and gap-year programs. None of them does what Story of Self does: guide one young person through a proven method to a finished story of who they are, sold to families, at the moment they leave home.";

// x: 0 = sold to institutions .. 1 = sold to families/individuals
// y: 0 = open-ended tool .. 1 = guided journey with a finished outcome
export const MAP = [
  { name: "Story of Self", x: 0.84, y: 0.9, us: true },
  { name: "Wayfinder", x: 0.12, y: 0.72 },
  { name: "Roadtrip Nation", x: 0.24, y: 0.6 },
  { name: "TimelyCare", x: 0.08, y: 0.22 },
  { name: "Nod", x: 0.2, y: 0.38 },
  { name: "Rosebud", x: 0.78, y: 0.2 },
  { name: "ChatGPT & chatbots", x: 0.92, y: 0.08 },
  { name: "Designing Your Life", x: 0.64, y: 0.56 },
  { name: "CollegeVine", x: 0.7, y: 0.4 },
  { name: "Gap-year programs", x: 0.56, y: 0.76 },
];

export const CATEGORIES = [
  {
    cat: "School purpose curricula",
    who: [
      { name: "Wayfinder", fact: "Purpose-based curriculum born at Stanford in 2015; about 2,500 schools and 1 million students, sold to schools and districts." },
      { name: "Roadtrip Nation", fact: "Career-exploration curriculum built on interviews with people who found their path, plus a long-running public TV series." },
    ],
    strength: "Already inside schools, with district budgets and teacher buy-in.",
    gap: "Classroom-paced and broad. It ends when the school year ends, right before graduates need it most, and there's no personal guide.",
  },
  {
    cat: "Campus mental-health platforms",
    who: [
      { name: "TimelyCare", fact: "Virtual care for college students; over 300 colleges and more than a million students." },
      { name: "Nod (Hopelab)", fact: "App for first-year loneliness; a randomized trial found it prevented loneliness and depression in at-risk students. Sold to colleges." },
    ],
    strength: "Clinical credibility, research, and institutional contracts.",
    gap: "Treatment and coping, not identity and purpose. Only available once a student is enrolled, so it misses the summer and the 37% who don't go to college.",
  },
  {
    cat: "AI journals and chatbots",
    who: [
      { name: "Rosebud", fact: "AI journaling “mentor”; raised $6M; free tier, premium at $12.99 a month." },
      { name: "ChatGPT and other chatbots", fact: "About 1 in 5 people aged 18–21 already use them for mental-health advice, and 93% of users found it helpful (RAND/Brown/Harvard, 2025)." },
    ],
    strength: "Free or cheap, always available, and already in their pockets.",
    gap: "Open-ended, with no method, no finished outcome, no human, and uneven safety. Parents don't trust them for their kids.",
  },
  {
    cat: "Life design and coaching",
    who: [
      { name: "Designing Your Life", fact: "Stanford's Life Design Lab approach; a bestselling book, courses and workshops, mostly for college students and adults." },
    ],
    strength: "Respected, research-based, and a strong brand.",
    gap: "Career and choices, designed forward. Story of Self starts with the story they've already lived, which is what makes the choices stick.",
  },
  {
    cat: "Admissions and essay tools",
    who: [
      { name: "CollegeVine and essay coaches", fact: "AI and human help with college lists and essays; parents already pay for essay coaching." },
    ],
    strength: "Parents already spend money here, at the same moment.",
    gap: "Aimed at getting in, not at who they are once they arrive. Story of Self produces a better essay as a side effect.",
  },
  {
    cat: "Gap-year programs",
    who: [
      { name: "Structured gap years", fact: "Only about 2–3% of graduates take one; programs are often expensive and travel-based." },
    ],
    strength: "A real rite of passage with mentors.",
    gap: "Small and costly. Story of Self gives every graduate a rite of passage, without leaving home.",
  },
];

export const COMPARE = {
  cols: ["Story of Self", "School curricula", "Campus mental health", "AI journals & chatbots", "Life design"],
  rows: [
    ["A proven method, step by step", [2, 2, 1, 0, 2]],
    ["Ends with a finished outcome (their written story)", [2, 0, 0, 0, 1]],
    ["Built for the summer after high school", [2, 0, 0, 1, 0]],
    ["A real human guide when it matters", [2, 1, 2, 0, 1]],
    ["Safety rules built in", [2, 1, 2, 1, 1]],
    ["A family can buy it today", [2, 0, 0, 2, 1]],
  ],
};

export const EDGE = [
  ["Aaron's method", "Years of real Story groups, a complete curriculum, and the Hidden Value to Higher Value flip that no one else has."],
  ["A finished story", "Every journey ends with something real: a written Story of Self, read aloud. That's what gets talked about."],
  ["Champions", "A trained human network on top of the AI. Hard to copy, and it gets stronger as it grows."],
  ["The moment", "Built for the summer between high school and what's next, when school supports end and campus supports haven't started."],
];

export const COMP_RISKS = [
  "Wayfinder or a campus platform could build a direct-to-family version. Our answer: move first, and win on the finished story and Champions.",
  "General chatbots get better every month. Our answer: method, safety and a human layer that parents trust.",
  "A big wellness brand could add “purpose” content. Our answer: they'd have content; we'd have a rite of passage.",
];

// ---------- Launch Plan ----------
export const MONTHS = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"];
export const PHASES = [
  { q: "Q4 2026", name: "Build & alpha", from: 0, to: 3, color: "#E99A72", ink: "#3D1A08" },
  { q: "Q1 2027", name: "Beta", from: 3, to: 6, color: "#D9774D", ink: "#2A1206" },
  { q: "Q2 2027", name: "Launch", from: 6, to: 9, color: "#B5502A", ink: "#ffffff" },
  { q: "Q3 2027", name: "Grow", from: 9, to: 12, color: "#7E3414", ink: "#ffffff" },
];

// Gantt rows: [label, [[startMonthIndex, endMonthIndex(exclusive), text], ...]]
export const GANTT = [
  ["Aaron & the method", [[0, 2, "Briefing, decide"], [2, 3, "Teen edits"], [3, 6, "Define human touchpoints"], [6, 12, "Story Nights, content"]]],
  ["Product", [[0, 3, "Finish prototype with Aaron"], [3, 6, "Beta fixes, parent view"], [6, 7, "Payments"], [7, 12, "Improve from data"]]],
  ["Testing", [[2, 4, "Alpha: 5–10 teens"], [4, 6, "Beta: 25–50"], [6, 9, "Launch cohort"]]],
  ["Champions", [[3, 4, "Academy"], [4, 6, "10–20 founding Champions"], [6, 12, "Grow the pool"]]],
  ["Safety & trust", [[3, 5, "Counselor review, privacy"], [5, 12, "Human follow-up in place"]]],
  ["Marketing", [[4, 6, "Waitlist, parent page"], [6, 9, "Graduation season"], [9, 11, "Pre-college push"]]],
  ["Institutions", [[8, 10, "Pitch with results"], [10, 12, "First pilots"]]],
];

export const MILESTONES = [
  { m: 1, t: "Commit", d: "Aaron and Paul commit to the family model" },
  { m: 2.5, t: "Alpha", d: "Winter break: first teens through Unit 1 and beyond" },
  { m: 5, t: "Founding Champions", d: "First Champions certified and paired" },
  { m: 6.5, t: "Launch", d: "Full version live with payments" },
  { m: 7.5, t: "Graduation season", d: "The first real wave of families" },
];

export const GATES = [
  { q: "Q4 2026", name: "Build & alpha", goals: ["Aaron commits to the model", "Prototype finished with his guidance", "5–10 alpha testers over winter break"], gate: "70% of alpha teens finish Unit 1 and want to keep going" },
  { q: "Q1 2027", name: "Beta", goals: ["25–50 beta testers through the whole story", "Safety review and privacy policy done", "Human touchpoints defined; founding Champions trained"], gate: "40% finish their full story, and parents say they'd pay" },
  { q: "Q2 2027", name: "Launch", goals: ["Payments, gift cards and the parent page live", "Waitlist converts at launch", "First paid Journey + Champion families"], gate: "First graduation season: paying families and finished stories to share" },
  { q: "Q3 2027", name: "Grow", goals: ["Pre-college push in August", "Results become the pitch to schools and colleges", "First institutional pilots"], gate: "A repeatable way to get families, and the first institution signed" },
];
