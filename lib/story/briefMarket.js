// "Understand your target market" on /story/aaron. National figures gathered
// Oct 2026 from CDC, NIMH/SAMHSA, BLS, NCES, WICHE, National Student
// Clearinghouse, Healthy Minds, Gallup, Pew, Common Sense Media and NBC/SurveyMonkey.
// Years and definitions vary, so treat them as solid approximations.

export const MARKET_INTRO =
  "Each year about 3.8 million kids finish high school. Roughly 6 in 10 start college that fall, about 1 in 4 of those are gone by sophomore year, and this is the age group with the highest rate of mental illness. The numbers point almost exactly at what Story of Self does.";

export const HEADLINES = [
  { value: "3.8M", label: "high school graduates a year", note: "2025 was the all-time peak" },
  { value: "62.8%", label: "start college the fall after", note: "69.5% of women, 55.4% of men" },
  { value: "1 in 4", label: "college freshmen don't return for year two", note: "about 550,000 a year" },
  { value: "36.2%", label: "of 18–25s had a mental illness last year", note: "the highest of any adult age" },
];

// Fall after graduation, as shares of the class (BLS, Oct 2024).
export const PATHS = [
  { key: "four", label: "4-year college", pct: 41.9, n: "~1.6M", color: "#256abf" },
  { key: "two", label: "2-year college", pct: 20.9, n: "~0.8M", color: "#C25B34" },
  { key: "none", label: "Not in college", pct: 37.2, n: "~1.4M", color: "#1baf7a" },
];

export const NOT_COLLEGE = [
  { v: "66%", t: "of non-college grads are working or looking for work, with 20% unemployment" },
  { v: "2–3%", t: "of all grads take a planned gap year (about 75,000 to 110,000 kids)" },
  { v: "146K", t: "military enlistments in FY2024, all ages, mostly young" },
  { v: "6.6%", t: "growth in undergraduate certificate enrollment in fall 2025, faster than degrees" },
  { v: "12%", t: "of 16–24-year-olds are in neither school nor work" },
];

export const COLLEGE_BY_SEX = [
  { label: "Young women", pct: 69.5 },
  { label: "Young men", pct: 55.4 },
];

// Out of 100 first-time college students (NSC).
export const COLLEGE_FUNNEL = [
  { label: "Start college", v: 100 },
  { label: "Back for second semester", v: 86 },
  { label: "Back for second year", v: 77 },
  { label: "Earn any credential in 6 years", v: 61 },
];

export const STOPOUT = [
  { label: "Considered stopping out in the last 6 months", pct: 32 },
  { label: "…because of emotional stress", pct: 49, sub: true },
  { label: "…because of mental health", pct: 41, sub: true },
];

// CDC YRBS 2023, high school students, past year.
export const YRBS = [
  { label: "Persistently sad or hopeless", girls: 52.6, boys: 27.7, all: 39.7 },
  { label: "Poor mental health", girls: 38.8, boys: 18.8, all: 28.5 },
  { label: "Seriously considered suicide", girls: 27.1, boys: 14.1, all: 20.4 },
  { label: "Attempted suicide", girls: 12.6, boys: 6.4, all: 9.5 },
];

// NIMH/SAMHSA 2022, any mental illness in the past year.
export const AMI_BY_AGE = [
  { label: "18–25", pct: 36.2, focus: true },
  { label: "26–49", pct: 29.4 },
  { label: "50+", pct: 13.9 },
];

// Healthy Minds Study, college students, 2022 vs 2025.
export const HEALTHY_MINDS = [
  { label: "High loneliness", from: 58, to: 52 },
  { label: "Moderate–severe depression", from: 44, to: 37 },
  { label: "Moderate–severe anxiety", from: 37, to: 32 },
  { label: "Seriously considered suicide", from: 15, to: 11 },
];

// NBC News / SurveyMonkey, April 2025.
export const YOUNG_VS_OLD = [
  { label: "Lonely or isolated most of the time", young: 29, old: 8 },
  { label: "Anxious about the future most of the time", young: 56, old: 32 },
];

// Gallup / Walton Family Foundation, Dec 2025.
export const PURPOSE_GAP = [
  { label: "Gen Z still in school", pct: 30 },
  { label: "Gen Z adults, 18–28", pct: 43, focus: true },
];
export const HELPING = [
  { label: "Strongly believe they make a positive difference for others", pct: 93, focus: true },
  { label: "Don't believe they do", pct: 22 },
];

// Common Sense Media, ages 13–17, spring 2025.
export const AI_USE = [
  { label: "Have used an AI companion", pct: 72 },
  { label: "Use one regularly", pct: 52 },
  { label: "Practice social skills with AI before trying them with people", pct: 39 },
];

// WICHE projections, U.S. high school graduates (millions).
export const CLIFF = [
  { year: 2025, v: 3.85 },
  { year: 2030, v: 3.73 },
  { year: 2041, v: 3.45 },
];

export const MEANS = [
  ["Purpose drops right after high school", "30% of Gen Z still in school lack a sense of purpose. Among Gen Z adults it's 43%. Something breaks in the transition, and that's the moment Story of Self is built for."],
  ["Your Call to Action is the research answer", "Gallup's strongest predictor of meaning is believing you make a positive difference for others. That's Involve, almost word for word."],
  ["They're already talking to AI", "The question isn't whether teens will talk to AI. It's whether it's a good one, with guardrails and a method behind it. That's the pitch to worried parents."],
  ["Parents are already worried about this", "Anxiety and depression are parents' #1 worry for their kids: 40% are extremely or very worried, ahead of bullying and physical safety."],
  ["Freshman year is the pinch point, and colleges pay to fix it", "With fewer students coming and stress the top reason students think about leaving, building identity and belonging before day one is a natural sell to college first-year programs."],
  ["Two very different audiences", "Young women report the most distress and anxiety. Young men are less likely to go to college, more likely to drift and far more likely to die by suicide. They likely need different messages."],
  ["Safety is a daily reality, not an edge case", "If 1 in 5 high schoolers seriously considered suicide last year, the Champion will regularly meet kids in real distress. Crisis rules, a counselor review and human follow-up must be ready before beta."],
];
