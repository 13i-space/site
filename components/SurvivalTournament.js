"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import AlienCard from "./AlienCard";
import { runTournament, WINS_NEEDED } from "../lib/survivalEngine";
import { TOURNAMENT_TRIALS } from "../lib/survivalTrials";
import { recordMilestone } from "../lib/milestones";
import { ping, soundOn } from "../lib/spaceSound";

// THE SURVIVAL TRIALS (Update 5.59). The engine (lib/survivalEngine.js)
// decides the whole tournament up front from one seed; this page reveals it
// battle by battle, trial by trial: the scenario, the two scores, who
// survives it - first to three. NEXT BATTLE, AUTO PLAY, PAUSE, REPLAY (the
// same tournament again) and a fresh seed. Any finished battle in the
// bracket can be opened again.
//
// Survival, not combat: species endure, adapt, outlast. No health bars,
// no hits, no weapons.

const VERBS = ["SURVIVES", "ENDURES", "ADAPTS", "OUTLASTS IT", "CONTINUES"];
const T = { desc: 950, scoreA: 650, scoreB: 650, verdict: 1100, result: 1800, between: 1300 };
const upper = (s) => String(s || "").toUpperCase();
const href = (sp) => sp.href || `/galaxy/aliens/${sp.id}`;
const isArchive = (sp) => String(sp.id).startsWith("archive-");

