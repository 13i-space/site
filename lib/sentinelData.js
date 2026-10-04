// Everything Sentinel-X shows, gathered server-side with the service-role
// key (lib/supabaseAdmin.js). Only import this from server code - the
// Sentinel-X page is a server component and never ships this to a browser.
//
// Every section is fetched independently and fails soft: one broken query
// shows "unavailable" in its own panel instead of taking the page down.

import { getSupabaseAdmin } from "./supabaseAdmin";

const DAY = 24 * 60 * 60 * 1000;

async function safe(fn, fallback = null) {
  try {
    return await fn();
  } catch (e) {
    return fallback;
  }
}

export async function gatherSentinelData() {
  const admin = getSupabaseAdmin();
  if (!admin) return { configured: false };
  const now = Date.now();
  const since = (days) => new Date(now - days * DAY).toISOString();

  const rows = async (path) => {
    const res = await admin.query(path);
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  };
  // exact row count without downloading the rows
  const count = async (table, filter = "") => {
    const res = await admin.query(`${table}?select=*${filter ? `&${filter}` : ""}`, {
      method: "HEAD",
      headers: { Prefer: "count=exact", Range: "0-0" },
    });
    const range = res.headers.get("content-range") || "";
    const n = parseInt(range.split("/")[1], 10);
    return Number.isFinite(n) ? n : null;
  };
  // count plus how many are from the last 7 days
  const countWithWeek = async (table) => {
    const [total, week] = await Promise.all([count(table), count(table, `created_at=gte.${since(7)}`)]);
    return { total, week };
  };

  // --- accounts (Supabase Auth admin API) ---
  const authUsers = await safe(async () => {
    const all = [];
    for (let page = 1; page <= 10; page++) {
      const res = await fetch(`${admin.url}/auth/v1/admin/users?page=${page}&per_page=500`, {
        headers: { apikey: admin.serviceKey, Authorization: `Bearer ${admin.serviceKey}` },
        cache: "no-store",
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      const users = data.users || [];
      all.push(...users);
      if (users.length < 500) break;
    }
    return all;
  });

  const profiles = await safe(() => rows("profiles?select=id,username"), []);
  const nameById = Object.fromEntries((profiles || []).map((p) => [p.id, p.username]));

  let accounts = null;
  if (authUsers) {
    const within = (iso, days) => iso && now - new Date(iso).getTime() < days * DAY;
    const byNewest = (key) => [...authUsers].filter((u) => u[key]).sort((a, b) => new Date(b[key]) - new Date(a[key]));
    const person = (u, key) => ({ name: nameById[u.id] || null, email: u.email, at: u[key] });

    // sign-ups per day, last 30 days (oldest first)
    const perDay = Array.from({ length: 30 }, (_, i) => {
      const start = new Date(now - (29 - i) * DAY);
      start.setUTCHours(0, 0, 0, 0);
      return { day: start.toISOString().slice(0, 10), n: 0 };
    });
    authUsers.forEach((u) => {
      const d = (u.created_at || "").slice(0, 10);
      const slot = perDay.find((p) => p.day === d);
      if (slot) slot.n += 1;
    });

    accounts = {
      total: authUsers.length,
      confirmed: authUsers.filter((u) => u.email_confirmed_at).length,
      withUsername: (profiles || []).filter((p) => p.username).length,
      new7: authUsers.filter((u) => within(u.created_at, 7)).length,
      new30: authUsers.filter((u) => within(u.created_at, 30)).length,
      active1: authUsers.filter((u) => within(u.last_sign_in_at, 1)).length,
      active7: authUsers.filter((u) => within(u.last_sign_in_at, 7)).length,
      active30: authUsers.filter((u) => within(u.last_sign_in_at, 30)).length,
      recentLogins: byNewest("last_sign_in_at").slice(0, 12).map((u) => person(u, "last_sign_in_at")),
      recentSignups: byNewest("created_at").slice(0, 8).map((u) => person(u, "created_at")),
      perDay,
    };
  }

  // --- content ---
  const [threads, replies, guestbook, species, drafts] = await Promise.all([
    safe(() => countWithWeek("forum_threads")),
    safe(() => countWithWeek("forum_replies")),
    safe(() => countWithWeek("guestbook")),
    safe(() => countWithWeek("alien_species")),
    safe(() => count("assignment_drafts")),
  ]);
  const submissions = await safe(async () => {
    const list = await rows("assignment_submissions?select=status");
    const by = {};
    list.forEach((r) => { by[r.status || "submitted"] = (by[r.status || "submitted"] || 0) + 1; });
    return { total: list.length, by };
  });

  // --- engagement ---
  const reading = await safe(async () => {
    const [list, titles] = await Promise.all([
      rows("reading_progress?select=assignment_number"),
      rows("assignment_submissions?select=assignment_number,designation&status=in.(canon,archived)"),
    ]);
    const titleBy = { 1: "The First Silence", ...Object.fromEntries(titles.map((t) => [t.assignment_number, t.designation])) };
    const by = {};
    list.forEach((r) => { by[r.assignment_number] = (by[r.assignment_number] || 0) + 1; });
    return {
      total: list.length,
      stories: Object.entries(by)
        .map(([n, readers]) => ({ n: Number(n), title: titleBy[n] || `Assignment ${n}`, readers }))
        .sort((a, b) => b.readers - a.readers),
    };
  });

  const games = await safe(async () => {
    const [plays, scores, today] = await Promise.all([
      rows("game_plays?select=game,play_count"),
      rows("high_scores?select=game,score,user_id&order=score.desc&limit=500"),
      rows(`daily_scores?select=game&period_start=eq.${new Date(now).toISOString().slice(0, 10)}`).catch(() => []),
    ]);
    const by = {};
    plays.forEach((p) => {
      const g = (by[p.game] = by[p.game] || { game: p.game, plays: 0, players: 0, top: null, todayPlayers: 0 });
      g.plays += p.play_count || 0;
      g.players += 1;
    });
    scores.forEach((s) => {
      const g = (by[s.game] = by[s.game] || { game: s.game, plays: 0, players: 0, top: null, todayPlayers: 0 });
      if (!g.top) g.top = { score: s.score, name: nameById[s.user_id] || "unknown" };
    });
    (today || []).forEach((d) => { if (by[d.game]) by[d.game].todayPlayers += 1; });
    return Object.values(by).sort((a, b) => b.plays - a.plays);
  });

  // --- latest activity, all kinds, newest first ---
  const feed = await safe(async () => {
    const [t, r, g, sp, sub] = await Promise.all([
      rows("forum_threads?select=title,author_id,created_at&order=created_at.desc&limit=6").catch(() => []),
      rows("forum_replies?select=author_id,created_at&order=created_at.desc&limit=6").catch(() => []),
      rows("guestbook?select=name,message,created_at&order=created_at.desc&limit=6").catch(() => []),
      rows("alien_species?select=name,user_id,created_at&order=created_at.desc&limit=6").catch(() => []),
      rows("assignment_submissions?select=designation,name,status,created_at&order=created_at.desc&limit=6").catch(() => []),
    ]);
    return [
      ...t.map((x) => ({ kind: "Forum thread", text: `"${x.title}" by ${nameById[x.author_id] || "a Kin"}`, at: x.created_at })),
      ...r.map((x) => ({ kind: "Forum reply", text: `by ${nameById[x.author_id] || "a Kin"}`, at: x.created_at })),
      ...g.map((x) => ({ kind: "Kinbook", text: `${x.name || "Someone"}: "${String(x.message || "").slice(0, 70)}"`, at: x.created_at })),
      ...sp.map((x) => ({ kind: "Alien Lab", text: `${x.name} by ${nameById[x.user_id] || "a Kin"}`, at: x.created_at })),
      ...sub.map((x) => ({ kind: "Assignment", text: `${x.designation || "Untitled"} (${x.status || "submitted"})${x.name ? ` by ${x.name}` : ""}`, at: x.created_at })),
    ]
      .filter((x) => x.at)
      .sort((a, b) => new Date(b.at) - new Date(a.at))
      .slice(0, 14);
  }, []);

  // --- connected services ---
  const subscribers = await safe(async () => {
    const key = process.env.BUTTONDOWN_API_KEY;
    if (!key) return null;
    const res = await fetch("https://api.buttondown.email/v1/subscribers?page_size=1", {
      headers: { Authorization: `Token ${key}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return typeof data.count === "number" ? data.count : null;
  });
  // --- Claude usage (Update 5.56, lib/apiUsage.js + docs/v5.56-api-usage.sql) ---
  const claude = await safe(async () => {
    const d = new Date(now);
    const monthStart = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1));
    const dow = (d.getUTCDay() + 6) % 7; // Monday = 0
    const weekStart = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - dow));
    const dayStart = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
    const creditSince = process.env.CLAUDE_CREDIT_SINCE ? new Date(`${process.env.CLAUDE_CREDIT_SINCE}T00:00:00Z`) : null;
    const from = new Date(Math.min(monthStart.getTime(), weekStart.getTime(), creditSince && !isNaN(creditSince) ? creditSince.getTime() : Infinity));
    const list = await rows(`api_usage?select=created_at,feature,model,cost_usd,input_tokens,output_tokens&created_at=gte.${encodeURIComponent(from.toISOString())}&order=created_at.desc&limit=50000`);
    const sum = (f) => list.filter(f).reduce((n, r) => n + Number(r.cost_usd || 0), 0);
    const at = (r) => new Date(r.created_at).getTime();
    const month = sum((r) => at(r) >= monthStart.getTime());
    const byFeature = {};
    list.filter((r) => at(r) >= monthStart.getTime()).forEach((r) => {
      const f = (byFeature[r.feature] = byFeature[r.feature] || { calls: 0, cost: 0 });
      f.calls += 1; f.cost += Number(r.cost_usd || 0);
    });
    const budget = Number(process.env.CLAUDE_MONTHLY_BUDGET_USD) || null;
    const credit = Number(process.env.CLAUDE_CREDIT_USD) || null;
    const sinceCredit = creditSince && !isNaN(creditSince) ? sum((r) => at(r) >= creditSince.getTime()) : null;
    return {
      today: sum((r) => at(r) >= dayStart.getTime()),
      week: sum((r) => at(r) >= weekStart.getTime()),
      weekCalls: list.filter((r) => at(r) >= weekStart.getTime()).length,
      month,
      monthCalls: list.filter((r) => at(r) >= monthStart.getTime()).length,
      byFeature: Object.entries(byFeature).sort((a, b) => b[1].cost - a[1].cost),
      budget,
      budgetLeft: budget !== null ? budget - month : null,
      credit,
      creditLeft: credit !== null && sinceCredit !== null ? credit - sinceCredit : null,
      creditSince: process.env.CLAUDE_CREDIT_SINCE || null,
      lastCall: list[0]?.created_at || null,
    };
  });

  // --- beta sign-ups from the countdown page (docs/v5.55-beta-and-kinbook.sql) ---
  const beta = await safe(async () => {
    const list = await rows("beta_requests?select=email,name,why,created_at&order=created_at.desc&limit=1000");
    const weekAgo = now - 7 * 86400000;
    return { total: list.length, week: list.filter((r) => new Date(r.created_at).getTime() >= weekAgo).length, list };
  });

  const services = [
    { name: "Supabase admin access", ok: true, note: "service role key set" },
    { name: "Claude (Oracle, Alien Lab)", ok: !!process.env.ANTHROPIC_API_KEY, note: process.env.ANTHROPIC_API_KEY ? "ANTHROPIC_API_KEY set" : "ANTHROPIC_API_KEY missing" },
    { name: "Buttondown (email list)", ok: !!process.env.BUTTONDOWN_API_KEY, note: process.env.BUTTONDOWN_API_KEY ? "BUTTONDOWN_API_KEY set" : "BUTTONDOWN_API_KEY missing" },
  ];

  return {
    configured: true,
    generatedAt: new Date(now).toISOString(),
    accounts,
    content: { threads, replies, guestbook, species, drafts, submissions },
    reading,
    games,
    feed,
    subscribers,
    services,
    claude,
    beta,
  };
}
