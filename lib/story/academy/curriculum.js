// Story Champion Academy: the curriculum, client-safe.
// Built from Aaron Donaghy's Champion Training Toolkit: SEE and the Champion
// Toolkit: Build Foundation. Section text follows his toolkits closely; the
// Safety module is a prototype proposal for Aaron to review.

export const ACADEMY_ID = "academy"; // story_progress.lesson for Academy progress

export const DEFINITION = { word: "CHAM·PI·ON", meaning: "one who fights for or defends the cause of another" };

export const LEVELS = [
  {
    id: "foundations",
    name: "Champion Foundations",
    price: "Free",
    blurb: "What a Champion is, Aaron's Framework for Coaching, and your first conversation with a Master Champion.",
    modules: ["welcome", "framework"],
    badge: "Foundations",
  },
  {
    id: "level1",
    name: "Certified Champion · Level 1",
    price: "$249",
    priceNote: "includes your own Story of Self journey",
    blurb: "SEE the six lessons and the Story Write, practice with simulated students, master safety, and earn your certificate.",
    modules: ["lessons", "writing", "practice", "safety", "assessment"],
    badge: "Level 1",
  },
  {
    id: "full",
    name: "Certified Champion · Full",
    price: "$999",
    priceNote: "coming next",
    blurb: "Build Foundation: lead all 24 sessions with a cohort, observe a live demonstration, and run supervised Story Nights.",
    modules: [],
    badge: "Full",
  },
];

export const MODULES = [
  { slug: "welcome", n: 1, level: "foundations", title: "Welcome, Champion", tag: "Aims & outcomes", mins: 10, mode: "Explore" },
  { slug: "framework", n: 2, level: "foundations", title: "The Framework for Coaching", tag: "Six steps of every Story session", mins: 30, mode: "Explore" },
  { slug: "lessons", n: 3, level: "level1", title: "SEE the Six Lessons", tag: "Character to Create", mins: 35, mode: "Play" },
  { slug: "writing", n: 4, level: "level1", title: "SEE the Story Write", tag: "Ordinary World to Call to Action", mins: 35, mode: "Play" },
  { slug: "practice", n: 5, level: "level1", title: "The Practice Room", tag: "Champion simulated students", mins: 30, mode: "Play" },
  { slug: "safety", n: 6, level: "level1", title: "Safety, Boundaries & Care", tag: "What every Champion must know", mins: 15, mode: "Create" },
  { slug: "assessment", n: 7, level: "level1", title: "Champion Assessment", tag: "Scenarios + your commitment", mins: 20, mode: "Create" },
];

export const moduleBySlug = (s) => MODULES.find((m) => m.slug === s) || null;

// ---------- Module 1 · Welcome ----------
export const WELCOME = {
  anyone: {
    title: "Anyone Can Lead Story",
    quote:
      "When I was a teacher I always had a small sign right next to my desk which said “Anyone Can Lead”. I did not want to see my students only as learners, but as leaders. Just as it was my job to give them knowledge, I saw it as my responsibility to give them the strength to lead.",
    by: "Aaron Donaghy, Champion Toolkit: Build Foundation",
  },
  aims: [
    { t: "SEE the stages of the Story process", d: "Know the six lessons and six writing elements well enough to see where any person is on the circle." },
    { t: "SEE how to engage people in Story", d: "Build the trust and the questions that let someone step into their own story." },
    { t: "SEE how to deliver and transition Story", d: "Guide each step, and prepare people for how Story keeps working after a session ends." },
  ],
  outcomes: [
    { t: "Plan and integrate Story", d: "Be prepared for every session: the lesson, the space, and yourself." },
    { t: "Knowledge of the Story process", d: "The 6 C's, the Story Write, the Hidden Value and the Higher Value." },
    { t: "Deep understanding of engagement", d: "Questions over answers. What → So What → Now What." },
  ],
  see: "Learning to Champion Story Of Self begins with SEEing, immersing yourself in the living story process before leading it. Observation builds foundational wisdom. By witnessing clients move through the framework, you begin to recognize emotional cues, transformation patterns, and the subtle shifts that mark real growth.",
  bike: [
    { t: "Get on the bike", d: "The best way to learn is to begin." },
    { t: "Feet on the pedals", d: "Everything new is going to be scary at first, but you have to pick your feet up and trust the process." },
    { t: "Push forward", d: "You can make a hundred excuses for why it's not the right time, but the only way to learn is to take the first step." },
    { t: "You are going to crash", d: "This will not go perfectly. Accept mistakes, trial and error, and learn to take small wins." },
    { t: "You will love it in the end", d: "Story takes time and courage, but the results for those you help, and your own growth, will be worth the challenge." },
  ],
  testimony:
    "Looking at my own story has completely changed my life. It’s helped me understand why I am the way I am, why I react the way I do, and how my past has shaped me. Every day I try to take control of my own story making choices that move me in the right direction instead of letting my past choices control my future.",
};

