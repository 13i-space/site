import { notFound } from "next/navigation";
import { createClient } from "../../../lib/supabaseServer";
import { getSupabaseAdmin } from "../../../lib/supabaseAdmin";
import { isSentinelUser } from "../../../lib/sentinel";
import { isBriefUser } from "../../../lib/story/briefAccess";
import {
  NOTE, IDEA, EPC, TEST_PATH, TRANSCRIPT, METHOD_MAP, ADAPTATIONS, SWOT,
  TIERS, PLAN, ROADMAP, NEEDS, GUIDANCE, STATUSES,
} from "../../../lib/story/briefContent";
import Guidance from "./Guidance";
import "./brief.css";

// Aaron's briefing: the case for Story of Self online, with the prototype
// one click away. Opens only for the 13i usernames in lib/story/briefAccess.js
// (Paul's Sentinel accounts + Aaron). Everyone else gets an ordinary 404.
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const metadata = { title: "For Aaron", robots: { index: false, follow: false } };

async function getViewer() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return null;
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    const { data: profile } = await supabase.from("profiles").select("username").eq("id", user.id).maybeSingle();
    if (!isBriefUser(profile?.username)) return null;
    const answers = {};
    try {
      const { data } = await supabase.from("story_brief_answers").select("item_key, status, answer, updated_at").eq("user_id", user.id);
      (data || []).forEach((r) => { answers[r.item_key] = r; });
    } catch {
      // table not created yet: the questions still show, saving explains itself
    }
    return { username: profile.username, answers };
  } catch {
    return null;
  }
}

