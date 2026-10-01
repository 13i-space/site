"use client";
import { MODULES, LEVELS } from "../../../../lib/story/academy/curriculum";
import { isDone, isLocked, requirementsMet, allDone } from "../../../../lib/story/academy/useAcademy";
import { ModeChip, ProgressRing } from "./Visuals";

export function AcademyBar({ progress, here }) {
  const done = MODULES.filter((m) => isDone(progress, m.slug)).length;
  const pct = Math.round((done / MODULES.length) * 100);
  return (
    <div className="ac-bar">
      <div className="ac-bar-in">
        <a href="/story/academy" className="ac-bar-brand">
          <span className="ac-bar-mark" aria-hidden="true" />
          Champion Academy
        </a>
        <nav className="ac-bar-mods" aria-label="Modules">
          {MODULES.map((m) => (
            <a key={m.slug} href={`/story/academy/${m.slug}`} title={m.title}
              className={`${here === m.slug ? "here" : ""} ${isDone(progress, m.slug) ? "done" : ""} ${isLocked(progress, m.slug) ? "locked" : ""}`}>
              {m.n}
            </a>
          ))}
          <a href="/story/academy/certificate" title="Certificate" className={`cert ${allDone(progress) ? "done" : ""} ${here === "certificate" ? "here" : ""}`}>★</a>
        </nav>
        <ProgressRing pct={pct} size={38} stroke={4} label={`${pct}% of the Academy complete`} />
      </div>
    </div>
  );
}

export function UnlockCard({ academy }) {
  const L = LEVELS[1];
  return (
    <div className="ac-unlock">
      <div className="ac-unlock-badge">Level 1</div>
      <h3>{L.name}</h3>
      <p>{L.blurb}</p>
      <ul>
        <li>SEE all six lessons and all six Story Write elements</li>
        <li>The Practice Room: six simulated students, scored on Aaron's rubric</li>
        <li>Safety, boundaries and care</li>
        <li>Your Digital Certificate, and a place in the Champion pool</li>
      </ul>
      <div className="ac-unlock-price"><b>{L.price}</b><span>{L.priceNote}</span></div>
      <button type="button" className="sos-btn" onClick={() => academy.save({ level1: true })}>Unlock Level 1 · free in this preview</button>
      <small>Prototype: no payment is taken.</small>
    </div>
  );
}

export default function ModuleFrame({ academy, slug, sections = [], requirements = [], children }) {
  const { progress, save, ready } = academy;
  const m = MODULES.find((x) => x.slug === slug);
  const idx = MODULES.indexOf(m);
  const nextM = MODULES[idx + 1];
  const done = isDone(progress, slug);
  const canFinish = requirementsMet(progress, slug);
  const locked = isLocked(progress, slug);
  const level = LEVELS.find((l) => l.id === m.level);

  async function finish() {
    await save((cur) => ({ ...cur, modules: { ...cur.modules, [slug]: cur.modules?.[slug] || new Date().toISOString() } }));
  }

  return (
    <>
      <AcademyBar progress={progress} here={slug} />
      <header className="ac-mhead">
        <div className="ac-wrap">
          <div className="ac-mhead-meta">
            <span className="ac-mnum">Module {m.n}</span>
            <span className="ac-dot" />
            <span>{level.name}</span>
            <span className="ac-dot" />
            <span>~{m.mins} min</span>
            <ModeChip mode={m.mode} />
          </div>
          <h1>{m.title}</h1>
          <p className="ac-mtag">{m.tag}</p>
        </div>
      </header>

      {!ready ? (
        <div className="sos-center">Opening the Academy…</div>
      ) : locked ? (
        <div className="ac-wrap ac-locked"><UnlockCard academy={academy} /></div>
      ) : (
        <div className="ac-wrap ac-mbody">
          <aside className="ac-rail">
            <div className="ac-rail-in">
              <div className="ac-rail-h">In this module</div>
              <ol>
                {sections.map((s) => <li key={s.id}><a href={`#${s.id}`}>{s.label}</a></li>)}
              </ol>
              {requirements.length > 0 && (
                <div className="ac-req">
                  <div className="ac-rail-h">To complete</div>
                  <ul>
                    {requirements.map((r) => (
                      <li key={r.label} className={r.met ? "met" : ""}>
                        <span aria-hidden="true">{r.met ? "✓" : ""}</span>{r.label}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </aside>
          <div className="ac-content">
            {children}
            <div className={`ac-finish ${done ? "done" : ""}`} id="finish">
              {done ? (
                <>
                  <div className="ac-finish-k">Module {m.n} complete</div>
                  <h3>{nextM ? `Next: ${nextM.title}` : "You've finished every module."}</h3>
                  <a className="sos-btn" href={nextM ? `/story/academy/${nextM.slug}` : "/story/academy/certificate"}>
                    {nextM ? "Continue" : "Claim your certificate"} →
                  </a>
                </>
              ) : (
                <>
                  <div className="ac-finish-k">Finish Module {m.n}</div>
                  <h3>{canFinish ? "You're ready." : "Almost there."}</h3>
                  {!canFinish && <p>Complete the items under “To complete” to finish this module.</p>}
                  <button type="button" className="sos-btn" disabled={!canFinish} onClick={finish}>Complete module {m.n}</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
