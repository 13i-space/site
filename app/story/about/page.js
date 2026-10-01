export const metadata = { title: "Our story", description: "Story of Self was created by Aaron Donaghy, a teacher who learned to see the invisible kid." };

const VALUES = [
  ["All In", "We finish what we start, and we try our best even when we feel resistance."],
  ["People First", "Story works through trust and respect. Every person, every story."],
  ["Community", "One boat rises, all boats rise. When one person grows, the people around them benefit."],
  ["Do the Impossible", "Personal transformation isn't easy. It's worth it."],
];

const STORY = [
  ["Ordinary World", "I walked the halls of Van Hoosen Junior High in the mid-eighties, fully embracing MTV fashion: untied sneakers, a mousse-filled mullet, and the crown jewel, shiny zipper-covered parachute pants. They were my older brother's. Wearing them felt like wearing a piece of his magic."],
  ["Defining Moment", "A girl behind me called out, “Hey, Aaron!” My world began to move in slow motion. A cheerleader, with her friends, all smiling. We locked eyes, and she said, “Nice pants.” I just knew they were not complimenting me. They were laughing at me."],
  ["Hidden Value", "This was the day I learned to become invisible."],
  ["The Fall", "I spent the next fifteen years believing I was unworthy to be seen. I learned how to be so average nobody would ever notice me. Underneath it all, I truly wanted someone to see me. And I grew angry."],
  ["Hope", "Can an invisible person see another invisible person? I could. As a teacher, I could spot that kid: the kid in the sweatshirt and jeans, sitting in the middle to the side. Not only did I see them, I saw what nobody saw in me. I saw potential."],
  ["Higher Value", "I can see potential."],
  ["Call to Action", "I will commit my life to seeing and unleashing the potential in others' stories, so that they can choose the courage to change their own story and their own worlds."],
];

export default function About() {
  return (
    <div className="sp">
      <section className="sp-hero">
        <div className="sp-wrap">
          <div className="sos-eyebrow">Our story</div>
          <h1>It started with a pair of <em>parachute pants.</em></h1>
          <p className="sp-lede">Story of Self was created by Aaron Donaghy, a teacher who spent years believing he was invisible, and then discovered he could see the potential in every kid who felt the same way.</p>
        </div>
      </section>

      <section className="sp-sec">
        <div className="sp-wrap sp-two">
          <div>
            <h2>From the classroom to Story of Self</h2>
            <p>As a teacher, Aaron kept a small sign by his desk that said <b>“Anyone Can Lead.”</b> He didn't want to see his students only as learners, but as leaders. He created a class simply called Leadership, with no curriculum and no experience, because he'd realized something: the masks students wore to hide their fear were also hiding their potential.</p>
            <p>That work became Story of Self: a step-by-step way to look at the story you've been living, find the belief that's been quietly holding you back, and choose a truer story to live next. Aaron and trained Story Champions have since guided people through it in groups and one-on-one.</p>
            <p>Now Story of Self is coming online, for the moment it may matter most: the year after high school.</p>
          </div>
          <figure className="sp-quote">
            <blockquote>“Just as it was my job to give them knowledge, I saw it as my responsibility to give them the strength to lead.”</blockquote>
            <figcaption>Aaron Donaghy, founder</figcaption>
          </figure>
        </div>
      </section>

      <section className="sp-sec alt">
        <div className="sp-wrap">
          <div className="sos-eyebrow">The Invisible Kid</div>
          <h2>Aaron's own Story of Self, in brief</h2>
          <p className="sp-muted">Every Story of Self follows the same shape. Here's the founder's, excerpted.</p>
          <div className="sp-story">
            {STORY.map(([h, t]) => (
              <div key={h} className={`sp-story-row${h.includes("Value") ? " hv" : ""}`}>
                <span>{h}</span>
                <p>{t}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sp-sec">
        <div className="sp-wrap">
          <div className="sos-eyebrow">What we believe</div>
          <h2>Our mission</h2>
          <p className="sp-mission">To help every young person own their story, so they can choose the courage to write the next chapter, and help others do the same.</p>
          <div className="sp-values">
            {VALUES.map(([t, d], i) => <div key={t}><span>{i + 1}</span><b>{t}</b><p>{d}</p></div>)}
          </div>
        </div>
      </section>

      <section className="sp-sec alt">
        <div className="sp-wrap sp-two">
          <div>
            <h2>Built on story, and on science</h2>
            <p>Each of the six elements of Story of Self, Character, Challenge, Choice, Cave, Change and Create, is rooted in research from biology, psychology, neuroscience, social science and anthropology. And every culture, in every era, has used story to make sense of life.</p>
            <p>Story of Self brings the two together: the structure of the hero's journey, applied honestly to your own life.</p>
          </div>
          <div>
            <h2>Where we're going</h2>
            <p>An AI Story Champion for every young person who wants one, trained human Champions for the moments that matter most, and a Champion Academy so anyone who wants to fight for a young person's story can learn how.</p>
            <div className="sh-row">
              <a className="sos-btn" href="/story/begin">Begin your story</a>
              <a className="sos-btn ghost" href="/story/academy">Become a Champion</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