// ---------- Module 2 · The Framework for Coaching ----------
export const FRAMEWORK = [
  {
    n: 1,
    key: "prepared",
    title: "Be Prepared",
    lead: "Each lesson in Story is a journey. We begin each lesson with the wisdom of the Boy Scout motto: Be Prepared! You are the guide. The client is the hero.",
    body: "As guides, it is up to us to be confident in the plan and path we will be taking our clients on. It is our responsibility to minimize the challenges and stress our clients will face as they confront their own story.",
    callouts: [
      { kind: "Mindset", text: "Before you teach Story, check your mindset. Show up grounded, hopeful, and present. Believe in the process and the person in front of you. When you lead with curiosity, confidence, and compassion, you create the space where real transformation begins, long before the lesson does." },
      { kind: "Tip", text: "Attitude reflects leadership. The passion and belief in which you present your lesson will be the true guide. They are lost and afraid. You must build trust and demonstrate the confidence that this journey will lead them to a better place. Leadership: accepting responsibility for their journey!" },
    ],
    checklist: [
      { h: "Prepare the lesson", items: ["Review the lesson", "Make notes with key points", "Visualize and map out the lesson"] },
      { h: "Prepare your tools", items: ["Computer and slides (or the online lesson)", "A quiet, reliable connection", "Story Guide, paper and pen"] },
      { h: "Prepare the space", items: ["Room set up (the “3rd teacher”)", "Seating so people can see each other", "Organized for engagement"] },
    ],
  },
  {
    n: 2,
    key: "trust",
    title: "Building Trust",
    lead: "What we say first matters. From the first moment you meet someone to how we begin each and every session, we must be intentional about the culture we build.",
    body: "To build trust requires honesty and integrity. We must say what we value and create consensus on our values. We share the Core Values of Story before every group or workshop we run.",
    values: [
      { t: "Invitation and Challenge", d: "Story is an invitation to take a journey of transformation. It is their choice to go. Accepting the invitation is also accepting the challenges that will come with the journey." },
      { t: "All In", d: "All in requires us to show up as our best every day. It is also a challenge to try their best, even when resisting." },
      { t: "People First", d: "Story is a process which requires trust and respect. It is only with mutual respect that the process will be successful." },
      { t: "Community", d: "One boat rises, all boats rise. Story is done in community. As one of us chooses growth, those around them will benefit." },
      { t: "Do the Impossible", d: "There is nothing easy about personal transformation. We are committed to valuing the potential to grow in each other." },
    ],
    callouts: [{ kind: "Tip", text: "Provide specific examples for each of the values and be clear on your expectations. All In means we finish what we start. Respect means we value each other's time. Use names as much as possible, and engage each person as they speak." }],
  },
  {
    n: 3,
    key: "lessons",
    title: "SEE Story Lessons",
    lead: "Story is scientific. Each of the six elements of Story Of Self is rooted in the research of biology, psychology, neuroscience, social science, and anthropology.",
    body: "Story is an experience. The process of Story allows us to connect to ourselves and each other in a deeper, more spiritual and philosophical way. Each lesson establishes the mental structure and story language people need. When the elements are combined, we become empowered to own our story.",
    questions: [
      ["Character", "We are all the lead character in our own story. Who do we choose to be: the victim or the hero?"],
      ["Challenge", "Our lives are filled with new and unexpected challenges. How will we respond to the unknown?"],
      ["Choice", "Our stories are decided by our choices. Do we choose by the world's value or our own?"],
      ["Cave", "We fear we are not good enough. Deeper still is the fear of who we can become."],
      ["Change", "What if our lives only change when we change?"],
      ["Create", "To be the hero means the pen is in our hand. What story will our lives leave behind?"],
    ],
  },
  {
    n: 4,
    key: "writing",
    title: "SEE Story Writing",
    lead: "Learning the elements of Story gives people both the structure and the language they need. Writing their own Story Of Self is where the work will be confronted.",
    body: "Each Story Lesson is matched with a written element to challenge each person to discover and confront their own personal narrative.",
    elements: ["Ordinary World", "Defining Moment & Hidden Value", "The Fall: Defy, Disrupt & Destruct", "Impossible Shift: Despair & Hope", "The Rise: Insight & Higher Value", "Call to Action: Innovate, Involve & Inspire"],
  },
  {
    n: 5,
    key: "processing",
    title: "Processing",
    lead: "Teaching and writing Story is only half the journey. Coaching people to process it and discover how it can truly change their lives is the other half.",
    body: "Our story patterns must become recognizable to ourselves. Stories must be internalized. Much of the work of Story is done in processing. To guide someone through Story we must become proficient in helping others process their past and current experiences.",
    callouts: [
      { kind: "Warning", text: "When we are teaching it is our instinct to provide the right answer. In Story, we do not have the answers. They do! We must learn to guide by asking questions. This is their story, they must discover it!" },
      { kind: "Tip", text: "Asking good questions is an art form. Practice as often as possible. Try having conversations where you do not comment or give feedback: only respond with questions. Be curious. Coaching is getting others to see the way for themselves, not telling them the way they should go." },
    ],
    debrief: [
      { k: "What", d: "Debriefing always begins with WHAT questions. Get the facts and the details.", ex: "What happened right before that moment?" },
      { k: "So What", d: "Now see how they connect the facts to the story. How do their facts become their stories?", ex: "What did that make you believe about yourself?" },
      { k: "Now What", d: "Apply the data and the story to life right now. Turn past patterns into new learning and action.", ex: "Where does that belief show up in your life this week?" },
    ],
  },
  {
    n: 6,
    key: "next",
    title: "Next Steps",
    lead: "When people leave a session, Story Of Self does not stop working. They will think about story, talk about their story, and some will even dream about their stories.",
    body: "Story is not just a group of lessons, Story is a process. Affirm people and guide them through each experience. This works best if we remind them where we have been, where we are at, and where we are going.",
    callouts: [
      { kind: "Mindset", text: "It is critical that the work of Story is done with us, the guides, and the community going through Story Of Self." },
      { kind: "Warning", text: "Their friends and families are not having the same experience, so they will struggle to understand. The people we care about will share conflicting stories. Prepare them for it." },
    ],
    triad: ["Where we have been", "Where we are", "Where we are going"],
  },
];

