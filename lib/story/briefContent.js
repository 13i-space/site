// Content for Aaron's briefing page (/story/aaron). Plain data, client-safe.
// Paul: edit the words here freely. The page layout lives in app/story/aaron.

export const NOTE = {
  greeting: "Aaron,",
  paragraphs: [
    "I've spent a lot of time with your Story Guide and your Champion notes, and I built something with them. Before we talk about any plan, I want you to see your work running: all seven units, every writing lab, guided one step at a time by a Champion that talks the way you teach Champions to talk.",
    "This page is just for you. It lays out the idea, lets you try the prototype, shows where I think your method is strongest and where it needs you, and asks the questions only you can answer. Nothing here is final. It's a best-guess first draft, built to be changed by you.",
  ],
  signoff: "Paul",
};

export const IDEA = [
  { k: "What", v: "Story of Self, online, for one person at a time. An AI Story Champion trained on your method guides each lesson, with real people at the moments that matter most." },
  { k: "Who", v: "Young adults, about 17 to 21, in the year after high school: heading to college, work, a trade or a gap year. Parents buy it. Teens use it." },
  { k: "Why now", v: "They're living a rite of passage right now, in the in-between space your Cave unit describes. And AI can finally hold a real, careful conversation, so a Champion costs dollars per person instead of hours of your time." },
  { k: "Why it works", v: "Your method was already built around a guide who asks questions and never hands out answers. That's exactly what a well-built AI does best." },
];

// How 13i.space, and Story itself, follow Explore · Play · Create.
export const EPC = [
  {
    mode: "Explore",
    aaron: "When we shift to our Higher Value we begin to see new possibilities.",
    site: "On 13i.space: the book, the music, the galaxy and the short stories. You wander in and discover.",
    story: "In Story: the lessons. Seven units of questions that let a young person look at their own life with curiosity.",
  },
  {
    mode: "Play",
    aaron: "It is not about being perfect, but to constantly strive to grow.",
    site: "On 13i.space: the games and the puzzles. Low stakes, try again, get better.",
    story: "In Story: the Champion conversations. No wrong answers, ideas tried out loud, one question at a time.",
  },
  {
    mode: "Create",
    aaron: "By becoming our best selves we have the opportunity to impact others around us.",
    site: "On 13i.space: write your own story, build your own species, compose your own signal.",
    story: "In Story: Story Write. Each draft lands in their own Story of Self, ready to read aloud and give away.",
  },
];

export const TEST_PATH = [
  { t: "Do Unit 1 as yourself", d: "From the launch page at the end of this briefing, press Start free, then Begin. Make a Story account (it's separate from your 13i account; any email works, and you'll confirm you're 18+). Then walk through Lessons 1 to 4 as Aaron. This is the free part of the plan." },
  { t: "Then be an 18-year-old", d: "Make a second Story account and answer as a kid finishing senior year might: unsure, a little guarded, short answers. Watch how the Champion draws them out." },
  { t: "Push on the hard parts", d: "Later lessons unlock in order, like the real program. When you reach the Defining Moment or Despair, try giving it something heavy, or say you're not okay. See how it slows down, and where it points people to real help." },
  { t: "Read what it built", d: "Open My Story Write. Every draft the Champion helped write is there, in your Final Write order, with word counts and a reading view." },
];

// A sample exchange from Lesson 1, written to show the Champion's style.
// A real session will go differently every time.
export const TRANSCRIPT = [
  { who: "champion", text: "Hey Maya, welcome. Story of Self is a journey to understand the story you've been living, so you can choose the story you want to live next. We walk it with four values: All In · People First · Community (\"one boat rises, all boats rise\") · Do the Impossible. Before we start, what's something you've heard about Story, or something you're curious about?" },
  { who: "you", text: "honestly my mom signed me up lol. i guess im curious if it'll help me figure out what to do after summer" },
  { who: "champion", text: "That's an honest start, and a good question to carry with you. I won't hand you a plan, but by the end you'll know a lot more about the person making it. So let's start with you. What are 5 words you believe uniquely describe who you are?" },
  { who: "you", text: "loyal, stubborn, funny, anxious, creative" },
  { who: "champion", text: "Loyal, stubborn, funny, anxious, creative. Two of those pull against each other in an interesting way: stubborn digs in, anxious worries. If you could keep just one of the five, which one is most you?" },
];

