import SixCs from "./_components/SixCs";
import HeroArt from "./_site/HeroArt";
import { TRANSCRIPT } from "../../lib/story/briefContent";

export const metadata = { title: { absolute: "Story of Self · Own your story before the next chapter begins" } };

const STATS = [
  ["3.8M", "students graduate from U.S. high schools every year"],
  ["1 in 4", "college freshmen don't come back for a second year"],
  ["43%", "of Gen Z adults say they lack a sense of purpose"],
  ["56%", "of Gen Z feel anxious about the future most of the time"],
];

const UNITS = [
  ["Character", "Who you are, and the world that shaped you"],
  ["Challenge", "The moment that changed how you see yourself"],
  ["Choice", "How that belief has been quietly writing your story"],
  ["Cave", "The low point, and the hope that carried you through"],
  ["Change", "The truer story of who you really are"],
  ["Create", "Your call to action: who you'll be, and for whom"],
  ["Close the Circle", "Write it, tell it, own it"],
];

const PARENTS = [
  ["Why now", "The summer after senior year is when school supports end and campus supports haven't started. It's the most important, least supported stretch of their lives."],
  ["What it is, and isn't", "A guided reflection program built on a proven method. Not therapy, not counseling, and not one more thing to be graded on."],
  ["Their story stays theirs", "What your teen writes is private to their account. You won't see their conversations or their story unless they choose to share it with you."],
  ["Safety comes first", "Every conversation follows clear safety rules. If someone says they're not okay, the lesson stops and they're pointed to real people who can help."],
  ["On their schedule", "Online, at their own pace, about 20 minutes a session, with pauses built in."],
  ["A gift that lasts", "A graduation gift that isn't a thing: a clearer sense of who they are, in their own words, before they leave home."],
];

const TIERS = [
  { name: "Start free", price: "$0", what: ["All of Unit 1, Character", "Your Character Snapshot", "Your AI Story Champion"], cta: "Start free" },
  { name: "Story Journey", price: "$179", note: "one time", hot: true, what: ["All seven units, 22 guided sessions", "Your complete Story of Self", "Reading view to share it"], cta: "Start free" },
  { name: "Journey + Champion", price: "$649", note: "one time", what: ["Everything in Story Journey", "3–4 live sessions with a trained human Champion", "A Story Night reading"], cta: "Start free" },
];

const FAQ = [
  ["Is this therapy?", "No. Story of Self is a guided reflection program. It can be powerful, and it's not a substitute for a counselor or doctor. If you're struggling, we'll always point you to real people who can help."],
  ["Who is it for?", "Young adults about 17 to 21, especially in the year after high school: heading to college, work, a trade, the military or a gap year. Accounts are 18+ during our preview."],
  ["How long does it take?", "Seven units, 22 sessions of about 20 minutes each. Go at your own pace, anywhere from a few weeks to a summer, and pauses are encouraged: “let it eat.”"],
  ["What is the Story Champion?", "Your guide. It's an AI trained on the Story of Self method created by Aaron Donaghy. It asks questions instead of giving answers, remembers where you left off, and helps you write your story in your own words."],
  ["Who can see what I write?", "Only you. Your conversations and your story are private to your account. You can share your finished story if and when you choose."],
  ["Do I have to be a good writer?", "Not at all. Your Champion helps you find your words, and every section has a short word count. The best stories are the honest ones."],
  ["What if something comes up that's really hard?", "You choose how deep to go at every step. If you ever say you're not okay, the lesson stops and you'll be connected to help: call or text 988 in the U.S."],
  ["Can I give Story as a gift?", "Gift cards are coming with our full launch in spring 2027. Contact us if you'd like to be first to know."],
];

