"use client";
import { useAcademy, isDone, isLocked, foundationsDone, allDone } from "../../../lib/story/academy/useAcademy";
import { MODULES, LEVELS, DEFINITION, WELCOME, PERSONAS } from "../../../lib/story/academy/curriculum";
import { OrbitHero, ModeChip } from "./_components/Visuals";
import { AcademyBar } from "./_components/ModuleFrame";
import Certificate from "./_components/Certificate";

const LEVEL_DOES = [
  ["A Foundations badge", "Aaron's Framework for Coaching", "Your first Master Champion conversation"],
  ["Champion students one-on-one", "Paid live sessions in the Journey + Champion tier", "A Digital Certificate and a place in the Champion pool"],
  ["Lead full 24-session cohorts", "Host Story Nights", "Mentor new Champions"],
];

export default function AcademyHome() {
  const academy = useAcademy();
  const { progress, ready, name } = academy;
  const next = MODULES.find((m) => !isDone(progress, m.slug));
  const started = MODULES.some((m) => isDone(progress, m.slug));
  const cta = allDone(progress)
    ? { href: "/story/academy/certificate", label: "View your certificate" }
    : started && next
      ? { href: `/story/academy/${next.slug}`, label: `Continue: Module ${next.n}` }
      : { href: "/story/academy/welcome", label: "Start free" };

  return (
    <>
      {ready && started && <AcademyBar progress={progress} here="home" />}

      <section className="ac-hero">
        <div className="ac-wrap ac-hero-grid">
          <div className="ac-hero-copy">
            <div className="sos-eyebrow">Story of Self · Champion Academy</div>
            <h1>Become a <em>Story Champion.</em></h1>
            <p className="ac-hero-lede">
              {name ? `${name}, learn` : "Learn"} to guide young people through their Story of Self the way Aaron Donaghy trains Champions:
              step by step, with an AI Master Champion beside you and simulated students to practice on.
            </p>
            <div className="sos-hero-actions">
              <a className="sos-btn" href={cta.href}>{cta.label}</a>
              <a className="sos-btn ghost" href="#path">See the pathway</a>
            </div>
            <div className="ac-hero-facts">
              <span><b>7</b> modules</span>
              <span><b>6</b> practice students</span>
              <span><b>1</b> Digital Certificate</span>
            </div>
          </div>
          <div className="ac-hero-art"><OrbitHero /></div>
        </div>
      </section>

      <section className="ac-band">
        <div className="ac-wrap ac-band-in">
          <div className="ac-band-word">{DEFINITION.word}</div>
          <div className="ac-band-mean">{DEFINITION.meaning}</div>
        </div>
      </section>

      <section className="sos-section">
        <div className="ac-wrap">
          <figure className="ac-bigquote center">
            <div className="ac-bigquote-k">{WELCOME.anyone.title}</div>
            <blockquote>{WELCOME.anyone.quote}</blockquote>
            <figcaption>{WELCOME.anyone.by}</figcaption>
          </figure>
        </div>
      </section>

      <section className="sos-section alt" id="curriculum">
        <div className="ac-wrap">
          <div className="sos-eyebrow">The curriculum</div>
          <h2 className="ac-h2">Seven modules. Aaron's method, in order.</h2>
          <p className="ac-sub">Built from the Champion Training Toolkit: SEE and the Champion Toolkit: Build Foundation.</p>
          <div className="ac-mods">
            {MODULES.map((m) => {
              const done = isDone(progress, m.slug);
              const locked = isLocked(progress, m.slug);
              return (
                <a key={m.slug} href={`/story/academy/${m.slug}`} className={`ac-mod ${done ? "done" : ""} ${locked ? "locked" : ""}`}>
                  <div className="ac-mod-top">
                    <span className="ac-mod-n">{done ? "✓" : m.n}</span>
                    <ModeChip mode={m.mode} />
                  </div>
                  <b>{m.title}</b>
                  <p>{m.tag}</p>
                  <div className="ac-mod-foot">
                    <span>{LEVELS.find((l) => l.id === m.level).id === "foundations" ? "Free" : "Level 1"}</span>
                    <span>~{m.mins} min</span>
                  </div>
                </a>
              );
            })}
            <a href="/story/academy/certificate" className={`ac-mod cert ${allDone(progress) ? "done" : ""}`}>
              <div className="ac-mod-top"><span className="ac-mod-n">★</span></div>
              <b>Your Digital Certificate</b>
              <p>Certified Story Champion · Level 1</p>
              <div className="ac-mod-foot"><span>{allDone(progress) ? "Earned" : "After Module 7"}</span></div>
            </a>
          </div>
        </div>
      </section>

      <section className="sos-section" id="path">
        <div className="ac-wrap">
          <div className="sos-eyebrow">The pathway</div>
          <h2 className="ac-h2">Start free. Grow into a Champion.</h2>
          <div className="ac-path">
            {LEVELS.map((l, i) => (
              <div key={l.id} className={`ac-path-card l${i}${i === 0 && foundationsDone(progress) ? " earned" : ""}`}>
                <div className="ac-path-step">{i + 1}</div>
                <div className="ac-path-price">{l.price}{l.priceNote && <small>{l.priceNote}</small>}</div>
                <h3>{l.name}</h3>
                <p>{l.blurb}</p>
                <ul>{LEVEL_DOES[i].map((x) => <li key={x}>{x}</li>)}</ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sos-section alt">
        <div className="ac-wrap ac-split">
          <div>
            <div className="sos-eyebrow">The Practice Room</div>
            <h2 className="ac-h2">Practice on students who aren't real, before you meet ones who are.</h2>
            <p className="ac-sub">Each simulated student is built from a moment Aaron's toolkits warn about. Champion them, then get a debrief from a Master Champion, scored on Aaron's rubric.</p>
          </div>
          <div className="ac-faces">
            {PERSONAS.map((p) => (
              <div key={p.id} className="ac-face">
                <span className="ac-av" style={{ width: 46, height: 46, background: p.hue, fontSize: 19 }}>{p.name[0]}</span>
                <div><b>{p.name}, {p.age}</b><small>{p.skill}</small></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sos-section">
        <div className="ac-wrap ac-split rev">
          <div className="ac-cert-tease"><Certificate name={name || "Your Name"} date="Your date" id="SOS-CH1-0000-XXXX" /></div>
          <div>
            <div className="sos-eyebrow">Earn your certificate</div>
            <h2 className="ac-h2">Certified Story Champion.</h2>
            <p className="ac-sub">Finish all seven modules and your Digital Certificate is issued in your name, ready to download, print or share. Then you're ready to join the Champion pool and champion your first students.</p>
            <a className="sos-btn" href={cta.href}>{cta.label}</a>
          </div>
        </div>
      </section>
    </>
  );
}