export const METHOD_MAP = [
  { aaron: "“In Story, we do not have the answers. They do!”", bot: "The Champion only asks questions. It never writes their story for them. When it helps shape a draft, it uses only their words and saves nothing until they approve it." },
  { aaron: "“Coaching Story is like detective work.”", bot: "It reflects back the clues it notices (a pattern, a contrast, a word that keeps coming up) before it asks the next question." },
  { aaron: "What → So What → Now What", bot: "Every debrief runs in that order: the facts, then how the facts became their story, then what it means for their life right now." },
  { aaron: "One step at a time.", bot: "Each lesson is a short series of steps shown beside the conversation. One question at a time, short replies, no walls of text." },
  { aaron: "Let it eat.", bot: "It suggests a pause after each unit, and a daily limit closes the day with your words: let it sit with you and come back tomorrow." },
  { aaron: "Champion meetings, every week.", bot: "Every lesson is a Champion conversation. Progress saves as they go, and the Champion picks up exactly where they left off." },
  { aaron: "Story Write and the Final Write.", bot: "Each approved draft lands on My Story Write, assembled in your Final Write order with your word-count targets." },
  { aaron: "Finish first, edit last.", bot: "Writing labs keep moving forward. Unit 7 walks back through the whole story with your five Close the Circle rules." },
  { aaron: "The Story Mark.", bot: "The last lesson ends with a personal note from the Champion, marking the rite of passage." },
  { aaron: "“Not a replacement for professional care.”", bot: "Clear safety rules override everything: stop the lesson, point to 988 or a trusted adult, and never act like a therapist." },
];

export const ADAPTATIONS = [
  "No recovery or crisis language. Most 18-year-olds haven't hit a rock bottom, so the Champion never treats them as broken.",
  "At every hard step they choose how deep to go: a true rock bottom, their hardest season, or a smaller low point.",
  "Your rule that a Defining Moment doesn't have to be trauma is said up front, and the Champion never asks for graphic details.",
  "Destruction gets quieter, age-true examples: ghosting friends, quitting things, numbing out with screens.",
  "The film lessons (Lion King, Rocky, Batman Begins, Braveheart, Coach Carter) are told in a few sentences, because we can't license the clips.",
  "The Coach Carter passage is summarized, not recited, and points to page 102 of your guide.",
  "Graduation is named as the rite of passage they're living right now.",
  "Sign-up is 18+ for now, with the crisis lines in the footer of every page.",
];

export const SWOT = {
  strengths: [
    ["A real structure", "The 6 C's map onto the hero's journey, which people already understand. Each unit builds on the last, so it feels like a journey, not a pile of worksheets."],
    ["The Hidden Value flip", "“I am invisible” becomes “I can see potential.” Simple, emotional, memorable. It's what people will talk about."],
    ["It ends with something real", "A written story of about 1,200 words, read aloud to someone. Most programs end with insights. Yours ends with a finished thing and a rite of passage."],
    ["Research behind it", "Narrative identity research (Dan McAdams) and expressive writing research (James Pennebaker) both support this kind of work."],
    ["Built for a guide", "“We don't have the answers, they do” is exactly how a good AI guide should behave. Your Champion model translates."],
    ["A practical payoff", "Defining Moment → Insight → Higher Value is the arc of a strong college or scholarship essay, and the best answer to “tell me about yourself.”"],
  ],
  watch: [
    ["Built for recovery", "Units 3 and 4 are heavy for an 18-year-old. The prototype softens them, but they need your eye most."],
    ["Length", "22 sessions is a lot online. Saved progress and pauses help. Human check-ins at key moments would help more."],
    ["The film clips", "Teens may not know these films, and we can't use the clips. Original short videos from you could replace them."],
    ["The human layer", "The Champion relationship is the real engine. AI can carry the steps; some moments may still need a person."],
  ],
  opportunities: [
    ["Institutions", "High-school senior seminars, college first-year programs, gap-year programs, churches, youth groups and athletic programs all buy belonging and purpose."],
    ["Champion certification", "Train counselors, coaches and youth leaders to run the human sessions, for a fee."],
    ["The graduation gift", "A one-time purchase that parents and grandparents can give at the exact moment the need is highest."],
    ["Back to adults", "Once proven with teens, return to adults in transition (career change, divorce, recovery) with the full-strength version."],
  ],
  risks: [
    ["Safety and liability", "Young people will write about their lowest moments. Crisis rules are built in; a counselor should review them before beta."],
    ["Privacy", "These are some of the most personal words a person will ever write. Privacy has to be airtight and said plainly to parents."],
    ["Getting customers", "Ads to parents get expensive fast. The emotional ending (a kid reading their story to their family) is the best marketing we have."],
    ["Generic AI apps", "Journaling and coaching apps are everywhere. Your method, your story and the finished Story of Self are what set this apart."],
  ],
};