// ---------- Module 3 · The Six Lessons ----------
export const SIX_LESSONS = [
  {
    c: "Character", n: 1, lesson: "Why You're Lost", time: "1–1.5 hours", stars: 2, mode: "Explore",
    intro: "Every story begins with identity. Before challenge, before change, there is you: your beliefs, values, and the meaning you hold about who you are. Without a rooted sense of identity, we chase approval, lose direction, and hand our power to the world around us. We begin our journey by discovering how we became lost.",
    covers: ["You: the science and the story", "Your life story gone wrong", "Expected vs. Exceptional", "Call to adventure: your story"],
    steps: [
      "Introduce Story by walking through the patterns of our life stories.",
      "Identify the unique biological and narrative components of our lives.",
      "Show how we all participate in the shared stories of our families and social lives.",
      "Describe how past experiences define our future expectations of happiness, success, and contentment.",
      "Explain that when life falls short of expectations we experience fear, sadness and anger, a path that ends in despair.",
      "Offer a new path: change our expectations by choosing to explore, play and create. An exceptional story guided by values, meaning and purpose.",
      "Explain that we each have to choose a path of fear or courage.",
    ],
    note: { kind: "Explore", text: "Look at each lesson from multiple points of view: the online lesson, the Story Guidebook (your companion and theirs), and lesson demonstrations. There is no better guide than another guide." },
  },
  {
    c: "Challenge", n: 2, lesson: "The Emotional Bridge", time: "1–2 hours", stars: 4, mode: "Play",
    intro: "Every story faces a crossing: the moment we step beyond what is familiar into what is uncertain. When we enter the unknown, our nervous system reacts as if there's danger, pulling us back to old patterns, outside answers, and survival over growth. Challenge reveals the threshold where fear rises, not to stop us, but to show us where true transformation begins.",
    covers: ["Confronting life's challenges", "How we see our world", "How we experience our world", "How emotions control story"],
    steps: [
      "Introduce the Story Circle as a map toward transformation: we exist in two worlds, known and unknown.",
      "How we see the world: we don't live in an objective world, we see and experience life as a story.",
      "How we experience the world: the brain experiences it primarily through emotions.",
      "Define the three threat emotions (fear, sadness, anger) and how to shift them into seeking opportunity.",
      "Seeing story in The Lion King: the framework for transformation is used to tell stories everywhere.",
    ],
    note: { kind: "Play", text: "Guiding people through Story is as much an adventure for you as for them. It's a skill to improve, not a test to pass. Focus on progress, not perfection. Stay open and learn from every experience. Story is a creative process: there is no single best way." },
  },
  {
    c: "Choice", n: 3, lesson: "Filling the Cups", time: "1–2 hours", stars: 3, mode: "Create",
    intro: "Every story turns on a decision: where will you aim your life? Follow the pull of external validation, chasing recognition, success and control, or align with inner values of worth, meaning and purpose. Choice defines our motivation and sets the trajectory of who we become.",
    covers: ["You hit what you aim at", "The cost of the American dream", "Finding value in your story", "How we choose our own story"],
    steps: [
      "The threshold: the space between worlds, where we feel the anxiety of making choices.",
      "Reward and punishment: how our world is modeled on external motivation.",
      "Internal motivation: how it was discovered, and why we still don't aim our lives at it.",
      "Use the cups model: emotions “pour” into external and internal value systems. See what happens when they're misaligned.",
      "See story from the externally motivated victim narrative and the internally motivated hero narrative (Rocky and his son).",
    ],
    note: { kind: "Create", text: "Story is a creative process. Use each opportunity to learn, grow and innovate how you guide." },
  },
  {
    c: "Cave", n: 4, lesson: "Self Transformation", time: "1–2 hours", stars: 2, mode: "Explore",
    intro: "Every true story requires a descent. The Cave is the symbolic heart of transformation, the rite of passage where we confront what has held us back, face the monster within, and surrender who we were to become who we are meant to be. No treasure is found without first walking through its darkness.",
    covers: ["Story: a rite of passage", "The Cave: the belly of the beast", "The Monster: you", "How stories transform us"],
    steps: [
      "Prepare for the deepest, most symbolic part of the process: the lowest point of the circle, between past and future self.",
      "Rites of passage: how cultures move through life changes as a story in action.",
      "Explore the Cave: how we culturally use the cave as a space of darkness and change.",
      "Face the Monster: the fears we've locked away, the obstacle to the treasure of growth.",
      "See how everyday stories show the path toward reaching our own potential (Batman Begins).",
    ],
    note: { kind: "Mindset", text: "It is easy to get uncomfortable stepping away from the science into the symbolic. Watch your own feelings in how you present this lesson. Aim at the energy of possibility. Tip: use their own stories to explore the loss and renewal they're living now. For graduates, that's often the transition itself." },
  },
  {
    c: "Change", n: 5, lesson: "Seeing a New Self", time: "1–2 hours", stars: 3, mode: "Play",
    intro: "Change is the moment we awaken to our own power. We have faced our fears, stepped beyond old patterns, and shifted our aim from external approval to inner truth. Transformation becomes real, not because the world has changed, but because we have.",
    covers: ["See: threat vs. opportunity", "See: pay attention", "See: here to there", "How stories change how we see"],
    steps: [
      "Experience change as personal, not as the expectations of others: from the victim story to the hero story.",
      "Shift from threat to opportunity: our power to seek growth inside our fear.",
      "Shift our aim from external to internal: we see the world not as it is, but as we are.",
      "Shift from here to there, from expected to exceptional.",
      "See how the stories we experience every day are shaped by the perspective we choose (Braveheart).",
    ],
    note: { kind: "Warning", text: "People often really struggle with believing they can change for the better. They have plenty of evidence that they are unworthy of the good. Change is not about erasing the past, but giving enough grace to choose a new future. This lesson gives permission to choose it." },
  },
  {
    c: "Create", n: 6, lesson: "Living on Purpose", time: "1–2 hours", stars: 2, mode: "Create",
    intro: "Create is the moment we return to the world renewed, carrying the wisdom, courage and clarity earned through the journey. This is where insight becomes action, intention becomes impact, and purpose becomes practice. Heroes are those who have the courage to write their own stories.",
    covers: ["New: the treasure", "New: self", "New: story", "How our story is our legacy"],
    steps: [
      "Prepare to process the whole experience: closing the circle, ending where we started, but changed.",
      "Prove a new understanding: we can see ourselves and our worlds differently now.",
      "Present a new model with Story as the structure for future choices.",
      "Write a new story with the power to choose ourselves as the hero. See the choice between victim and hero clearly.",
      "See how our legacy is written from fear or courage, and how our courage gives others permission to do the same.",
    ],
    note: { kind: "Mindset", text: "As a journey ends it is okay to feel some sadness, but lean into the joy. The end of this part is the beginning of the next. Tip: celebration is crucial to culture. How to celebrate wins needs to be taught." },
  },
];

