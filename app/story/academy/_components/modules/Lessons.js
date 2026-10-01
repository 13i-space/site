"use client";
import { useState } from "react";
import ModuleFrame from "../ModuleFrame";
import Quiz from "../Quiz";
import { Callout, ModeChip, Stars } from "../Visuals";
import { SIX_LESSONS, FRAMEWORK, QUIZZES } from "../../../../../lib/story/academy/curriculum";
import { quizPassed } from "../../../../../lib/story/academy/useAcademy";

const HEART = Object.fromEntries(FRAMEWORK.find((s) => s.key === "lessons").questions);

function Circle({ on, onPick, seen }) {
  const cx = 170, cy = 170, R = 128;
  return (
    <svg viewBox="0 0 340 340" className="ac-circle" role="group" aria-label="The Story Circle">
      <circle cx={cx} cy={cy} r={R} fill="none" stroke="#E2D6C5" strokeWidth="2" />
      <line x1={cx - 92} y1={cy} x2={cx + 92} y2={cy} stroke="#E2D6C5" strokeDasharray="3 5" />
      <text x={cx} y={cy - 12} textAnchor="middle" className="ac-orbit-k">KNOWN</text>
      <text x={cx} y={cy + 22} textAnchor="middle" className="ac-orbit-k">UNKNOWN</text>
      {SIX_LESSONS.map((l, i) => {
        const a = (-90 + i * 60) * (Math.PI / 180);
        const x = cx + R * Math.cos(a), y = cy + R * Math.sin(a);
        const active = i === on;
        return (
          <g key={l.c} className="ac-circle-node" role="button" tabIndex={0} aria-pressed={active} aria-label={l.c}
            onClick={() => onPick(i)} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onPick(i)}>
            <circle cx={x} cy={y} r={active ? 34 : 30} fill={active ? "#C25B34" : seen.has(i) ? "#F6E3D8" : "#FFFCF7"} stroke="#C25B34" strokeWidth="2" />
            <text x={x} y={y - 3} textAnchor="middle" className="ac-circle-n" fill={active ? "#fff" : "#A2461F"}>{i + 1}</text>
            <text x={x} y={y + 12} textAnchor="middle" className="ac-circle-c" fill={active ? "#fff" : "#5E534B"}>{l.c}</text>
          </g>
        );
      })}
    </svg>
  );
}

export default function Lessons({ academy }) {
  const [on, setOn] = useState(0);
  const [seen, setSeen] = useState(new Set([0]));
  const l = SIX_LESSONS[on];
  const p = academy.progress;
  const pick = (i) => { setOn(i); setSeen((s) => new Set([...s, i])); };
  return (
    <ModuleFrame academy={academy} slug="lessons"
      sections={[{ id: "circle", label: "The six lessons" }, { id: "check", label: "Knowledge check" }]}
      requirements={[{ label: `Explore all six lessons (${seen.size}/6)`, met: seen.size === 6 || quizPassed(p, "lessons") }, { label: "Pass the knowledge check", met: quizPassed(p, "lessons") }]}>
      <section id="circle" className="ac-sec">
        <p className="ac-lede">Each of the six C's is a Story Lesson. For each one, here are Aaron's facilitator notes: how long it runs, how hard it is to lead, what it covers, and how to lead it step by step.</p>
        <div className="ac-lessons">
          <div className="ac-lessons-circle">
            <Circle on={on} onPick={pick} seen={seen} />
            <p className="ac-muted ac-center-t">Tap a lesson on the circle</p>
          </div>
          <article className="ac-fcard" key={l.c}>
            <div className="ac-fcard-top">
              <div>
                <div className="ac-fcard-n">Lesson {l.n} · {l.c}</div>
                <h3>{l.lesson}</h3>
              </div>
              <ModeChip mode={l.mode} />
            </div>
            <div className="ac-fcard-meta">
              <span><b>Time</b>{l.time}</span>
              <span><b>Difficulty</b><Stars n={l.stars} /></span>
            </div>
            <p className="ac-heart">“{HEART[l.c]}”</p>
            <p>{l.intro}</p>
            <div className="ac-pills">{l.covers.map((c) => <span key={c}>{c}</span>)}</div>
            <div className="ac-colh" style={{ marginTop: 18 }}>Facilitator notes</div>
            <ol className="ac-timeline">{l.steps.map((s, i) => <li key={i}><span>Step {i + 1}</span>{s}</li>)}</ol>
            <Callout kind={l.note.kind} text={l.note.text} />
            <div className="ac-row between" style={{ marginTop: 18 }}>
              <button type="button" className="sos-btn ghost" disabled={on === 0} onClick={() => pick(on - 1)}>← Back</button>
              {on < 5 ? <button type="button" className="sos-btn" onClick={() => pick(on + 1)}>{SIX_LESSONS[on + 1].c} →</button> : <a className="sos-btn" href="#check">Knowledge check →</a>}
            </div>
          </article>
        </div>
      </section>
      <section id="check" className="ac-sec">
        <h2>Knowledge check</h2>
        <Quiz quiz={QUIZZES.lessons} best={p.quizzes?.lessons || 0}
          onScore={(pct) => academy.save((cur) => ({ ...cur, quizzes: { ...cur.quizzes, lessons: Math.max(pct, cur.quizzes?.lessons || 0) } }))} />
      </section>
    </ModuleFrame>
  );
}