export const TIERS = [
  { name: "Free", price: "$0", what: "All of Unit 1, ending with a shareable snapshot of their five words and their call to adventure. The paywall comes right before the Defining Moment." },
  { name: "Story Journey", price: "$149–199", note: "one time", what: "The full AI-guided program, all seven units, their saved Story Write and a reading view of the finished story." },
  { name: "Journey + Champion", price: "$499–799", note: "one time", what: "Everything above, plus 3 or 4 live video sessions with a trained human Champion and a final Story Night reading." },
  { name: "Gift", price: "any tier", what: "Sold as a graduation gift card, for parents and grandparents." },
];

export const PLAN = [
  {
    t: "The problem and the opportunity",
    p: [
      "Every graduate gets a plan for where they're going. Almost none get help with who they are. The year after high school is when identity is most in motion and support is thinnest: they've left the structure of school, and parents feel shut out.",
      "Story of Self already works with people one guide at a time. Selling it to rehab companies put it in front of a hard buyer with a long sales cycle. Selling it directly to families puts it in front of people who feel the need personally, at a predictable time every year.",
    ],
  },
  {
    t: "Customer",
    p: [
      "The user is 17 to 21, finishing high school or in the first year after. The buyer is usually a parent, sometimes a grandparent. Market to parents, design for teens.",
      "Parents are buying outcomes they already worry about: direction, confidence, knowing who you are before you leave home. We describe it as guided reflection, never as therapy.",
    ],
  },
  {
    t: "Product",
    p: [
      "Seven units, 22 lessons, each a conversation with the Story Champion, following your Story Guide and Build Foundation sessions. Progress saves between visits. Every writing lab adds to their Story Write, and the program ends with the full Story of Self and a reading.",
      "The premium tier adds human Champions at the moments you choose. That's the part of the business only you can define.",
    ],
  },
  {
    t: "Pricing, free and paid",
    p: [
      "This is a journey with an end, so it's sold once, not as a subscription. Unit 1 is free: it's warm, safe and useful on its own. The paywall sits right before the Defining Moment, when they're invested and the next step is clear.",
      "A free parent guide (how to support your kid through this transition) doubles as the parent-facing sales page.",
    ],
  },
  {
    t: "Getting customers",
    p: [
      "Two seasons drive sales: graduation (April to June) and pre-college (August). Early customers come from people we know, your past students and families, and word of mouth from finished stories.",
      "Once there's proof with families, the same results become the pitch to institutions: schools, colleges, gap-year programs, churches and athletic programs.",
    ],
  },
  {
    t: "Costs and margins",
    p: [
      "The AI Champion's cost per finished journey is estimated at roughly $5 to $20, depending on the model and how much people write. We'll measure the real number during alpha. Hosting and the database cost little at this size.",
      "The real cost is getting customers and paying human Champions for the premium tier. Both are tested in beta before anything scales.",
    ],
  },
  {
    t: "Safety and trust",
    p: [
      "Crisis rules are built into every lesson and the footer of every page. Before beta: a review by a licensed counselor, a clear privacy policy written for parents, and a way for a human to follow up if the Champion flags a safety concern.",
    ],
  },
  {
    t: "What success looks like",
    p: [
      "Alpha: do young people finish Unit 1 and want to keep going? Beta: do they finish the whole story, and will parents pay? Launch: a first graduation season with real families, and the stories to show institutions.",
    ],
  },
];

export const ROADMAP = [
  {
    q: "Q4 2026",
    title: "Commit and finish",
    items: [
      "You walk through this page and the prototype",
      "Commit to the new direct-to-family model",
      "Finish the prototype together, guided by your answers below",
      "Alpha test with a handful of young people over winter break",
    ],
  },
  {
    q: "Q1 2027",
    title: "Beta and the human layer",
    items: [
      "Full beta testing with a larger group",
      "You define the human-level interactions: where a live Champion steps in, and how",
      "Safety review by a licensed counselor",
      "Test what people will pay",
    ],
  },
  {
    q: "Q2 2027",
    title: "Launch",
    items: [
      "Roll out the full version",
      "Parent page, payments and gift cards",
      "Gear up for the post-graduation season",
    ],
  },
];

