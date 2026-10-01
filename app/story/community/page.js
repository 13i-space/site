export const metadata = { title: "Community", description: "The Story of Self Community: Story Circles, Story Nights, the Champions' Lodge and alumni, on Mighty Networks." };

const PILLARS = [
  { k: "Explore", c: "#C25B34", d: "The lessons: seven units of questions about your own life.", where: "On this site" },
  { k: "Play", c: "#B8862B", d: "Your Story Champion: conversations with no wrong answers.", where: "On this site" },
  { k: "Create", c: "#5F7F6B", d: "Story Write: your Story of Self, written in your words.", where: "On this site" },
  { k: "Kinship", c: "#256abf", d: "The Story Community: the people walking the same road.", where: "On Mighty Networks", soon: true },
];

const SPACES = [
  { t: "Welcome Circle", type: "Feed", d: "Introduce yourself with your one word from Lesson 1. Weekly connector questions, just like a Champion opens every session.", who: "Everyone" },
  { t: "Story Circles", type: "Cohort space + weekly meeting", d: "Small groups of 8 to 12 matched by start date, moving through the units together. A weekly online meeting with a Champion, the Story Cohort Weekly Meeting from the Story Guide.", who: "Members in the journey" },
  { t: "Story Nights", type: "Events + livestream", d: "Live online readings of finished stories, hosted by a Champion. Read your story, don't give a speech. Every reading ends with one word from the room.", who: "Everyone, by invitation to read" },
  { t: "Alumni: The Call", type: "Live challenges", d: "Thirty-day challenges built on Innovate, Involve and Inspire, so a Higher Value becomes a habit.", who: "Members who've closed the circle" },
  { t: "Champions' Lodge", type: "Private space + chat", d: "Where Champions trade questions, debrief hard sessions and keep learning. Every Champion has their own Champion.", who: "Certified Champions" },
  { t: "Parents' Corner", type: "Feed + resources", d: "How to support a young person through Story without reading over their shoulder, plus parent Q&As.", who: "Parents" },
  { t: "Story Library", type: "Resource library", d: "The Story Guide, lesson videos and examples, all in one place.", who: "Everyone" },
];

const JOURNEY = [
  ["Sign up here", "Create your Story account and begin Unit 1 with your Champion."],
  ["Join your Story Circle", "After Unit 1, you're invited into the Community and matched with a circle starting the same week."],
  ["Walk it together", "Your circle meets weekly while your Champion guides each lesson one-on-one."],
  ["Read at Story Night", "Close the circle by reading your story to people who understand what it took."],
  ["Live the Call", "Join alumni challenges, and help the next circle find their way."],
  ["Become a Champion", "Train in the Champion Academy and join the Champions' Lodge."],
];

const CONNECT = [
  ["One sign-in", "Members move from Story of Self into the Community without a second password, using Mighty Networks single sign-on (available on qualifying plans)."],
  ["Progress becomes belonging", "Finishing a unit here can unlock the next Story Circle conversation there, and a finished story can earn a member badge, through the Mighty Networks API."],
  ["Champions, connected", "A Champion Academy certificate unlocks the Champions' Lodge, and Champion-hosted Story Nights are scheduled as Community events."],
  ["Your story stays yours", "Your private writing never leaves this site unless you choose to share it. The Community is for conversation and celebration, not for anyone to read your drafts."],
];

const SAFE = [
  "Community guidelines built on Story's values: All In, People First, Community, Do the Impossible.",
  "Every Story Circle has a trained Champion, and every space has moderators.",
  "Sharing is always a choice. No one is ever asked to post their Defining Moment or their Fall.",
  "18+ during the preview, with tools to report anything that doesn't feel right.",
  "Crisis resources pinned in every space: call or text 988, or text HOME to 741741.",
];

