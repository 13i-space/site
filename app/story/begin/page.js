import SixCs from "../_components/SixCs";
import Invitation from "../_components/Invitation";

export const metadata = { title: "Begin your story" };

// The Story of Self introduction: Aaron's Preview + Story Write introduction,
// adapted for people at the threshold between high school and what's next.
const TIPS = [
  { t: "One step at a time", d: "Trust the process. Each step uncovers one piece of your story. Going too fast makes it harder to see." },
  { t: "Choose courage", d: "There will be parts of your story you won't want to look at. When you feel resistance, choose courage." },
  { t: "Be curious, not judgmental", d: "No story is too dark or too ordinary. You're here to own your story, not to sell it or compare it." },
  { t: "Let it eat", d: "After each step, give it time to work on you. Your brain keeps arranging things long after you close the page." },
  { t: "Keep moving forward", d: "Don't keep going back to edit. Let each step be its own piece of work." },
  { t: "Close the circle", d: "Finish what you start. It's only when you reach the last sentence that you understand the whole story." },
];

export default function StoryIntro() {
  return (
    <>
      <section className="sos-hero">
        <div className="sos-wrap">
          <div className="sos-eyebrow">Begin your Story of Self</div>
          <h1>
            Your story
            <br />
            <em>starts here.</em>
          </h1>
          <p className="sos-lede">
            Everyone has a plan for where you're going: college, work, a gap year. Story of Self starts somewhere else: with who you
            are, the story you've been living, and the story you choose to live next. You'll be guided one step at a time by your Story
            Champion.
          </p>
          <div className="sos-hero-actions">
            <a className="sos-btn" href="#invitation">Begin</a>
            <a className="sos-btn ghost" href="#journey">How it works</a>
          </div>
        </div>
      </section>

      <section className="sos-section alt" id="journey">
        <div className="sos-narrow">
          <div className="sos-eyebrow">A journey from here to there</div>
          <h2 style={{ fontSize: "clamp(32px, 5vw, 46px)" }}>Life is a journey from <em>here</em> to <em>there</em>.</h2>
          <ul className="sos-questions">
            <li>Who am I?</li>
            <li>What brought me here?</li>
            <li>Where do I want to go? <span>Where is there?</span></li>
            <li>How do I change course from here to there?</li>
            <li>Why even go there?</li>
          </ul>
          <p className="sos-lede" style={{ marginTop: 28 }}>
            Uncovering your Story of Self lets you look honestly at these questions: your experiences, your strengths, your values. That's how
            you start to see the purpose behind your journey, instead of just following someone else's script for it.
          </p>
        </div>
      </section>

      <section className="sos-section">
        <div className="sos-wrap">
          <div className="sos-eyebrow">The story circle</div>
          <h2 style={{ fontSize: "clamp(32px, 5vw, 46px)", maxWidth: 720 }}>Every story ever told follows the same six steps. So does yours.</h2>
          <p className="sos-lede" style={{ maxWidth: 680, marginTop: 16 }}>
            Every culture, in every era, has used story to make sense of life. Understanding how stories work lets you understand your own,
            and change it.
          </p>
          <SixCs />
        </div>
      </section>

      <section className="sos-section alt">
        <div className="sos-wrap">
          <p className="sos-quote">
            Stories are usually told about the past. But your story is <em>still unfolding</em>. There's the journey you've been on,
            and there's the adventure yet to unfold.
          </p>
          <p className="sos-quote-by">Rewrite your story, rewrite your life.</p>
        </div>
      </section>

      <section className="sos-section">
        <div className="sos-wrap">
          <div className="sos-eyebrow">How to walk the path</div>
          <h2 style={{ fontSize: "clamp(32px, 5vw, 46px)" }}>Six tips for your story path</h2>
          <div className="sos-tips">
            {TIPS.map((x, i) => (
              <div className="sos-tip" key={x.t}>
                <div className="n">{i + 1}</div>
                <h3>{x.t}</h3>
                <p>{x.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sos-section alt">
        <div className="sos-narrow">
          <div className="sos-eyebrow">Your guide</div>
          <h2 style={{ fontSize: "clamp(30px, 4.5vw, 40px)" }}>Meet your Story Champion.</h2>
          <p className="sos-lede" style={{ marginTop: 16 }}>
            <em>Champion: one who fights for, or defends, the cause of another.</em>
          </p>
          <p>
            Your Champion is an AI guide trained on the Story of Self method created by Aaron Donaghy. It won't hand you answers. In Story, the
            answers are yours. It asks good questions, listens closely, and helps you see patterns in your own story. You are the hero.
            The Champion is the guide.
          </p>
          <p style={{ color: "var(--muted)", fontSize: 15 }}>
            Your conversations are private to your account. Story of Self is reflection, not therapy. If you're ever not okay, your Champion
            will point you to real people who can help.
          </p>
        </div>
      </section>

      <section className="sos-section" id="invitation">
        <div className="sos-narrow">
          <Invitation />
        </div>
      </section>
    </>
  );
}