// Paul's view: every answer from everyone with access, newest first.
async function getAllResponses() {
  const admin = getSupabaseAdmin();
  if (!admin) return null;
  try {
    const res = await admin.query("story_brief_answers?select=username,item_key,status,answer,updated_at&order=updated_at.desc", { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

const NAV = [
  ["idea", "The idea"],
  ["try", "Try it"],
  ["method", "Your method"],
  ["swot", "Strengths"],
  ["business", "The business"],
  ["guidance", "Your guidance"],
  ["road", "The road ahead"],
  ["needs", "From you"],
];

function Head({ n, eyebrow, title, children }) {
  return (
    <div className="brief-head">
      <div className="sos-eyebrow"><span className="brief-n">{n}</span>{eyebrow}</div>
      <h2>{title}</h2>
      {children && <p className="sos-lede">{children}</p>}
    </div>
  );
}

const QUESTION = Object.fromEntries(GUIDANCE.flatMap((g) => g.items.map((i) => [i.key, `${g.title}: ${i.q}`])));

export default async function AaronBrief() {
  const viewer = await getViewer();
  if (!viewer) notFound();
  const isPaul = isSentinelUser(viewer.username);
  const responses = isPaul ? await getAllResponses() : null;

  return (
    <div className="brief">
      {/* 1 · A note from Paul */}
      <section className="sos-hero brief-hero">
        <div className="sos-narrow">
          <div className="sos-eyebrow">Story of Self · online</div>
          <h1>Your story method, <em>running</em>.</h1>
          <div className="brief-note">
            <p className="brief-greet">{NOTE.greeting}</p>
            {NOTE.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
            <p className="brief-sign">{NOTE.signoff}</p>
          </div>
          <div className="sos-hero-actions">
            <a className="sos-btn" href="#try">Try the prototype</a>
            <a className="sos-btn ghost" href="#idea">Read the idea first</a>
          </div>
        </div>
      </section>

      <nav className="brief-nav" aria-label="On this page">
        <div className="brief-nav-in">
          {NAV.map(([id, label]) => <a key={id} href={`#${id}`}>{label}</a>)}
          {isPaul && <a href="#responses" className="paul">Responses</a>}
        </div>
      </nav>

      {/* 2 · The idea in 60 seconds */}
      <section className="sos-section" id="idea">
        <div className="sos-wrap">
          <Head n="1" eyebrow="The idea in 60 seconds" title={<>Story of Self, for the year after high school.</>} />
          <dl className="brief-idea">
            {IDEA.map((x) => (
              <div key={x.k}>
                <dt>{x.k}</dt>
                <dd>{x.v}</dd>
              </div>
            ))}
          </dl>

          <div className="brief-epc">
            <h3>Built on your Explore · Play · Create</h3>
            <p className="brief-epc-lede">
              If you've wandered around 13i.space, you've already seen your model at work: the whole site is organized around it. Story of Self
              online follows it too.
            </p>
            <div className="brief-epc-grid">
              {EPC.map((e) => (
                <div className="brief-epc-card" key={e.mode}>
                  <div className="brief-epc-mode">{e.mode}</div>
                  <blockquote>{e.aaron}</blockquote>
                  <p>{e.site}</p>
                  <p className="story">{e.story}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3 · Try it */}
      <section className="sos-section alt" id="try">
        <div className="sos-wrap">
          <Head n="2" eyebrow="Try it" title="Walk in the student's shoes.">
            All seven units and 22 lessons are built. Here's a good way to test it.
          </Head>
          <div className="brief-try">
            <ol className="brief-path">
              {TEST_PATH.map((s, i) => (
                <li key={s.t}>
                  <span className="brief-path-n">{i + 1}</span>
                  <div>
                    <b>{s.t}</b>
                    <p>{s.d}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div>
              <div className="sos-chat brief-sample" aria-label="Sample conversation">
                <div className="sos-chat-head">
                  <div className="sos-avatar" aria-hidden="true">C</div>
                  <div>
                    <b>Story Champion</b>
                    <small>Sample from Lesson 1 · every real session is different</small>
                  </div>
                </div>
                <div className="sos-log">
                  {TRANSCRIPT.map((m, i) => (
                    <div key={i} className={`sos-bubble ${m.who === "you" ? "you" : "champion"}`}>{m.text}</div>
                  ))}
                </div>
              </div>
              <div className="brief-try-go">
                <a className="sos-btn" href="/story" target="_blank" rel="noopener">Open the prototype</a>
                <span>Opens in a new tab, so this page stays here.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 · Your method → the Champion */}
      <section className="sos-section" id="method">
        <div className="sos-wrap">
          <Head n="3" eyebrow="Your method, kept" title="Your Champion notes, line by line.">
            The AI follows your method. It doesn't replace it. Here's what each part of your training became.
          </Head>
          <div className="brief-map" role="table" aria-label="Your method and how the Champion does it">
            <div className="brief-map-row head" role="row">
              <div role="columnheader">From your notes</div>
              <div role="columnheader">What the Champion does</div>
            </div>
            {METHOD_MAP.map((r) => (
              <div className="brief-map-row" role="row" key={r.aaron}>
                <div role="cell" className="aaron">{r.aaron}</div>
                <div role="cell">{r.bot}</div>
              </div>
            ))}
          </div>

          <div className="brief-adapt">
            <h3>What I adapted for 18-year-olds, and why</h3>
            <ul>
              {ADAPTATIONS.map((a) => <li key={a}>{a}</li>)}
            </ul>
          </div>
        </div>
      </section>

      {/* 5 · Strengths & watch-outs */}
      <section className="sos-section alt" id="swot">
        <div className="sos-wrap">
          <Head n="4" eyebrow="An honest look" title="What's already strong, and what needs you.">
            I read every page of your guide and both toolkits. This is my honest read: where the method is ready, and where it needs your judgment.
          </Head>
          <div className="brief-swot">
            {[
              ["strengths", "What's already strong", "s"],
              ["watch", "Where it needs your eye", "w"],
              ["opportunities", "Where it could grow", "o"],
              ["risks", "What we have to get right", "r"],
            ].map(([key, title, cls]) => (
              <div className={`brief-swot-box ${cls}`} key={key}>
                <h3>{title}</h3>
                <ul>
                  {SWOT[key].map(([t, d]) => (
                    <li key={t}><b>{t}.</b> {d}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6 · The business */}
      <section className="sos-section" id="business">
        <div className="sos-wrap">
          <Head n="5" eyebrow="The business at a glance" title="Families, not facilities.">
            Parents buy, teens use. It's sold once, like a course or a gift, because it's a journey with an end.
          </Head>
          <div className="brief-tiers">
            {TIERS.map((t) => (
              <div className="brief-tier" key={t.name}>
                <div className="brief-tier-name">{t.name}</div>
                <div className="brief-tier-price">{t.price}{t.note && <small>{t.note}</small>}</div>
                <p>{t.what}</p>
              </div>
            ))}
          </div>
          <div className="brief-facts">
            <div><b>Who pays</b><span>Parents and grandparents</span></div>
            <div><b>When they buy</b><span>Graduation (Apr–Jun) and pre-college (Aug)</span></div>
            <div><b>AI cost per journey</b><span>About $5–20, measured in alpha</span></div>
            <div><b>Next channel</b><span>Schools, colleges, gap-year programs, churches</span></div>
          </div>

          <details className="brief-plan">
            <summary>Read the full business plan</summary>
            <div className="brief-plan-body">
              {PLAN.map((s, i) => (
                <div key={s.t} className="brief-plan-sec">
                  <h3><span>{i + 1}</span>{s.t}</h3>
                  {s.p.map((p, j) => <p key={j}>{p}</p>)}
                </div>
              ))}
              <p className="brief-small">Prices and costs are starting estimates to test in alpha and beta, not forecasts.</p>
            </div>
          </details>
        </div>
      </section>

      {/* 7 · Guidance needed */}
      <section className="sos-section alt" id="guidance">
        <div className="sos-narrow brief-wide">
          <Head n="6" eyebrow="Guidance needed" title="The questions only you can answer.">
            Tap a quick answer, write a few words, or both. Your answers go straight to me, and they decide how the next version behaves.
          </Head>
          <Guidance groups={GUIDANCE} initial={viewer.answers} />
        </div>
      </section>

      {/* 8 · The road ahead */}
      <section className="sos-section" id="road">
        <div className="sos-wrap">
          <Head n="7" eyebrow="What a yes looks like" title="From here to graduation season." />
          <ol className="brief-road">
            {ROADMAP.map((r) => (
              <li key={r.q}>
                <div className="brief-road-q">{r.q}</div>
                <h3>{r.title}</h3>
                <ul>
                  {r.items.map((it) => <li key={it}>{it}</li>)}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 9 · What we'd need from you */}
      <section className="sos-section alt" id="needs">
        <div className="sos-narrow">
          <Head n="8" eyebrow="What we'd need from you" title="Your time, your eye, your call." />
          <ul className="brief-needs">
            {NEEDS.map(([t, d]) => (
              <li key={t}><b>{t}</b><span>{d}</span></li>
            ))}
          </ul>
          <div className="brief-end">
            <p className="sos-quote" style={{ fontSize: "clamp(24px, 3.4vw, 32px)" }}>
              Your story is not yours until you <em>give it away</em>.
            </p>
            <div className="sos-hero-actions" style={{ justifyContent: "center" }}>
              <a className="sos-btn" href="/story" target="_blank" rel="noopener">Open the prototype</a>
              <a className="sos-btn ghost" href="#guidance">Answer the questions</a>
            </div>
          </div>
        </div>
      </section>

      {/* Paul only: everyone's answers */}
      {isPaul && (
        <section className="sos-section brief-responses" id="responses">
          <div className="sos-narrow brief-wide">
            <div className="sos-eyebrow">Only you see this, Paul</div>
            <h2>Responses</h2>
            {responses === null ? (
              <p className="brief-small">Responses can't be read yet. Check that docs/v5.23-story-brief.sql has been run and that SUPABASE_SERVICE_ROLE_KEY is set in Vercel.</p>
            ) : responses.length === 0 ? (
              <p className="brief-small">No answers yet.</p>
            ) : (
              <div className="brief-resp">
                {responses.map((r) => (
                  <div key={`${r.username}-${r.item_key}`} className="brief-resp-row">
                    <div className="brief-resp-meta">
                      <b>{r.username || "unknown"}</b> · {QUESTION[r.item_key] || r.item_key} ·{" "}
                      {new Date(r.updated_at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit", timeZone: "America/Chicago" })}
                    </div>
                    {r.status && <span className={`brief-pill ${r.status}`}>{STATUSES[r.status]}</span>}
                    {r.answer && <p>{r.answer}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
