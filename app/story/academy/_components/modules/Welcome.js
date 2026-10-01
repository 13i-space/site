"use client";
import ModuleFrame from "../ModuleFrame";
import { DEFINITION, WELCOME, LEVELS } from "../../../../../lib/story/academy/curriculum";

function Bike() {
  return (
    <svg viewBox="0 0 64 40" width="64" height="40" aria-hidden="true" className="ac-bike">
      <circle cx="14" cy="28" r="10" fill="none" stroke="currentColor" strokeWidth="2.4" />
      <circle cx="50" cy="28" r="10" fill="none" stroke="currentColor" strokeWidth="2.4" />
      <path d="M14 28 L26 12 L40 12 L50 28 M26 12 L32 28 L40 12 M32 28 L14 28 M24 8 h6 M40 12 l-2 -6 h6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

export default function Welcome({ academy }) {
  const name = academy.name;
  return (
    <ModuleFrame academy={academy} slug="welcome"
      sections={[{ id: "champion", label: "Cham·pi·on" }, { id: "anyone", label: "Anyone can lead" }, { id: "aims", label: "Aims & outcomes" }, { id: "see", label: "Learning by SEEing" }, { id: "bike", label: "Like riding a bike" }, { id: "path", label: "Your pathway" }]}>
      <section id="champion" className="ac-sec ac-define">
        <div className="ac-define-word">{DEFINITION.word}</div>
        <div className="ac-define-pos">noun</div>
        <p className="ac-define-m">{DEFINITION.meaning}</p>
        <p className="ac-lede">{name ? `${name}, welcome. ` : "Welcome. "}You're here because you want to fight for someone else's story. In Story of Self, the student is the hero. You are the guide.</p>
      </section>

      <section id="anyone" className="ac-sec">
        <figure className="ac-bigquote">
          <div className="ac-bigquote-k">{WELCOME.anyone.title}</div>
          <blockquote>{WELCOME.anyone.quote}</blockquote>
          <figcaption>{WELCOME.anyone.by}</figcaption>
        </figure>
        <p>The Champion Toolkit is built on that same belief: <b>Anyone Can Lead Story.</b> The knowledge is here. This Academy is the beginning of building your strength to lead it.</p>
      </section>

      <section id="aims" className="ac-sec">
        <h2>What this training aims at</h2>
        <p className="ac-muted">Aaron's first principle of Story applies to Champions too: you hit what you aim at.</p>
        <div className="ac-twocol">
          <div>
            <div className="ac-colh">Aims</div>
            {WELCOME.aims.map((a, i) => (
              <div className="ac-aim" key={a.t}><span className="ac-aim-n">{i + 1}</span><div><b>{a.t}</b><p>{a.d}</p></div></div>
            ))}
          </div>
          <div>
            <div className="ac-colh">Outcomes</div>
            {WELCOME.outcomes.map((a, i) => (
              <div className="ac-aim out" key={a.t}><span className="ac-aim-n">{i + 1}</span><div><b>{a.t}</b><p>{a.d}</p></div></div>
            ))}
          </div>
        </div>
        <div className="ac-hit">YOU HIT WHAT YOU AIM AT</div>
      </section>

      <section id="see" className="ac-sec">
        <h2>Champions learn by SEEing</h2>
        <p>{WELCOME.see}</p>
        <div className="ac-see">
          {["S", "E", "E"].map((l, i) => (
            <div key={i}><b>{l}</b><span>{["See the stages", "Engage people", "Every transition"][i]}</span></div>
          ))}
        </div>
        <figure className="ac-testimony">
          <blockquote>{WELCOME.testimony}</blockquote>
          <figcaption>A Story of Self graduate</figcaption>
        </figure>
        <p className="ac-muted">That's why every Champion walks their own Story of Self too. Before you guide someone into the Cave, you've been there.</p>
      </section>

      <section id="bike" className="ac-sec">
        <h2>Learning to lead Story is like riding a bike</h2>
        <ol className="ac-bikepath">
          {WELCOME.bike.map((b, i) => (
            <li key={b.t} className={i === 3 ? "crash" : i === 4 ? "love" : ""}>
              <span className="ac-bikepath-dot">{i === 4 ? <Bike /> : i + 1}</span>
              <b>{b.t}</b>
              <p>{b.d}</p>
            </li>
          ))}
        </ol>
      </section>

      <section id="path" className="ac-sec">
        <h2>Your pathway</h2>
        <div className="ac-levels">
          {LEVELS.map((l, i) => (
            <div key={l.id} className={`ac-level l${i}`}>
              <div className="ac-level-top"><span>{l.price}</span>{l.priceNote && <small>{l.priceNote}</small>}</div>
              <h3>{l.name}</h3>
              <p>{l.blurb}</p>
            </div>
          ))}
        </div>
      </section>
    </ModuleFrame>
  );
}