// ---------- Module 4 · The Story Write ----------
// arc: y-position of each element on the story arc (0 top .. 1 bottom)
export const STORY_WRITE = [
  {
    key: "ordinary", el: "Ordinary World", lesson: "Listening to a Life Story", time: "1 hour", stars: 1, arc: 0.28,
    intro: "Life is a journey from where we are to where we are called to be. The truth we are seeking is hidden in our stories.",
    keys: ["People are living a life story", "A life story is how they see themselves", "Life stories reveal patterns and values", "We must see their story as they see it", "Listening is a skill to be practiced"],
    steps: [
      "Set a 45-minute to 1-hour session.",
      "Set the space for a comfortable conversation; you can easily keep an eye on time.",
      "Frame it: a 45-minute life story, uninterrupted, to gain context for the work ahead.",
      "Listen. Affirm with natural body language, but don't interrupt. They must follow their own thought patterns.",
      "At the end, be genuinely thankful. Ask a few clarifying questions and offer one positive insight on a pattern you saw.",
    ],
    tips: [
      { kind: "Tip", text: "Coaching Story is like detective work. Search for clues by paying attention to everything someone says. People will always reveal who they are and what they believe if you listen." },
      { kind: "Mindset", text: "Listening to a person's story is a gift. Instead of analyzing, just be curious. Allow yourself to learn from story." },
    ],
  },
  {
    key: "moment", el: "Defining Moment & Hidden Value", lesson: "Finding the moment, finding the Hidden Value, writing the Ordinary World", time: "1–2 hours", stars: 4, arc: 0.62,
    intro: "A Defining Moment is not a long hardship, nor a badge of suffering. It is a single point in time when something changed how you saw yourself, others, or the world. Our Story Of Self begins when our world changes.",
    keys: ["When everything changes, not trauma", "Very detailed, not generalized", "How you see it, not how others see it", "More emotional, less rational", "The exact moment the break occurs", "The “I am” statement is adopted", "The Hidden Value is a negative identity", "The value will show as a life pattern"],
    steps: [
      "Introduce the Defining Moment: what a moment is, and what it is not.",
      "Give time to write titles for exactly 5 Defining Moments. Not 3, not 10. Five.",
      "Process the moments to help them find theirs. Ask which one is more emotional to say out loud.",
      "Have them tell the Defining Moment in detail; listen for the Hidden Value at the key pain point.",
      "Write the Defining Moment and the Hidden Value (one sentence: “I am…”).",
      "Draft the key points of the Ordinary World: only what's needed to step into the moment.",
    ],
    tips: [
      { kind: "Warning", text: "Some will get hung up on trauma. In Story, trauma is the EVENT; the Defining Moment is the personal EXPERIENCE, when that event shaped a belief about who we are and how we are valued." },
      { kind: "Warning", text: "Naming the Hidden Value out loud is naming the pain. Remind them they are advocating for their younger self, giving that earlier version of them courage by naming it." },
    ],
  },
  {
    key: "fall", el: "The Fall", lesson: "Defiance, Disruption, Destruction", time: "1–2 hours", stars: 3, arc: 0.82,
    intro: "After a Defining Moment, a Hidden Value quietly takes hold. We fight it at first: striving, pleasing, proving we are not what we fear. Yet the harder we resist, the deeper it shapes our choices. Our Fall is our struggle to heal our brokenness by seeking a solution in the outer world.",
    keys: ["Defy: how we show up in our external world, proving the Hidden Value wrong (or accepting it and proving the world wrong)", "Disrupt: our inner life separates from our outer life. No matter what we do, we still feel it. Sadness and isolation grow", "Destruct: the tension between inner and outer snaps. Anger leads to destruction, external or internal"],
    steps: [
      "Review the Defining Moment; preview the Fall.",
      "Present the Fall as a conflict between our external and internal worlds.",
      "Map how they respond to the Hidden Value, beginning with Defiance.",
      "Disruption: the inner feeling when the external solution no longer works.",
      "Destruction: the breaking point, where they can no longer hold the tension.",
      "Assign organizing and writing the Fall.",
    ],
    tips: [{ kind: "Warning", text: "Most people tell stories as timelines. The Fall is NOT a timeline. It's a summary of behaviors resulting from the Hidden Value. Help them organize events into external and internal experiences, and keep each D separate." }],
  },
  {
    key: "shift", el: "The Impossible Shift", lesson: "Despair and Hope", time: "1–2 hours", stars: 2, arc: 1,
    intro: "After the Destruction of the Fall, we lose all hope. Then something unexpected appears: a spark, a whisper that a new story is possible. The Impossible Shift rarely feels logical, but it marks the moment the descent turns toward rising. It is in our darkest moments we find the light within.",
    keys: ["Despair: a rock bottom moment, a specific moment of giving up, a sense of no hope", "Hope: in the depths of despair, a call to go on; a spark of light that points to something of a higher value"],
    steps: [
      "Review the Defining Moment and the Fall; preview the rite of passage of the Shift.",
      "Identify the moment of Despair: when they felt they had no more choices left.",
      "Connect Despair to the end of the Fall: Defiance all the way to Despair.",
      "Seek the moment of Hope: what brought them out, or what they kept fighting for.",
      "Write Despair and Hope as specifically as possible, connected: hopelessness finds hope.",
    ],
    tips: [
      { kind: "Insight", text: "Despair represents the end of the Fall and Hope the beginning of the Rise. Despair is ONE specific moment; the other D's are patterns." },
      { kind: "Warning", text: "For many, having hope can be even more painful than their past. This is not a Hallmark movie. Be patient and kind: it may take until the very last moment for them to choose to believe in hope." },
    ],
  },
  {
    key: "rise", el: "The Rise", lesson: "Insight and Higher Value", time: "2 hours", stars: 5, arc: 0.45,
    intro: "The Rise inverts the narrative, replacing the old wound with a new defining moment rooted in early memories of goodness, strength and belonging. Here we heal what was broken, reclaim our worth, and choose a Higher Value. When we see the value within ourselves we can heal.",
    keys: ["When everything changes, but positive", "Very detailed, not generalized", "The exact moment the heal happens", "The “I am” statement is chosen", "The Higher Value is a positive identity", "The value will show as a life pattern"],
    steps: [
      "Briefly review the Fall; focus on a new story of growth.",
      "Have them write their 5 Meaningful Moments.",
      "Discuss in detail their earliest, happiest childhood memory.",
      "Help them name who they were in that memory: the Higher Value that counters the Hidden Value.",
      "Find patterns across their Meaningful Moments and write the Insight.",
    ],
    tips: [
      { kind: "Explore", text: "People can see their negative patterns much more clearly than their positive ones. Push them to see and write about their strengths." },
      { kind: "Warning", text: "The earliest, happiest childhood memory is a doorway into purpose. They won't see it themselves because it seems obvious to them. Help them see it and name it. Think like a lawyer: collect the evidence that their Hidden Value is a lie." },
    ],
  },
  {
    key: "call", el: "Call to Action", lesson: "Innovate, Involve, Inspire", time: "1–2 hours", stars: 3, arc: 0.12,
    intro: "The Call to Action is where the new story moves into the world. With a Higher Value as a guide, insight becomes intentional action. You cannot predict the future, but you can imagine it, choose it, and begin living it now.",
    keys: ["Innovate: a new story creates new actions; aim the Higher Value at new patterns", "Involve: the value of our story is in connection. Nobody deserves… Everybody needs…", "Inspire: the final paragraph is written to themselves"],
    steps: [
      "Prepare to close the circle: the push to complete the final writing.",
      "Now What: use the Insight and Higher Value to create new patterns of growth and action.",
      "Connect their story to others with Nobody deserves / Everybody needs.",
      "Inspire: the last paragraph, a letter to self and a call to live an inspired, purposeful life.",
      "Close the circle: they complete their Final Write.",
    ],
    tips: [{ kind: "Warning", text: "Near the end, fear searches for a reason to quit. Name the trip points ahead of time, and power them across the finish line. Ask honestly: “What do you need from me?” And for the reading: read your story, do not give a speech. No freestyles." }],
  },
];

