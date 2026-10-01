// Everything the Lighthouse dashboard shows, gathered on the server with the
// Story service-role key. SERVER ONLY. It reports progress and counts, never
// what students wrote (the Safety desk is the one exception, by design).
// Every section fails soft, so one missing table never takes the page down.
import { getStoryAdmin } from "./storyAdmin";
import { LESSONS, LESSON_ORDER, UNITS } from "./lessonSteps";
import { TIMELINE_ID } from "./timeline";
import { STORY_WRITE_ID } from "./storyWrite";
import { roleShort } from "./waitlist";

const DAY = 24 * 60 * 60 * 1000;
const safe = async (fn, fallback = null) => { try { return await fn(); } catch { return fallback; } };
const isDone = (r) => Boolean(r && (r.completed_at || r.step === "close" || r.step === "complete"));

function days(n, now) {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(now - (n - 1 - i) * DAY);
    d.setUTCHours(0, 0, 0, 0);
    return { day: d.toISOString().slice(0, 10), n: 0 };
  });
}
function tally(slots, isos) {
  const at = Object.fromEntries(slots.map((s, i) => [s.day, i]));
  for (const iso of isos) { const i = at[String(iso || "").slice(0, 10)]; if (i !== undefined) slots[i].n += 1; }
  return slots;
}