export const NEEDS = [
  ["Your eyes on the prototype", "Walk through it as yourself and as an 18-year-old. Roughly 2 to 3 hours a week through Q4."],
  ["Your answers below", "Each one changes how the Champion behaves. A few words is enough to start."],
  ["One conversation per unit", "As you test, a short call after each unit to talk through what you'd change."],
  ["A few alpha testers", "Help find 5 to 10 young people (and their parents) for winter break."],
  ["Decisions, in order", "First: is this the direction? Then: the teen adaptations, the safety approach and, in Q1, the human touchpoints."],
];

const S = (key, q, context) => ({ key, q, context });

export const GUIDANCE = [
  {
    id: "method",
    title: "The method, overall",
    items: [
      S("age", "Who it's for", "The prototype is built for 17 to 21 year olds leaving high school, and sign-up is 18+ for now. Is that the right starting point, or would you start with seniors (16 to 17, with a parent's consent)?"),
      S("voice", "The Champion's voice", "After a lesson or two: does it sound like a Champion you'd train? What feels off?"),
      S("depth", "How deep they go", "At every hard step they can choose a true rock bottom, their hardest season or a smaller low point. Does that protect your method or water it down?"),
      S("faith", "Faith language", "Your guide says “life, fate, God” in places, and the Coach Carter passage says “child of God.” Keep that wording, soften it, or let each person choose?"),
    ],
  },
  {
    id: "u1",
    title: "Unit 1 · Character",
    items: [
      S("u1_stages", "Life stages for 18-year-olds", "Your timeline runs to 26 and on. In the prototype, teens imagine their 18 to 26 stage instead of describing it. Does that work?"),
      S("u1_free", "Unit 1 as the free gift", "The plan gives away all of Unit 1. Is that the right amount, too much or too little?"),
    ],
  },
  {
    id: "u2",
    title: "Unit 2 · Challenge",
    items: [
      S("u2_clips", "Story lessons without film clips", "The Champion tells the Lion King, Rocky, Batman Begins, Braveheart and Coach Carter stories in a few sentences. Would you rather record short videos of yourself, choose newer films, or keep it as is?"),
      S("u2_dm", "Defining Moments that involve trauma", "If someone picks a moment involving abuse or current danger, the Champion thanks them, doesn't probe, points them to a real person and offers to choose a different moment. Is that how you'd handle it?"),
    ],
  },
  {
    id: "u3",
    title: "Unit 3 · Choice",
    items: [
      S("u3_fall", "The Fall for teens", "Defiance, Disruption and Destruction come from recovery work. The Champion uses quieter examples for teens. Is that right? Should any of the names change for this age?"),
    ],
  },
  {
    id: "u4",
    title: "Unit 4 · Cave",
    items: [
      S("u4_despair", "The Despair lesson", "The most sensitive lesson. The Champion checks in first, lets them choose a smaller low point or stop, and always points straight to Hope. What else should it do?"),
      S("u4_symbolic", "Symbolic acts", "Letting go of an object that stands for fear, and placing one that stands for courage, are offered but not required. Keep them optional online?"),
    ],
  },
  {
    id: "u5",
    title: "Unit 5 · Change",
    items: [
      S("u5_examples", "Higher Value examples", "Your Hidden → Higher Value pairs are the Champion's examples. Want to add a few that sound like 18-year-olds?"),
    ],
  },
  {
    id: "u6",
    title: "Unit 6 · Create",
    items: [
      S("u6_poem", "“Our Deepest Fear”", "For copyright reasons the Champion summarizes the passage instead of reciting it, and points to page 102 of your guide. OK?"),
    ],
  },
  {
    id: "u7",
    title: "Unit 7 · Close the Circle",
    items: [
      S("u7_telling", "Telling the story", "There's no live cohort yet, so the Champion helps each person choose a real person to read to. What should a Story Night look like, online or in person?"),
      S("u7_mark", "The Story Mark", "Online it's a personal note from the Champion. Should paid tiers get something physical, like a coin or card in the mail?"),
    ],
  },
  {
    id: "human",
    title: "The human layer",
    items: [
      S("h_where", "Where a person must step in", "Which moments need a live Champion, not AI? For example: after the Defining Moment, after Despair, the final telling."),
      S("h_train", "Training human Champions", "Who would you train first: counselors, coaches, youth leaders, parents? How long does Champion training take today?"),
      S("h_assets", "What you already have", "Do you have lesson videos, recordings or talks we could use or re-record?"),
      S("h_levels", "Champion certification levels", "Free Foundations, then Level 1 ($249, one-on-one) and Full ($999, cohorts and Story Night). Is that the right ladder? What must someone prove before they champion a real student?"),
      S("h_rubric", "The practice scoring rubric", "The Practice Room scores five things: questions not answers, detective listening, What → So What → Now What, building trust, and the key skill for the moment. What would you add or change?"),
      S("h_founding", "Founding Champions", "Who could be the first 10 to 20 Champions? Do people you trained in your earlier programs still lead Story?"),
    ],
  },
  {
    id: "business",
    title: "The business",
    items: [
      S("b_price", "Pricing", "Free Unit 1, then $149 to $199 for the AI journey, then $499 to $799 with live Champion sessions. Gut reaction?"),
      S("b_channels", "Who you already know", "Which schools, colleges, churches, gap-year programs or coaches do you already have relationships with?"),
      S("b_name", "The name for this audience", "Is it Story of Self for teens too, or does it need its own name?"),
    ],
  },
  {
    id: "other",
    title: "Anything else",
    items: [S("other", "What I didn't ask", "Anything you love, anything that worries you, anything I got wrong.")],
  },
];