// Aaron's own Story of Self, from the toolkits, mapped to the writing elements.
export const INVISIBLE_KID = [
  { el: "Ordinary World", key: "ordinary", text: "I walked the halls of Van Hoosen Junior High in the mid-eighties, fully embracing MTV fashion… the crown jewel: shiny, swishy, zipper-covered parachute pants. They weren’t just cool, they were my older brother’s. Paul could drive, had a girlfriend, and was basically a god in my twelve-year-old eyes. Wearing his pants felt like wearing a piece of his magic." },
  { el: "Defining Moment", key: "moment", text: "A girl behind me called out, “Hey, Aaron!” My world began to move in slow motion… We locked eyes, and she said, “Nice pants.” In the pace of one step, the world snapped right back into real time. I just knew they were not complimenting me. They were laughing at me." },
  { el: "Hidden Value", key: "moment", hv: true, text: "This was the day I learned to become invisible." },
  { el: "Defy", key: "fall", text: "I spent the next 15 years of my life believing that I was unworthy to be seen. I learned how to be so average nobody would ever notice me." },
  { el: "Disrupt", key: "fall", text: "Underneath it all I truly wanted someone to see me… but I was invisible, so nobody saw anything in me. And I grew angry." },
  { el: "Despair", key: "shift", text: "One night, I broke. After just five minutes of sleep, I wept and cried out to a God I didn’t believe in: “Either show up or let me die.” Then, finally, I slept." },
  { el: "Hope", key: "shift", text: "Can an invisible person see another invisible person? I could. As a teacher, I could spot that kid… Not only did I see them, I saw what nobody saw in me. I saw potential!" },
  { el: "Higher Value", key: "rise", hv: true, text: "I can see potential." },
  { el: "Inspire", key: "call", text: "I am no longer invisible, today I can see my own potential… I will commit my life to seeing and unleashing the potential in other’s stories." },
];