export async function gatherTeamData() {
  const admin = getStoryAdmin();
  if (!admin) return { configured: false };
  const now = Date.now();
  const since = (d) => new Date(now - d * DAY).toISOString();
  const within = (iso, d) => iso && now - new Date(iso).getTime() < d * DAY;
  const all = async (q) => { const { data, error } = await q; if (error) throw error; return data || []; };
  const count = async (table, f = (q) => q) => { const { count: n, error } = await f(admin.from(table).select("*", { count: "exact", head: true })); if (error) throw error; return n ?? 0; };

  const users = await safe(async () => {
    const out = [];
    for (let page = 1; page <= 20; page++) {
      const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 1000 });
      if (error) throw error;
      out.push(...data.users);
      if (data.users.length < 1000) break;
    }
    return out;
  });
  const [profiles, progress, waitlist, alerts, contact] = await Promise.all([
    safe(() => all(admin.from("story_profiles").select("id, first_name")), []),
    safe(() => all(admin.from("story_progress").select("user_id, lesson, step, completed_at, updated_at").range(0, 19999))),
    safe(() => all(admin.from("story_waitlist").select("email, first_name, role, grad_year, ref_code, referred_by, source, created_at").order("created_at", { ascending: false }).range(0, 19999))),
    safe(() => all(admin.from("story_safety_alerts").select("id, first_name, lesson_title, status, created_at").order("created_at", { ascending: false }).limit(300))),
    safe(() => all(admin.from("story_contact").select("name, email, topic, message, created_at").order("created_at", { ascending: false }).limit(8))),
  ]);
  const academyRows = await safe(() => all(admin.from("story_progress").select("user_id, cert:captured->cert, level1:captured->level1, waitlist:captured->waitlist, updated_at").eq("lesson", "academy")), []);
  const [msgTotal, msgWeek, msgRecent, academyMsgs] = await Promise.all([
    safe(() => count("story_messages", (q) => q.eq("role", "user"))),
    safe(() => count("story_messages", (q) => q.eq("role", "user").gte("created_at", since(7)))),
    safe(() => all(admin.from("story_messages").select("created_at, lesson").eq("role", "user").gte("created_at", since(14)).range(0, 49999)), []),
    safe(() => count("story_messages", (q) => q.like("lesson", "academy%").gte("created_at", since(30)))),
  ]);

  const nameOf = Object.fromEntries((profiles || []).map((p) => [p.id, p.first_name]));
  const rowsBy = {};
  for (const r of progress || []) (rowsBy[r.user_id] = rowsBy[r.user_id] || []).push(r);

  // --- students ---
  let students = null;
  if (users) {
    const founder = (u) => Boolean(u.app_metadata?.story_founder);
    const list = users.map((u) => {
      const rows = rowsBy[u.id] || [];
      const lessonRows = rows.filter((r) => LESSONS[r.lesson]);
      const done = lessonRows.filter(isDone).length;
      const furthest = lessonRows.map((r) => LESSON_ORDER.indexOf(r.lesson)).sort((a, b) => b - a)[0];
      const cur = furthest === undefined ? null : LESSONS[LESSON_ORDER[furthest]];
      const lastActive = [u.last_sign_in_at, ...rows.map((r) => r.updated_at)].filter(Boolean).sort().pop() || u.created_at;
      return {
        name: nameOf[u.id] || u.user_metadata?.first_name || "",
        email: u.email,
        joined: u.created_at,
        lastActive,
        done,
        current: cur ? `Lesson ${cur.number}: ${cur.title}` : "Not started",
        writing: rows.some((r) => r.lesson === STORY_WRITE_ID),
        timeline: rows.some((r) => r.lesson === TIMELINE_ID),
        founder: founder(u),
      };
    }).sort((a, b) => new Date(b.lastActive) - new Date(a.lastActive));
    const real = list.filter((s) => !s.founder);
    students = {
      total: real.length,
      founders: list.length - real.length,
      new7: real.filter((s) => within(s.joined, 7)).length,
      new30: real.filter((s) => within(s.joined, 30)).length,
      active1: real.filter((s) => within(s.lastActive, 1)).length,
      active7: real.filter((s) => within(s.lastActive, 7)).length,
      active30: real.filter((s) => within(s.lastActive, 30)).length,
      perDay: tally(days(30, now), real.map((s) => s.joined)),
      list: list.slice(0, 60),
    };
  }

  // --- the journey: how far people get ---
  let journey = null;
  if (progress) {
    const founders = new Set((users || []).filter((u) => u.app_metadata?.story_founder).map((u) => u.id));
    const real = progress.filter((r) => !founders.has(r.user_id));
    const lessons = LESSON_ORDER.map((id) => {
      const rs = real.filter((r) => r.lesson === id);
      const l = LESSONS[id];
      return { id, number: l.number, title: l.title, started: rs.length, done: rs.filter(isDone).length };
    });
    journey = {
      units: UNITS.map((u) => ({ n: u.n, name: u.name, lessons: lessons.filter((l) => u.lessons.includes(l.id)) })),
      lessonsDone: lessons.reduce((n, l) => n + l.done, 0),
      writing: real.filter((r) => r.lesson === STORY_WRITE_ID).length,
      timelines: real.filter((r) => r.lesson === TIMELINE_ID).length,
      finished: real.filter((r) => r.lesson === LESSON_ORDER[LESSON_ORDER.length - 1] && isDone(r)).length,
    };
  }

  // --- the launch list ---
  let list = null;
  if (waitlist) {
    const byRole = {}, byYear = {}, bySource = {}, refs = {};
    for (const w of waitlist) {
      byRole[w.role] = (byRole[w.role] || 0) + 1;
      if (w.grad_year) byYear[w.grad_year] = (byYear[w.grad_year] || 0) + 1;
      bySource[w.source || "site"] = (bySource[w.source || "site"] || 0) + 1;
      if (w.referred_by) refs[w.referred_by] = (refs[w.referred_by] || 0) + 1;
    }
    const byCode = Object.fromEntries(waitlist.map((w) => [w.ref_code, w]));
    list = {
      total: waitlist.length,
      week: waitlist.filter((w) => within(w.created_at, 7)).length,
      perDay: tally(days(30, now), waitlist.map((w) => w.created_at)),
      byRole: Object.entries(byRole).map(([k, n]) => ({ k, label: roleShort(k), n })).sort((a, b) => b.n - a.n),
      byYear: Object.entries(byYear).map(([k, n]) => ({ k, n })).sort((a, b) => a.k - b.k),
      bySource: Object.entries(bySource).map(([k, n]) => ({ k, n })).sort((a, b) => b.n - a.n),
      sharers: Object.entries(refs).map(([code, n]) => ({ who: byCode[code]?.first_name || byCode[code]?.email || code, n })).sort((a, b) => b.n - a.n).slice(0, 6),
      latest: waitlist.slice(0, 12).map((w) => ({ name: w.first_name || "", email: w.email, role: roleShort(w.role), year: w.grad_year, at: w.created_at })),
    };
  }

  // --- the Champion, and the Academy ---
  const conversations = {
    total: msgTotal,
    week: msgWeek,
    perDay: tally(days(14, now), (msgRecent || []).filter((m) => !String(m.lesson).startsWith("academy")).map((m) => m.created_at)),
  };
  const academy = academyRows ? {
    trainees: academyRows.length,
    level1: academyRows.filter((r) => r.level1).length,
    certs: academyRows.filter((r) => r.cert).length,
    pool: academyRows.filter((r) => r.waitlist?.pool).length,
    full: academyRows.filter((r) => r.waitlist?.full).length,
    aiMonth: academyMsgs,
  } : null;

  // --- safety ---
  const safety = alerts ? {
    open: alerts.filter((a) => a.status === "new").length,
    contacted: alerts.filter((a) => a.status === "contacted").length,
    resolved: alerts.filter((a) => a.status === "resolved").length,
  } : null;

  // --- latest activity ---
  const feed = [
    ...(students?.list || []).filter((s) => !s.founder).slice(0, 10).map((s) => ({ kind: "New student", text: `${s.name || "Someone"} created an account`, at: s.joined })),
    ...(progress || []).filter((r) => LESSONS[r.lesson] && r.completed_at).sort((a, b) => new Date(b.completed_at) - new Date(a.completed_at)).slice(0, 12)
      .map((r) => ({ kind: "Lesson finished", text: `${nameOf[r.user_id] || "A student"} finished Lesson ${LESSONS[r.lesson].number}, ${LESSONS[r.lesson].title}`, at: r.completed_at })),
    ...(waitlist || []).slice(0, 10).map((w) => ({ kind: "Launch list", text: `${w.first_name || "Someone"} joined (${roleShort(w.role).toLowerCase()})`, at: w.created_at })),
    ...(contact || []).slice(0, 5).map((c) => ({ kind: "Message", text: `${c.name}${c.topic ? ` · ${c.topic}` : ""}`, at: c.created_at })),
    ...(alerts || []).slice(0, 5).map((a) => ({ kind: "Safety", text: `Alert in ${a.lesson_title || "a lesson"} (${a.status})`, at: a.created_at, alert: a.status === "new" })),
    ...(academyRows || []).filter((r) => r.cert?.at).map((r) => ({ kind: "Certificate", text: `${r.cert.name || "A trainee"} earned the Champion certificate`, at: r.cert.at })),
  ].filter((f) => f.at).sort((a, b) => new Date(b.at) - new Date(a.at)).slice(0, 18);

  const env = (k) => Boolean(process.env[k]);
  const services = [
    { name: "Story database (admin key)", ok: true, note: "STORY_SUPABASE_SERVICE_ROLE_KEY set" },
    { name: "AI Champion (Anthropic)", ok: env("STORY_ANTHROPIC_API_KEY") || env("ANTHROPIC_API_KEY"), note: env("STORY_ANTHROPIC_API_KEY") ? "STORY_ANTHROPIC_API_KEY set" : env("ANTHROPIC_API_KEY") ? "using ANTHROPIC_API_KEY" : "no Anthropic key" },
    { name: "Champion model", ok: true, note: process.env.STORY_MODEL || "claude-opus-5-5 (default)" },
    { name: "Safety alert webhook", ok: env("STORY_SAFETY_WEBHOOK_URL"), note: env("STORY_SAFETY_WEBHOOK_URL") ? "STORY_SAFETY_WEBHOOK_URL set" : "optional, not set" },
    { name: "Public contact email", ok: env("NEXT_PUBLIC_STORY_CONTACT_EMAIL"), note: env("NEXT_PUBLIC_STORY_CONTACT_EMAIL") ? "shown on the contact page" : "optional, not set" },
    { name: "Launch list table", ok: Boolean(waitlist), note: waitlist ? "story_waitlist ready" : "run supabase/v5.32-story-waitlist.sql" },
  ];

  return { configured: true, generatedAt: new Date(now).toISOString(), students, journey, list, conversations, academy, safety, contact, feed, services };
}

// The launch list as CSV, for exporting to an email tool.
export async function waitlistCsv() {
  const admin = getStoryAdmin();
  if (!admin) return null;
  const { data, error } = await admin.from("story_waitlist").select("email, first_name, role, grad_year, source, referred_by, ref_code, created_at").order("created_at").range(0, 49999);
  if (error) return null;
  const esc = (v) => { const s = v === null || v === undefined ? "" : String(v); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
  const head = ["email", "first_name", "role", "grad_year", "source", "referred_by", "ref_code", "joined"];
  return [head.join(","), ...data.map((r) => [r.email, r.first_name, r.role, r.grad_year, r.source, r.referred_by, r.ref_code, r.created_at].map(esc).join(","))].join("\n");
}