export default function Community() {
  return (
    <div className="sp cm">
      <section className="sp-hero">
        <div className="sp-wrap cm-hero">
          <div>
            <div className="sos-eyebrow">The Story Community · coming soon</div>
            <h1>You'll never <em>walk alone.</em></h1>
            <p className="sp-lede">Transformation happens inside you. It lasts when it happens with other people. The Story Community is where you'll find people on the same road, read your story out loud, and help the next person find theirs.</p>
            <div className="sh-row">
              <a className="sos-btn" href="/story/contact">Be first to join</a>
              <a className="sos-btn ghost" href="#how">How it works</a>
            </div>
          </div>
          <div className="cm-rings" aria-hidden="true">
            <svg viewBox="0 0 400 400">
              {[150, 110, 70].map((r, i) => <circle key={r} cx="200" cy="200" r={r} fill="none" stroke="#E2D6C5" strokeWidth={i === 0 ? 1.5 : 1} strokeDasharray={i === 1 ? "3 6" : undefined} />)}
              {Array.from({ length: 12 }, (_, i) => {
                const a = (i / 12) * Math.PI * 2;
                const r = i % 3 === 0 ? 150 : i % 3 === 1 ? 110 : 70;
                const x = 200 + r * Math.cos(a), y = 200 + r * Math.sin(a);
                return <g key={i}><line x1="200" y1="200" x2={x} y2={y} stroke="#EBC8B6" strokeWidth="1" /><circle cx={x} cy={y} r={i % 3 === 0 ? 13 : 9} fill={["#C25B34", "#B8862B", "#5F7F6B", "#256abf"][i % 4]} stroke="#FFFCF7" strokeWidth="3" /></g>;
              })}
              <circle cx="200" cy="200" r="36" fill="#C25B34" />
              <text x="200" y="207" textAnchor="middle" fontFamily="Newsreader, Georgia, serif" fontStyle="italic" fontSize="20" fill="#fff">you</text>
            </svg>
          </div>
        </div>
      </section>

      <section className="sp-sec">
        <div className="sp-wrap sp-two">
          <div>
            <div className="sos-eyebrow">Why community</div>
            <h2>One boat rises, all boats rise.</h2>
            <p>Community is one of Story's four values, and it's how Aaron has always run Story: in cohorts, together. His Champion training puts it plainly: it is critical that the work of Story is done with the guides and the community going through Story of Self.</p>
            <p>Why? Because friends and families aren't having the same experience, so they'll struggle to understand. And because, as the Create unit says, the biggest lie we believe is that we are alone and nobody understands.</p>
          </div>
          <div className="cm-stat">
            <b>29%</b>
            <span>of Americans under 30 feel lonely or isolated most of the time, compared with 8% of people 65 and older.</span>
            <small>NBC News / SurveyMonkey, April 2025</small>
          </div>
        </div>
      </section>

      <section className="sp-sec alt">
        <div className="sp-wrap">
          <div className="sos-eyebrow">How it fits</div>
          <h2>Explore, Play, Create, and Kinship.</h2>
          <p className="sp-muted">Story of Self on this site covers the first three. The Community completes the circle.</p>
          <div className="cm-pillars">
            {PILLARS.map((p) => (
              <div key={p.k} style={{ "--c": p.c }} className={p.soon ? "soon" : ""}>
                <span className="cm-where">{p.where}</span>
                <b>{p.k}</b>
                <p>{p.d}</p>
                {p.soon && <em>Coming soon</em>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sp-sec" id="how">
        <div className="sp-wrap">
          <div className="sos-eyebrow">How it will work</div>
          <h2>Built on Mighty Networks</h2>
          <p>The Story Community will live on Mighty Networks, the same platform that hosts Aaron's Story Community today. It gives us discussion feeds, small-group spaces, live events and livestreams, member profiles, direct messages and native phone apps, so members can stay connected wherever they are. Here's how the spaces will be organized:</p>
          <div className="cm-spaces">
            {SPACES.map((s) => (
              <div key={s.t}>
                <div className="cm-space-top"><b>{s.t}</b><span>{s.type}</span></div>
                <p>{s.d}</p>
                <small>For: {s.who}</small>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sp-sec alt">
        <div className="sp-wrap">
          <div className="sos-eyebrow">A member's journey</div>
          <h2>From your first lesson to your first Story Night, and beyond.</h2>
          <ol className="cm-journey">
            {JOURNEY.map(([t, d], i) => <li key={t}><span>{i + 1}</span><b>{t}</b><p>{d}</p></li>)}
          </ol>
        </div>
      </section>

      <section className="sp-sec">
        <div className="sp-wrap sp-two">
          <div>
            <div className="sos-eyebrow">Connected to everything else</div>
            <h2>One Story, two places.</h2>
            <p>Your story work happens here, privately, with your Champion. Your community happens on Mighty Networks. The two are connected so it feels like one experience.</p>
            <div className="cm-connect">
              {CONNECT.map(([t, d]) => <div key={t}><b>{t}</b><p>{d}</p></div>)}
            </div>
          </div>
          <div className="cm-safe">
            <h3>Safe by design</h3>
            <ul>{SAFE.map((s) => <li key={s}>{s}</li>)}</ul>
          </div>
        </div>
      </section>

      <section className="sh-final">
        <div className="sh-wrap">
          <p className="sh-final-q">Your story isn't yours until you <em>give it away</em>.</p>
          <div className="sh-row" style={{ justifyContent: "center" }}>
            <a className="sos-btn" href="/story/begin">Begin your story</a>
            <a className="sos-btn ghost" href="/story/contact">Be first to join the Community</a>
          </div>
        </div>
      </section>
    </div>
  );
}