// ---------- Module 5 · Practice Room personas (client-safe summaries) ----------
export const PERSONAS = [
  { id: "maya", name: "Maya", age: 18, scene: "Character · first session", skill: "Building trust", hue: "#C25B34", brief: "Just graduated. Her mom signed her up. Short answers, a little guarded. Your job: earn her trust with questions, not a pitch.", opener: "hi. my mom signed me up for this so idk" },
  { id: "devon", name: "Devon", age: 19, scene: "The Fall", skill: "Patterns, not a timeline", hue: "#256abf", brief: "Hidden Value: “I'm not enough.” Wants to tell you everything that happened, in order. Help him find the pattern and keep the D's separate.", opener: "ok so for the fall, freshman year i got cut from the team, then in 10th my dad moved out, then junior year i failed chem, then senior year my gf broke up with me. that's basically it" },
  { id: "sam", name: "Sam", age: 18, scene: "Defining Moment", skill: "Event vs. experience", hue: "#1a9468", brief: "Keeps returning to a painful family event and retelling it. Help Sam move from the event to the experience, without probing for details.", opener: "i think my defining moment has to be when my parents split up. like that whole year was just bad. do you want me to tell you everything that happened?" },
  { id: "priya", name: "Priya", age: 20, scene: "The Rise", skill: "Collecting the evidence", hue: "#9b5aa8", brief: "Sees every flaw, dismisses every strength. “I'm just being honest.” Help her see the good: think like a lawyer.", opener: "honestly i don't really have a higher value. i'm not being dramatic, i just don't think there's anything special about me" },
  { id: "jordan", name: "Jordan", age: 18, scene: "The Cave · Despair", skill: "Safety", hue: "#8a6a1f", brief: "Working on Despair, then says something that should stop the lesson. Practice the safety steps with warmth and calm.", opener: "this despair part is kind of hitting close. like honestly some days lately i don't really see the point of being here" },
  { id: "alex", name: "Alex", age: 21, scene: "Telling the story", skill: "No freestyles", hue: "#4a3aa7", brief: "Confident, wants to “just wing it” at Story Night and skip the script. Fear is looking for a way out. Hold the line with care.", opener: "honestly i'm not gonna read it word for word, that's so stiff. i'll just talk from the heart, i'm good at speaking" },
];