function CountUp({ to, run, color }) {
  const [v, setV] = useState(run ? 0 : to);
  useEffect(() => {
    if (!run) { setV(to); return; }
    let raf = 0; const start = performance.now(), dur = 520;
    const tick = (n) => { const k = Math.min(1, (n - start) / dur); setV(Math.round(to * (1 - Math.pow(1 - k, 3)))); if (k < 1) raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, run]);
  return <span style={{ color }}>{v}</span>;
}

function Mini({ sp, ci, win, lose, mine, pending }) {
  if (!sp) return <div className="st-row st-row-bye"><span className="mono">bye</span></div>;
  if (pending) return <div className="st-row st-row-pending"><span className="st-thumb" /><span className="st-row-name">&hellip;</span><span className="mono st-row-ci" /></div>;
  return (
    <div className={`st-row ${win ? "st-row-win" : ""} ${lose ? "st-row-lose" : ""} ${mine ? "st-row-mine" : ""}`}>
      <span className="st-thumb">
        {sp.portrait_svg ? <img src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(sp.portrait_svg)}`} alt="" /> : <span>{(sp.name || "?")[0]}</span>}
      </span>
      <span className="st-row-name">{pending ? "…" : sp.name}</span>
      <span className="mono st-row-ci">{ci}</span>
    </div>
  );
}

export default function SurvivalTournament({ entrants, highlight = null }) {
  const [seed, setSeed] = useState(null);
  useEffect(() => { setSeed(String(Math.floor(Math.random() * 1e9))); }, []);
  const t = useMemo(() => (seed ? runTournament(entrants, { seed, trials: TOURNAMENT_TRIALS }) : null), [entrants, seed]);
  const battles = useMemo(() => (t ? t.rounds.flatMap((r) => r.matches.filter((m) => !m.bye).map((m) => ({ ...m, roundName: r.name }))) : []), [t]);

  const [cursor, setCursor] = useState(-1); // battle being shown; -1 = the field, before it begins
  const [step, setStep] = useState(0); // within a battle: trial index * 4 + beat, then the result
  const [auto, setAuto] = useState(false);
  const [inspect, setInspect] = useState(null); // a finished battle, opened from the bracket
  const timer = useRef(null);
  const stageRef = useRef(null);
  const bracketRef = useRef(null);

  const battle = cursor >= 0 && cursor < battles.length ? battles[cursor] : null;
  const done = t && cursor >= battles.length;
  const beatsFor = (b) => b.trials.length * 4 + 1; // desc, scoreA, scoreB, verdict per trial; then the result
  const battleDone = battle && step >= beatsFor(battle);

  // the clock: walk the beats of the current battle; with AUTO PLAY, on to the next
  useEffect(() => {
    clearTimeout(timer.current);
    if (!battle) return;
    if (!battleDone) {
      const beat = step % 4, last = step === beatsFor(battle) - 1;
      const ms = last ? T.result : [T.desc, T.scoreA, T.scoreB, T.verdict][beat];
      timer.current = setTimeout(() => setStep((s) => s + 1), ms);
      if (beat === 3 && !last && soundOn()) { const tr = battle.trials[Math.floor(step / 4)]; ping(tr.winner === "a" ? 523 : 659, 0.035); }
    } else {
      recordMilestone("trials");
      if (auto) timer.current = setTimeout(() => next(), T.between);
    }
    return () => clearTimeout(timer.current);
  }, [battle, step, auto]); // eslint-disable-line react-hooks/exhaustive-deps

  const next = () => {
    setInspect(null);
    setCursor((c) => c + 1);
    setStep(0);
    if (stageRef.current && window.scrollY > stageRef.current.offsetTop + 200) stageRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const begin = () => { setCursor(0); setStep(0); };
  const replay = () => { setInspect(null); setCursor(0); setStep(0); setAuto(true); };
  const fresh = () => { setInspect(null); setAuto(false); setCursor(-1); setStep(0); setSeed(String(Math.floor(Math.random() * 1e9))); };

  // which battles have finished (for the bracket and the records)
  const finished = new Set(battles.slice(0, Math.max(0, cursor + (battleDone ? 1 : 0))).map((b) => b.id));
  if (done) battles.forEach((b) => finished.add(b.id));
  const liveRecord = {};
  battles.forEach((b) => {
    if (!finished.has(b.id)) return;
    const w = b.winner === "a" ? b.a : b.b, l = b.winner === "a" ? b.b : b.a;
    (liveRecord[w.id] = liveRecord[w.id] || { w: 0, l: 0 }).w++;
    (liveRecord[l.id] = liveRecord[l.id] || { w: 0, l: 0 }).l++;
  });
  const rec = (sp) => { const r = liveRecord[sp.id]; return r ? `${r.w}–${r.l}` : "0–0"; };
  const mine = (sp) => sp && highlight && String(sp.id) === String(highlight);

  if (!t) return <div className="st"><div className="st-hero"><h1 className="st-title">THE SURVIVAL TRIALS</h1></div></div>;
  if (t.entrants.length < 2) {
    return (
      <div className="st">
        <div className="st-hero"><h1 className="st-title">THE SURVIVAL TRIALS</h1><p className="st-sub">13i is watching.</p></div>
        <p className="st-note">The Trials need at least two species. <Link href="/create/alien-lab">Make one in the Alien Lab &rarr;</Link></p>
      </div>
    );
  }

  const shown = inspect ? battles.find((b) => b.id === inspect) : battle;
  const shownStep = inspect ? Infinity : step;
  const mineEntrant = highlight && t.entrants.find((e) => String(e.id) === String(highlight));

  return (
    <div className="st">
      <Link href="/galaxy/aliens" className="mono st-back">&larr; Aliens of the Galaxy</Link>
      <header className="st-hero">
        <div className="mono st-kicker">a tournament of every species in the galaxy</div>
        <h1 className="st-title">THE SURVIVAL TRIALS</h1>
        <p className="st-sub">13i is watching.</p>
        <div className="mono st-facts">
          <span>{t.entrants.length} species</span>
          <span>{battles.length} battles</span>
          {t.byes > 0 && <span>{t.byes} {t.byes === 1 ? "bye" : "byes"} to the top seeds</span>}
          <span>first to {WINS_NEEDED} trials</span>
        </div>
        {mineEntrant && <div className="st-yours">Your species, <b>{mineEntrant.name}</b>, has entered. Seeded #{t.entrants.indexOf(mineEntrant) + 1} of {t.entrants.length}.</div>}
      </header>

      <div className="st-controls">
        {cursor < 0 && <button className="st-btn st-btn-main" onClick={begin}>Begin trial &rarr;</button>}
        {cursor >= 0 && !done && <button className="st-btn st-btn-main" onClick={next} disabled={!battleDone && !inspect}>Next battle &rarr;</button>}
        {!done && (auto
          ? <button className="st-btn" onClick={() => setAuto(false)}>Pause</button>
          : <button className="st-btn" onClick={() => { setAuto(true); if (cursor < 0) begin(); else if (battleDone) next(); }}>Auto play</button>)}
        {done && <button className="st-btn st-btn-main" onClick={replay}>Replay</button>}
        <button className="st-btn st-btn-quiet" onClick={fresh}>New tournament</button>
      </div>

      <section ref={stageRef} className="st-stage">
        {done && !inspect ? (
          <Champion t={t} onBracket={() => bracketRef.current?.scrollIntoView({ behavior: "smooth" })} mine={mine} />
        ) : !shown ? (
          <div className="st-field">
            <p className="st-field-line">The field, by Continuance Index. Top seeds wait for the opening round to finish.</p>
            <div className="st-field-grid">
              {t.entrants.map((sp, i) => (
                <div key={sp.id} className={`st-seed ${mine(sp) ? "st-seed-mine" : ""}`}>
                  <span className="mono st-seed-n">#{i + 1}</span>
                  <Mini sp={sp} ci={sp.ci} mine={mine(sp)} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <Battle b={shown} step={shownStep} rec={rec} mine={mine} inspecting={!!inspect} onBack={() => setInspect(null)} index={battles.indexOf(shown)} total={battles.length} t={t} />
        )}
      </section>

      <section ref={bracketRef} className="st-bracket-wrap">
        <div className="mono st-label">the bracket</div>
        <div className="st-bracket">
          {t.rounds.map((r) => (
            <div key={r.index} className="st-round">
              <div className="mono st-round-name">{r.name}</div>
              <div className="st-round-matches">
                {r.matches.map((m) => {
                  const fin = m.bye || finished.has(m.id);
                  const live = battle && battle.id === m.id && !battleDone;
                  // entrants appear once the battles that send them here are done
                  const known = (sp) => sp && (r.index === 0 || t.rounds[r.index - 1].matches.some((pm) => (pm.bye || finished.has(pm.id)) && (pm.winner === "a" ? pm.a : pm.b)?.id === sp.id));
                  return (
                    <button key={m.id} className={`st-match ${live ? "st-match-live" : ""} ${fin && !m.bye ? "st-match-done" : ""}`} disabled={!fin || m.bye} onClick={() => { setInspect(m.id); setAuto(false); stageRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }); }} title={fin && !m.bye ? "Open this battle again" : undefined}>
                      <Mini sp={m.a} ci={m.a?.ci} win={fin && m.winner === "a"} lose={fin && !m.bye && m.winner === "b"} mine={known(m.a) && mine(m.a)} pending={m.a && !known(m.a)} />
                      <Mini sp={m.b} ci={m.b?.ci} win={fin && m.winner === "b"} lose={fin && !m.bye && m.winner === "a"} mine={known(m.b) && mine(m.b)} pending={m.b && !known(m.b)} />
                      {fin && !m.bye && <span className="mono st-match-score">{m.winsA}&ndash;{m.winsB}</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
          <div className="st-round st-round-champ">
            <div className="mono st-round-name">Champion</div>
            <div className="st-round-matches">
              <div className={`st-match st-match-champ ${done ? "st-match-done" : ""}`}>
                {done ? <Mini sp={t.champion} ci={t.champion.ci} win mine={mine(t.champion)} /> : <div className="st-row st-row-bye"><span className="mono">?</span></div>}
              </div>
            </div>
          </div>
        </div>
      </section>

      <p className="st-note">
        Every species meets the same five scenarios: {TOURNAMENT_TRIALS.length} trials, first to {WINS_NEEDED}. Each trial weighs different attributes, and chance
        plays its part: a higher Continuance Index is an advantage, never a guarantee.
      </p>
    </div>
  );
}

function Battle({ b, step, rec, mine, inspecting, onBack, index, total, t }) {
  const shownTrials = b.trials.filter((_, i) => step > i * 4);
  const cur = Math.floor(step / 4), beat = step % 4;
  let wa = 0, wb = 0;
  b.trials.forEach((tr, i) => { if (step > i * 4 + 3) tr.winner === "a" ? wa++ : wb++; });
  const finishedNow = step >= b.trials.length * 4;
  const win = b.winner === "a" ? b.a : b.b, lose = b.winner === "a" ? b.b : b.a;
  const nextRound = t.rounds[b.round + 1]?.name;
  const tr = b.trials[Math.min(cur, b.trials.length - 1)];
  const verb = (k) => VERBS[(k + b.id.length) % VERBS.length];
  const W = typeof window !== "undefined" && window.innerWidth < 640 ? 140 : 190;

  return (
    <div className="st-battle">
      <div className="mono st-battle-head">
        <span>{b.roundName.toUpperCase()}</span>
        <span>battle {index + 1} of {total}</span>
        {inspecting && <button className="st-linkbtn" onClick={onBack}>back to the live trials &rarr;</button>}
      </div>
      <div className="st-versus">
        {[["a", b.a, wa], ["b", b.b, wb]].map(([side, sp, wins]) => (
          <div key={side} className={`st-side st-side-${side} ${finishedNow && b.winner === side ? "st-side-win" : ""} ${finishedNow && b.winner !== side ? "st-side-lose" : ""} ${mine(sp) ? "st-side-mine" : ""}`}>
            <div><AlienCard species={sp} creator={sp.creator} width={W} /></div>
            <div className="st-side-name">{upper(sp.name)}</div>
            <div className="mono st-side-meta">CI {sp.ci} &middot; record {rec(sp)}{mine(sp) ? " · yours" : ""}</div>
            <div className="st-tally" aria-label={`${wins} trials survived`}>
              {Array.from({ length: WINS_NEEDED }).map((_, i) => <span key={i} className={i < wins ? "st-tally-on" : ""} />)}
            </div>
          </div>
        ))}
        <div className="st-vs">vs.</div>
      </div>

      {!finishedNow ? (
        <div className="st-trial" key={cur}>
          <div className="mono st-trial-n">trial {cur + 1}</div>
          <div className="st-trial-name">{upper(tr.trial.name)}</div>
          <p className="st-trial-text">{tr.trial.text}</p>
          <div className="st-scores">
            <div className={`st-score ${beat >= 1 ? "st-score-in" : ""}`}><span className="st-score-who">{upper(b.a.name)}</span><span className="st-score-n">{beat >= 1 ? <CountUp to={tr.a} run={!inspecting} /> : "—"}</span>{tr.fitsA > 0 && beat >= 1 && <span className="mono st-fit">suited ★</span>}</div>
            <div className={`st-score ${beat >= 2 ? "st-score-in" : ""}`}><span className="st-score-who">{upper(b.b.name)}</span><span className="st-score-n">{beat >= 2 ? <CountUp to={tr.b} run={!inspecting} /> : "—"}</span>{tr.fitsB > 0 && beat >= 2 && <span className="mono st-fit">suited ★</span>}</div>
          </div>
          <div className={`st-verdict ${beat >= 3 ? "st-verdict-in" : ""}`}>{beat >= 3 ? `${upper((tr.winner === "a" ? b.a : b.b).name)} ${verb(cur)}` : " "}</div>
        </div>
      ) : (
        <div className="st-result">
          <div className="st-result-name">{upper(win.name)}</div>
          <div className="st-result-line">survive the encounter</div>
          <div className="st-result-score">{b.winner === "a" ? `${b.winsA} — ${b.winsB}` : `${b.winsB} — ${b.winsA}`}</div>
          <div className="mono st-result-next">{nextRound ? `advances to ${nextRound.toLowerCase()}` : "survives the final"} &middot; {lose.name} does not continue</div>
        </div>
      )}

      {shownTrials.length > 0 && (
        <ol className="st-log">
          {b.trials.map((x, i) => step > i * 4 + 3 && (
            <li key={i} className={x.winner === "a" ? "st-log-a" : "st-log-b"}>
              <span className="st-log-name">{x.trial.name}</span>
              <span className="mono">{x.a} &middot; {x.b}</span>
              <span className="mono st-log-who">{(x.winner === "a" ? b.a : b.b).name}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

function Champion({ t, onBracket, mine }) {
  const c = t.champion, r = t.record[c.id];
  return (
    <div className="st-champ">
      <div className="mono st-champ-kicker">the survival trials are complete</div>
      <div className="st-champ-label">CHAMPION</div>
      <div className="st-champ-card"><div><AlienCard species={c} creator={c.creator} width={230} /></div></div>
      <div className="st-champ-name">{upper(c.name)}{mine(c) ? " · yours" : ""}</div>
      <div className="st-champ-stats">
        <div><span className="mono">Continuance Index</span><b>{c.ci}</b></div>
        <div><span className="mono">Final record</span><b>{r.w}&ndash;{r.l}</b></div>
        <div><span className="mono">Trials won</span><b>{r.trials}</b></div>
      </div>
      <div className="st-champ-actions">
        <Link href={href(c)} className="st-btn st-btn-main">{isArchive(c) ? "Read its story" : "View champion"} &rarr;</Link>
        <button className="st-btn" onClick={onBracket}>View tournament bracket &rarr;</button>
      </div>
    </div>
  );
}