export const GUIDANCE_KEYS = GUIDANCE.flatMap((g) => g.items.map((i) => i.key));
export const STATUSES = { keep: "Keep it", change: "Change it", talk: "Let's talk" };

// "Explore the Champion program" panel on /story/aaron.
export const CHAMPION_PLAN = {
  intro: [
    "The human layer is what makes Story work, and right now it depends on you. A Champion program turns your training into something that scales: an AI-guided certification that brings people in free, certifies them to champion students one-on-one, and grows them into leaders of full cohorts.",
    "Your toolkits already say how. Build Foundation opens with \u201CAnyone Can Lead Story.\u201D SEE says Champions learn by experiencing the lessons themselves before leading them. So every Champion walks their own Story of Self first, which also makes every Champion candidate a Story customer.",
  ],
  loop: ["A student finishes their Story", "Involve: \u201CHow will I use my story to guide others?\u201D", "They train as a Champion", "They champion new students", "Those students finish their Story"],
  levels: [
    { name: "Champion Foundations", price: "Free", what: "Welcome and the Framework for Coaching, plus a first conversation with an AI Master Champion. Ends with a badge." },
    { name: "Certified Champion · Level 1", price: "$249", what: "Their own Story journey, SEE the six lessons and the Story Write, the Practice Room, safety training and a scored assessment. Qualifies them for paid one-on-one sessions." },
    { name: "Certified Champion · Full", price: "$999", what: "Build Foundation: all 24 sessions, an observed demonstration, supervised sessions with real students and a Story Night. Qualifies them to lead cohorts." },
    { name: "Renewal", price: "$99 / yr", what: "Continuing education to stay in the active pool. Keeps quality up and the community connected." },
  ],
  earn: [
    ["Live one-on-one sessions", "The Journey + Champion tier includes 3 or 4 live sessions. A Champion might earn $40 to $60 a session."],
    ["Cohorts and Story Nights", "Full Champions can run paid group cohorts, the way your program ran in facilities, now for families."],
    ["Institutions certifying their own people", "Youth pastors, school counselors, coaches and gap-year leaders. Possibly the biggest buyer, and a better B2B market than rehab."],
  ],
  practice: "The Practice Room is the part a PDF can't do. The AI plays students drawn from your own warnings: the guarded first session, the Fall told as a timeline, someone stuck on trauma, someone who can't see their own good, a safety moment, and the student who wants to freestyle Story Night. A Master Champion then scores the session on your rubric and quotes the trainee's best question back to them.",
  pool: "Grow the pool to match demand: roughly one Champion for every 15 to 20 students in the premium tier. Start with 10 to 20 founding Champions from your network, piloted in Q1 2027, so trained people are ready when families arrive in Q2.",
  safeguards: [
    "Background checks, a code of conduct and safety training before anyone works with students.",
    "All contact on the platform, never personal phones or social media.",
    "\u201CCertified Story Champion,\u201D never anything that sounds like a counseling license.",
    "Real standards (scored practice, supervised sessions) so it never becomes a certificate mill.",
  ],
  tryIt: [
    "From the launch page, choose Champions, then start free with Module 1",
    "Unlock Level 1 (free in the preview) and walk the six lessons on the Story Circle",
    "Champion Maya, then Jordan, in the Practice Room and read your debrief",
    "Finish the assessment and claim your Digital Certificate",
  ],
};