export default function StoryHome() {
  return (
    <div className="sh">
      {/* hero */}
      <section className="sh-hero">
        <div className="sh-wrap sh-hero-grid">
          <div>
            <div className="sos-eyebrow">For the year after high school</div>
            <h1>Own your story <em>before</em> the next chapter begins.</h1>
            <p className="sh-lede">
              Everyone has a plan for where you're going next. Story of Self helps you understand who's going: the story you've lived, what it
              made you believe, and the story you'll choose next. Guided one conversation at a time by your Story Champion.
            </p>
            <div className="sos-hero-actions">
              <a className="sos-btn" href="/story/begin">Start free</a>
              <a className="sos-btn ghost" href="#parents">I'm a parent</a>
            </div>
            <ul className="sh-trust">
              <li>Free to start</li>
              <li>About 20 minutes a session</li>
              <li>Private to you</li>
            </ul>
          </div>
          <div className="sh-hero-art"><HeroArt /></div>
        </div>
      </section>

      {/* the year nobody plans for */}
      <section className="sh-band">
        <div className="sh-wrap">
          <h2>The year nobody plans for.</h2>
          <div className="sh-stats">
            {STATS.map(([v, t]) => <div key={v}><b>{v}</b><span>{t}</span></div>)}
          </div>
          <p className="sh-src">Sources: WICHE, National Student Clearinghouse, Gallup and Walton Family Foundation, NBC News / SurveyMonkey.</p>
        </div>
      </section>

      {/* what it is */}
      <section className="sos-section" id="what">
        <div className="sh-wrap">
          <div className="sh-split">
            <div>
              <div className="sos-eyebrow">What is Story of Self?</div>
              <h2 className="sh-h2">Every story ever told follows the same six steps. So does yours.</h2>
              <p className="sh-p">
                Every culture, in every era, has used story to make sense of life. Story of Self uses that same structure, the hero's journey,
                to help you look at your own life with honesty and curiosity: where you started, what shaped you, what you came to believe
                about yourself, and who you're choosing to become.
              </p>
              <p className="sh-p">It's rooted in research from psychology, neuroscience and social science, and it has guided people through real change for years.</p>
            </div>
            <div className="sh-turn">
              <div className="sh-turn-k">Every story has a turn</div>
              <div className="sh-turn-row">
                <div className="dark"><span>The belief that held me back</span><b>“I am invisible.”</b></div>
                <svg viewBox="0 0 40 60" width="34" height="50" aria-hidden="true"><path d="M20 4 V50 M10 40 L20 52 L30 40" fill="none" stroke="#C25B34" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                <div className="up"><span>The truer story</span><b>“I can see potential.”</b></div>
              </div>
              <p>From the Story of Self of our founder, Aaron Donaghy. You'll find your own.</p>
            </div>
          </div>
          <div style={{ marginTop: 44 }}><SixCs /></div>
        </div>
      </section>

      {/* how it works */}
      <section className="sos-section alt" id="how">
        <div className="sh-wrap">
          <div className="sos-eyebrow">How it works</div>
          <h2 className="sh-h2">A journey from here to there, one conversation at a time.</h2>
          <div className="sh-steps">
            <div><span>1</span><b>Walk the journey</b><p>Seven units and 22 short sessions with your Story Champion. Each one asks a few good questions, and listens.</p></div>
            <div><span>2</span><b>Write your Story of Self</b><p>Every session adds a piece. By the end you'll have your whole story, in your own words: about 1,200 of them.</p></div>
            <div><span>3</span><b>Tell it</b><p>Read your story to someone who matters. It's a rite of passage: your story isn't fully yours until you give it away.</p></div>
          </div>
          <ol className="sh-units">
            {UNITS.map(([u, d], i) => (
              <li key={u}><span>{i + 1}</span><b>{u}</b><small>{d}</small>{i === 0 && <em>Free</em>}</li>
            ))}
          </ol>
        </div>
      </section>

      {/* champion */}
      <section className="sos-section" id="champion">
        <div className="sh-wrap sh-split">
          <div>
            <div className="sos-eyebrow">Meet your Story Champion</div>
            <h2 className="sh-h2">A guide who asks. You're the one with the answers.</h2>
            <p className="sh-p"><em>Champion: one who fights for, or defends, the cause of another.</em></p>
            <ul className="sh-ticks">
              <li>Trained on the Story of Self method, the way human Champions are trained</li>
              <li>Asks one question at a time, and never tells you what your story “is”</li>
              <li>Remembers where you left off, so you can pause anytime</li>
              <li>Follows clear safety rules, and points you to real people when it matters</li>
              <li>Want a person too? Add live sessions with a trained human Champion</li>
            </ul>
          </div>
          <div className="sos-chat sh-chat" aria-label="Example conversation">
            <div className="sos-chat-head">
              <div className="sos-avatar" aria-hidden="true">C</div>
              <div><b>Your Story Champion</b><small>Example from Unit 1</small></div>
            </div>
            <div className="sos-log">
              {TRANSCRIPT.slice(0, 4).map((m, i) => (
                <div key={i} className={`sos-bubble ${m.who === "you" ? "you" : "champion"}`}>{m.text}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* what you walk away with */}
      <section className="sos-section alt">
        <div className="sh-wrap sh-split rev">
          <div className="sh-doc" aria-hidden="true">
            <div className="sh-doc-k">My Story of Self</div>
            {[["Ordinary World", 3], ["Defining Moment", 4], ["The Fall", 3], ["The Impossible Shift", 3], ["The Rise", 3], ["Call to Action", 2]].map(([h, n]) => (
              <div key={h} className="sh-doc-sec">
                <b>{h}</b>
                {Array.from({ length: n }, (_, k) => <i key={k} style={{ width: `${70 + ((k * 37 + h.length * 7) % 30)}%` }} />)}
              </div>
            ))}
          </div>
          <div>
            <div className="sos-eyebrow">What you walk away with</div>
            <h2 className="sh-h2">Your story, written. And the person who wrote it.</h2>
            <p className="sh-p">A finished Story of Self: your Ordinary World, your Defining Moment, the turn, and your Call to Action. Ready to read aloud.</p>
            <p className="sh-p">And the things that come with it: a clearer sense of what you value, words for who you are, and a far better answer to “tell me about yourself,” whether it's a college essay, a scholarship, or a job interview.</p>
            <a className="sos-btn ghost" href="/story/example">Read an example story</a>
          </div>
        </div>
      </section>

      {/* parents */}
      <section className="sos-section" id="parents">
        <div className="sh-wrap">
          <div className="sos-eyebrow">For parents</div>
          <h2 className="sh-h2">The gift of knowing who they are, before they leave home.</h2>
          <div className="sh-parents">
            {PARENTS.map(([t, d]) => <div key={t}><b>{t}</b><p>{d}</p></div>)}
          </div>
          <div className="sh-row">
            <a className="sos-btn" href="#pricing">See pricing</a>
            <a className="sos-btn ghost" href="/story/contact">Questions? Talk to us</a>
          </div>
        </div>
      </section>

      {/* pricing */}
      <section className="sos-section alt" id="pricing">
        <div className="sh-wrap">
          <div className="sos-eyebrow">Pricing</div>
          <h2 className="sh-h2">Start free. Pay once if you keep going.</h2>
          <p className="sh-p">No subscriptions. Story is a journey with an end.</p>
          <div className="sh-tiers">
            {TIERS.map((t) => (
              <div key={t.name} className={`sh-tier${t.hot ? " hot" : ""}`}>
                {t.hot && <div className="sh-tier-flag">Recommended</div>}
                <b>{t.name}</b>
                <div className="sh-tier-price">{t.price}{t.note && <small>{t.note}</small>}</div>
                <ul>{t.what.map((w) => <li key={w}>{w}</li>)}</ul>
                <a className={`sos-btn${t.hot ? "" : " ghost"}`} href="/story/begin">{t.cta}</a>
              </div>
            ))}
          </div>
          <p className="sh-note">During our preview, the full journey is free. Launch pricing begins with our full release in spring 2027.</p>
        </div>
      </section>

      {/* founder */}
      <section className="sos-section">
        <div className="sh-wrap sh-founder">
          <img className="sh-founder-photo" src="/story/aaron.jpg" alt="Aaron Donaghy, founder of Story of Self" width="220" height="220" />
          <div>
            <div className="sos-eyebrow">Created by a teacher</div>
            <blockquote>“Can an invisible person see another invisible person? I could. As a teacher, I could spot that kid… Not only did I see them, I saw what nobody saw in me. I saw potential!”</blockquote>
            <p className="sh-by">Aaron Donaghy, founder of Story of Self, from his own Story of Self</p>
            <a className="sos-btn ghost" href="/story/about">Read our story</a>
          </div>
        </div>
      </section>

      {/* community */}
      <section className="sos-section alt" id="community">
        <div className="sh-wrap sh-split">
          <div>
            <div className="sos-eyebrow">The Story Community</div>
            <h2 className="sh-h2">You'll never walk alone.</h2>
            <p className="sh-p">The biggest lie we believe is that we're alone and nobody understands. Story is done in community: weekly circles with people on the same unit, Story Nights where finished stories are read aloud, and a place to keep growing after the last page.</p>
            <a className="sos-btn ghost" href="/story/community">How the community works</a>
          </div>
          <div className="sh-comm">
            {[["Story Circles", "Small groups on the same unit, meeting weekly"], ["Story Nights", "Live readings of finished stories"], ["Champions' Lodge", "Where Champions support each other"], ["Alumni", "Your Call to Action, lived out together"]].map(([t, d], i) => (
              <div key={t}><span>{i + 1}</span><b>{t}</b><small>{d}</small></div>
            ))}
          </div>
        </div>
      </section>

      {/* champions */}
      <section className="sh-champ">
        <div className="sh-wrap sh-champ-in">
          <div>
            <div className="sos-eyebrow" style={{ color: "#F0B596" }}>Become a Story Champion</div>
            <h2>Anyone can lead Story.</h2>
            <p>Teachers, coaches, counselors, youth leaders, parents: if you want to fight for a young person's story, the Champion Academy will train you, with AI practice students and a Digital Certificate at the end.</p>
          </div>
          <a className="sos-btn" href="/story/academy">Explore the Champion Academy</a>
        </div>
      </section>

      {/* faq */}
      <section className="sos-section" id="faq">
        <div className="sh-wrap sh-faqwrap">
          <div>
            <div className="sos-eyebrow">Questions</div>
            <h2 className="sh-h2">Good questions are the whole point.</h2>
            <p className="sh-p">Still wondering about something? <a href="/story/contact">Contact us</a>.</p>
          </div>
          <div className="sh-faq">
            {FAQ.map(([q, a]) => (
              <details key={q}>
                <summary>{q}</summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* final */}
      <section className="sh-final">
        <div className="sh-wrap">
          <p className="sh-final-q">Stories are usually told about the past. But your story is <em>still unfolding</em>.</p>
          <a className="sos-btn" href="/story/begin">Begin your story, free</a>
        </div>
      </section>
    </div>
  );
}