export const RUBRIC = [
  { key: "questions", label: "Questions, not answers", aaron: "In Story, we do not have the answers. They do!" },
  { key: "listening", label: "Detective listening", aaron: "People will always reveal who they are and what they believe if you listen." },
  { key: "debrief", label: "What → So What → Now What", aaron: "Debriefing always begins with WHAT questions." },
  { key: "trust", label: "Building trust", aaron: "Affirm the progress, not the completion or perfection." },
  { key: "skill", label: "The key skill for this moment", aaron: "Each lesson, each client, and every story will present its own challenges." },
];

// ---------- Module 6 · Safety (prototype proposal for Aaron) ----------
export const SAFETY = {
  scope: [
    "A Champion is a guide, not a therapist, counselor or doctor. Story of Self is guided reflection, not treatment.",
    "Never diagnose, give medical or legal advice, or tell someone what their experience “was.”",
    "When something is bigger than Story, the most powerful thing a Champion does is connect the person to the right help.",
  ],
  steps: [
    { t: "Stop", d: "Pause the lesson. Nothing in the curriculum is more important than this moment." },
    { t: "Stay warm and calm", d: "Thank them for telling you. Take it seriously, without panic or judgment." },
    { t: "Ask directly", d: "“Are you thinking about ending your life?” Asking does not put the idea in someone's head; it opens the door." },
    { t: "Connect to help", d: "In the U.S., call or text 988, or text HOME to 741741. In immediate danger, call 911. Encourage a trusted adult." },
    { t: "Tell the Story team", d: "Flag the session right away so a person on the Story team follows up. Never carry it alone." },
  ],
  boundaries: [
    "All sessions and messages stay on the Story platform. No personal phone numbers or social media.",
    "Never meet a student alone in person outside an approved Story setting.",
    "Keep what students share private, except where safety requires telling the Story team.",
    "Know your local duty-to-report rules for abuse or danger involving minors.",
    "Pass a background check before working with students.",
  ],
  care: "Story will stir up your own story too. Every Champion has their own Champion. Debrief with the Story team after hard sessions, and let it eat.",
};

// ---------- Quizzes ----------
const Q = (q, options, answer, why) => ({ q, options, answer, why });

