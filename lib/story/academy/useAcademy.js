"use client";
// Academy progress: kept in this browser and, when signed in to a Story
// account, saved to story_progress (lesson "academy") so it follows you.
import { useCallback, useEffect, useRef, useState } from "react";
import { getStoryBrowserClient, storyConfigured } from "../storySupabase";
import { ACADEMY_ID, MODULES, LEVELS, QUIZZES } from "./curriculum";

const KEY = "sos-academy-v1";
const EMPTY = { modules: {}, quizzes: {}, mentor: {}, practice: [], level1: false, cert: null, waitlist: {} };

function readLocal() {
  try { return { ...EMPTY, ...(JSON.parse(localStorage.getItem(KEY) || "null") || {}) }; } catch { return { ...EMPTY }; }
}
function writeLocal(p) {
  try { localStorage.setItem(KEY, JSON.stringify(p)); } catch {}
}

// Union of two progress objects (nothing earned is ever lost).
function merge(a, b) {
  const out = { ...EMPTY, ...a, ...b };
  out.modules = { ...(a.modules || {}), ...(b.modules || {}) };
  out.mentor = { ...(a.mentor || {}), ...(b.mentor || {}) };
  out.waitlist = { ...(a.waitlist || {}), ...(b.waitlist || {}) };
  out.quizzes = { ...(a.quizzes || {}) };
  for (const [k, v] of Object.entries(b.quizzes || {})) out.quizzes[k] = Math.max(v || 0, out.quizzes[k] || 0);
  const seen = new Set();
  out.practice = [...(a.practice || []), ...(b.practice || [])].filter((s) => {
    const id = `${s.persona}-${s.at}`;
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });
  out.level1 = Boolean(a.level1 || b.level1);
  out.cert = b.cert || a.cert || null;
  return out;
}

export function quizPassed(p, id) {
  return (p.quizzes?.[id] || 0) >= (QUIZZES[id]?.pass || 80);
}
export function practiceCount(p) {
  return new Set((p.practice || []).map((s) => s.persona)).size;
}
export function requirementsMet(p, slug) {
  switch (slug) {
    case "welcome": return true;
    case "framework": return quizPassed(p, "framework") && Boolean(p.mentor?.framework);
    case "lessons": return quizPassed(p, "lessons");
    case "writing": return quizPassed(p, "writing");
    case "practice": return practiceCount(p) >= 2;
    case "safety": return quizPassed(p, "safety");
    case "assessment": return quizPassed(p, "assessment") && Boolean(p.mentor?.commitment);
    default: return false;
  }
}
export const isDone = (p, slug) => Boolean(p.modules?.[slug]);
export const foundationsDone = (p) => LEVELS[0].modules.every((s) => isDone(p, s));
export const allDone = (p) => MODULES.every((m) => isDone(p, m.slug));
export const isLocked = (p, slug) => {
  const m = MODULES.find((x) => x.slug === slug);
  return m?.level === "level1" && !p.level1;
};

export function useAcademy() {
  const [state, setState] = useState({ ready: false, signedIn: false, name: "", progress: { ...EMPTY } });
  const tokenRef = useRef(null);
  const userRef = useRef(null);
  const progressRef = useRef({ ...EMPTY });

  useEffect(() => {
    let alive = true;
    const local = readLocal();
    progressRef.current = local;
    (async () => {
      if (!storyConfigured) { if (alive) setState({ ready: true, signedIn: false, name: "", progress: local }); return; }
      const sb = getStoryBrowserClient();
      const { data: s } = await sb.auth.getSession();
      const session = s.session;
      if (!session) { if (alive) setState({ ready: true, signedIn: false, name: "", progress: local }); return; }
      tokenRef.current = session.access_token;
      userRef.current = session.user;
      let remote = {};
      try {
        const { data } = await sb.from("story_progress").select("captured").eq("lesson", ACADEMY_ID).maybeSingle();
        remote = data?.captured || {};
      } catch {}
      const merged = merge(local, remote);
      progressRef.current = merged;
      writeLocal(merged);
      if (alive) setState({ ready: true, signedIn: true, name: session.user.user_metadata?.first_name || "", progress: merged });
    })();
    const sb = storyConfigured ? getStoryBrowserClient() : null;
    const sub = sb?.auth.onAuthStateChange((_e, sess) => { tokenRef.current = sess?.access_token || null; });
    return () => { alive = false; sub?.data?.subscription?.unsubscribe(); };
  }, []);

  const save = useCallback(async (patchOrFn) => {
    const cur = progressRef.current;
    const next = typeof patchOrFn === "function" ? patchOrFn(cur) : merge(cur, patchOrFn);
    progressRef.current = next;
    writeLocal(next);
    setState((s) => ({ ...s, progress: next }));
    if (userRef.current && storyConfigured) {
      try {
        await getStoryBrowserClient().from("story_progress").upsert(
          { user_id: userRef.current.id, lesson: ACADEMY_ID, step: "academy", captured: next, updated_at: new Date().toISOString() },
          { onConflict: "user_id,lesson" }
        );
      } catch {}
    }
    return next;
  }, []);

  const ai = useCallback(async (body) => {
    const res = await fetch("/api/story/academy", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${tokenRef.current}` },
      body: JSON.stringify({ name: state.name, ...body }),
    });
    let data = {};
    try { data = await res.json(); } catch {}
    return { ok: res.ok, status: res.status, data };
  }, [state.name]);

  return { ...state, save, ai };
}
