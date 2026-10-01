"use client";
import { useRef, useState } from "react";
import { useAcademy, isDone, allDone, practiceCount } from "../../../../lib/story/academy/useAcademy";
import { MODULES, NEXT_STEPS, PERSONAS } from "../../../../lib/story/academy/curriculum";
import { AcademyBar } from "../_components/ModuleFrame";
import Certificate, { downloadPng } from "../_components/Certificate";

const fmtDate = (iso) => new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

function makeId() {
  const d = new Date();
  const ym = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, "0")}`;
  const abc = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let r = "";
  for (let i = 0; i < 4; i++) r += abc[Math.floor(Math.random() * abc.length)];
  return `SOS-CH1-${ym}-${r}`;
}

export default function CertificatePage() {
  const academy = useAcademy();
  const { progress, ready, name, save } = academy;
  const [full, setFull] = useState("");
  const [copied, setCopied] = useState(false);
  const svgRef = useRef(null);
  const exportRef = useRef(null);
  const cert = progress.cert;
  const complete = allDone(progress);

  if (!ready) return <div className="sos-center">Opening your certificate…</div>;

  if (!complete) {
    return (
      <>
        <AcademyBar progress={progress} here="certificate" />
        <div className="ac-wrap ac-certgate">
          <div>
            <div className="sos-eyebrow">Your Digital Certificate</div>
            <h1 className="ac-h2">Finish all seven modules to earn it.</h1>
            <ul className="ac-left">
              {MODULES.map((m) => (
                <li key={m.slug} className={isDone(progress, m.slug) ? "met" : ""}>
                  <span>{isDone(progress, m.slug) ? "✓" : m.n}</span>
                  <a href={`/story/academy/${m.slug}`}>{m.title}</a>
                </li>
              ))}
            </ul>
          </div>
          <div className="ac-cert-locked"><Certificate name={name || "Your Name"} date="—" id="SOS-CH1-PENDING" /></div>
        </div>
      </>
    );
  }

  async function issue(e) {
    e.preventDefault();
    const n = (full || name || "").trim().slice(0, 48);
    if (!n) return;
    await save({ cert: { name: n, id: makeId(), at: new Date().toISOString() } });
  }

  if (!cert) {
    return (
      <>
        <AcademyBar progress={progress} here="certificate" />
        <div className="ac-wrap ac-issue">
          <div className="ac-issue-card">
            <div className="ac-burst" aria-hidden="true"><i /><i /><i /></div>
            <div className="sos-eyebrow">Every module complete</div>
            <h1>Your certificate is ready.</h1>
            <p>How should your name appear on it?</p>
            <form onSubmit={issue} className="ac-issue-form">
              <input value={full} onChange={(e) => setFull(e.target.value)} placeholder={name ? `${name} (add your last name)` : "Your full name"} aria-label="Your name for the certificate" maxLength={48} autoFocus />
              <button className="sos-btn" type="submit" disabled={!(full || name).trim()}>Issue my certificate</button>
            </form>
          </div>
        </div>
      </>
    );
  }

  const best = Math.max(0, ...(progress.practice || []).map((s) => s.percent || 0));
  const students = practiceCount(progress);
  const date = fmtDate(cert.at);

  async function png() {
    if (exportRef.current) await downloadPng(exportRef.current, `Story-Champion-Certificate-${cert.name.replace(/\s+/g, "-")}.png`);
  }
  function copyId() {
    navigator.clipboard?.writeText(cert.id).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1800); });
  }

  return (
    <>
      <div className="ac-noprint"><AcademyBar progress={progress} here="certificate" /></div>
      <section className="ac-congrats ac-noprint">
        <div className="ac-confetti" aria-hidden="true">{Array.from({ length: 34 }, (_, i) => <i key={i} style={{ "--x": `${(i * 37) % 100}%`, "--d": `${((i * 53) % 23) / 10}s`, "--t": `${3 + ((i * 29) % 17) / 10}s` }} />)}</div>
        <div className="ac-wrap ac-congrats-in">
          <div className="ac-congrats-seal" aria-hidden="true">
            <svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="56" fill="#C25B34" /><circle cx="60" cy="60" r="49" fill="none" stroke="#F6E3D8" strokeOpacity=".6" /><circle cx="60" cy="54" r="14" fill="none" stroke="#fff" strokeWidth="3.2" /><circle cx="60" cy="33" r="4.5" fill="#fff" /><text x="60" y="88" textAnchor="middle" fontFamily="Newsreader, Georgia, serif" fontStyle="italic" fontSize="15" fill="#fff">Champion</text></svg>
          </div>
          <div className="sos-eyebrow">Congratulations</div>
          <h1>{cert.name.split(" ")[0]}, you're a<br /><em>Certified Story Champion.</em></h1>
          <p className="ac-hero-lede">You've SEEn the whole Story process, practiced it, and committed to it. You are the guide. They are the hero.</p>
          <div className="ac-stats">
            <div><b>7/7</b><span>modules</span></div>
            <div><b>{students}</b><span>students championed in practice</span></div>
            <div><b>{best}%</b><span>best practice session</span></div>
            <div><b>{progress.quizzes?.assessment || 0}%</b><span>Champion Assessment</span></div>
          </div>
        </div>
      </section>

      <section className="ac-certwrap">
        <div className="ac-wrap">
          <div className="ac-certframe ac-printable"><Certificate ref={svgRef} name={cert.name} date={date} id={cert.id} /></div>
          <div className="ac-row center ac-noprint" style={{ marginTop: 22 }}>
            <button type="button" className="sos-btn" onClick={png}>Download image</button>
            <button type="button" className="sos-btn ghost" onClick={() => window.print()}>Print or save as PDF</button>
            <button type="button" className="sos-btn ghost" onClick={copyId}>{copied ? "Copied" : `Credential ${cert.id}`}</button>
          </div>
          <div style={{ position: "absolute", left: -99999, top: 0 }} aria-hidden="true">
            <Certificate ref={exportRef} name={cert.name} date={date} id={cert.id} forExport />
          </div>
        </div>
      </section>

      <section className="sos-section alt ac-noprint">
        <div className="ac-wrap">
          <div className="sos-eyebrow">Next steps</div>
          <h2 className="ac-h2">The end of this part is the beginning of the next.</h2>
          <div className="ac-next">
            {NEXT_STEPS.map((s, i) => {
              const key = i === 0 ? "pool" : i === 1 ? "full" : null;
              const joined = key && progress.waitlist?.[key];
              return (
                <div key={s.t} className="ac-next-card">
                  <span className="ac-next-n">{i + 1}</span>
                  <h3>{s.t}</h3>
                  <p>{s.d}</p>
                  {s.href ? (
                    <a className="sos-btn ghost" href={s.href}>{s.cta}</a>
                  ) : (
                    <button type="button" className={`sos-btn${joined ? " ghost" : ""}`} disabled={joined}
                      onClick={() => save((cur) => ({ ...cur, waitlist: { ...cur.waitlist, [key]: new Date().toISOString() } }))}>
                      {joined ? "You're on the list ✓" : s.cta}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
          <p className="ac-closing">“The trust you built you must hand back to them, as the next step of the journey is theirs.”<span>Aaron Donaghy, Build Foundation · Celebrating Courage</span></p>
        </div>
      </section>
    </>
  );
}