export const QUIZZES = {
  framework: {
    pass: 75,
    items: [
      Q("A student asks you, “So what's my Hidden Value?” What does a Champion do?", ["Tell them what you think it is, gently", "Ask what that younger version of them began to believe in that moment", "Give them a list of examples to pick from", "Move on to the next section"], 1, "In Story, we do not have the answers. They do! Guide with questions so they discover it."),
      Q("Which order does every debrief follow?", ["Now What → What → So What", "So What → What → Now What", "What → So What → Now What", "Whatever feels natural"], 2, "Facts first (What), then how the facts became their story (So What), then life right now (Now What)."),
      Q("What is the first thing you share at the start of every group or workshop?", ["The schedule", "Your own Story of Self", "The Core Values of Story", "The rules for writing"], 2, "What we say first matters. Building trust starts with saying what we value and creating consensus on it."),
      Q("A student says their family “just doesn't get” what they're doing in Story. What does Next Steps tell you?", ["That's a red flag; pause the program", "It's normal: their families aren't having the same experience. Prepare them for it", "Ask them to bring a parent to the next session", "Tell them their family is wrong"], 1, "Friends and families will struggle to understand and may share conflicting stories. The work is done with us and the Story community."),
    ],
  },
  lessons: {
    pass: 80,
    items: [
      Q("Which lesson asks: are we the victim or the hero of our own story?", ["Character", "Cave", "Create", "Challenge"], 0, "Character: we are all the lead character. Who do we choose to be?"),
      Q("Challenge teaches three threat emotions. Which are they?", ["Doubt, shame, guilt", "Fear, sadness, anger", "Anxiety, worry, stress", "Fear, envy, regret"], 1, "Fear (we get stuck), sadness (we pull away), anger (we attack), shifted toward explore, play and create."),
      Q("In Choice, the cups model shows emotion pouring into…", ["Good and bad habits", "Past and future", "External and internal value systems", "Thoughts and actions"], 2, "Power and people (external) versus higher aim, potential and personal value (internal)."),
      Q("The Cave lesson asks you, the Champion, to watch out for…", ["Running over time", "Your own discomfort moving from science into the symbolic", "Students skipping homework", "Using film clips"], 1, "Watch your own feelings in how you present it. Aim at the energy of possibility."),
      Q("Aaron's warning for Change is that people…", ["Change too fast", "Struggle to believe they can change for the better", "Forget earlier lessons", "Prefer group work"], 1, "They have plenty of evidence they're unworthy. Change isn't erasing the past, it's grace to choose a new future."),
    ],
  },
  writing: {
    pass: 80,
    items: [
      Q("How many Defining Moment titles do you ask for in the brainstorm?", ["3", "5", "10", "As many as they like"], 1, "Five. Not 3 or 10, but 5."),
      Q("A student is torn between two moments. What helps them choose?", ["Pick the most recent", "Pick the one with the most drama", "Ask which one is more emotional to say out loud", "Choose for them"], 2, "Have them share both titles, then ask which makes them more emotional to say out loud. Explore that one."),
      Q("A student writes the Fall as a list of events by year. What do you do?", ["Accept it; it's their story", "Help them organize it into patterns of external and internal experience", "Shorten it to the worst event", "Move to the Rise"], 1, "The Fall is NOT a timeline. It's a summary of behaviors resulting from the Hidden Value."),
      Q("What makes Despair different from the other D's?", ["It's longer", "It's one specific moment, not a pattern", "It's optional", "It's written to others"], 1, "Defy, Disrupt and Destruct are patterns. Despair is a specific moment when it felt like there was no choice left."),
      Q("The Inspire paragraph is written to…", ["The audience", "Their family", "Themselves", "Their Champion"], 2, "The final paragraph is a letter and a gift to themselves."),
    ],
  },
  safety: {
    pass: 100,
    items: [
      Q("During Despair, a student says “some days I don't see the point of being here.” What's your first move?", ["Keep going so the lesson stays on track", "Stop the lesson, stay calm and warm, and ask directly about their safety", "Tell them everyone feels that way", "End the session immediately"], 1, "Stop. Stay warm. Ask directly. Then connect them to help and tell the Story team."),
      Q("A student asks for your personal number so they can text you between sessions.", ["Give it; it builds trust", "Kindly keep contact on the Story platform", "Give them your social media instead", "Ignore the request"], 1, "All contact stays on the platform. It protects them and you."),
      Q("A student picks a Defining Moment involving abuse. What do you do?", ["Ask for every detail so the writing is strong", "Thank them, don't probe for details, focus on what it made them believe, and make sure they have real support", "Tell them to pick something else immediately", "Skip the unit"], 1, "Trauma is the event; the Defining Moment is the experience. Never push someone to relive details, and make sure support exists beyond Story."),
      Q("After a heavy session you feel shaken. What does a Champion do?", ["Keep it to yourself", "Debrief with the Story team and take care of yourself", "Cancel your other students", "Share it with friends"], 1, "Every Champion has their own Champion. Never carry it alone."),
    ],
  },
  assessment: {
    pass: 80,
    items: [
      Q("What is a Champion?", ["A teacher who gives the right answers", "One who fights for or defends the cause of another", "A therapist for young people", "Someone who has finished Story"], 1, "CHAM·PI·ON: one who fights for or defends the cause of another. You are the guide; they are the hero."),
      Q("In a Life Story listening session, the Champion should mostly…", ["Interrupt with helpful questions", "Listen without interrupting, then affirm and ask a few clarifying questions", "Take notes on what they did wrong", "Share their own story first"], 1, "They must follow their own thought patterns. Listening is a gift."),
      Q("A student says their Hidden Value is “I hate my brother.” What's off?", ["Nothing", "It's a feeling about someone else, not an “I am” belief about themselves", "It's too short", "It should be positive"], 1, "The Hidden Value is a negative identity in one sentence: “I am…”"),
      Q("Where does the Higher Value most often come from?", ["The Champion's suggestion", "The earliest, happiest childhood memory and Meaningful Moments", "The Defining Moment", "Their parents"], 1, "The earliest happiest childhood memory is a doorway into purpose. Help them see it and name it."),
      Q("“Think like a lawyer” means…", ["Argue with the student", "Collect evidence of their strength and growth: proof the Hidden Value is a lie", "Document risks", "Be skeptical of their story"], 1, "Every piece of courage you can show them is proof."),
      Q("At Story Night, a student wants to improvise instead of reading. What's the rule?", ["Let them; it's their story", "Read your story, do not give a speech. No freestyles", "Let them read half", "Have someone else read it"], 1, "Rule 2 is absolute. Freestyles go off script and fear takes over."),
      Q("Nobody deserves… / Everybody needs… comes from…", ["The Hidden Value and the Higher Value", "The Ordinary World", "The core values", "The Fall"], 0, "Hidden Value → Nobody deserves. Higher Value → Everybody needs. Both said out loud as absolute truth."),
      Q("Near the end, a student starts making excuses not to finish. What do you do?", ["Give them more time indefinitely", "Name the trip points ahead of time and ask, “What do you need from me?”", "Lower the word counts", "Write it for them"], 1, "Fear will search for a reason to quit. Your job is to power them across the finish line."),
    ],
  },
};

export const NEXT_STEPS = [
  { t: "Champion your first students", d: "Level 1 Champions are matched with students in the Journey + Champion tier for live one-on-one sessions, with support from the Story team.", cta: "Join the Champion pool" },
  { t: "Earn Full Certification", d: "Build Foundation: lead all 24 sessions with a cohort, observe a live lesson demonstration, run supervised sessions and host a Story Night.", cta: "Join the waitlist" },
  { t: "Keep writing your own story", d: "Every Champion walks the path first. If your own Story of Self isn't finished yet, that's your next step.", cta: "Open my story", href: "/story/my-story" },
];
