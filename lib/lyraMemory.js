"use client";

// Lyra's memory of one Kin, kept in this browser (per account, or "guest").
// It's what stops her repeating herself: when you were last here, which
// days you've visited, which parts of the site you've seen, what she said
// recently, which headline she already mentioned, what she's celebrated.
// Low stakes, so the browser is enough - it never needs to leave it.

const key = (uid) => `lyra_memory_${uid || "guest"}`;

const fresh = () => ({
  lastSeenAt: null, // the last time this Kin was on the site
  visitDays: [], // ISO dates of visits, newest last (for the bond)
  visited: [], // path prefixes seen
  recent: [], // ids of the lines she said lately, newest last
  launchLine: null, // { id, text, at } - the homepage line she's holding
  stage: null, // the bond stage she last knew
  celebrated: {}, // one-time celebrations already done
  headlines: [], // news links already mentioned
});

export function loadMemory(uid) {
  try {
    return { ...fresh(), ...(JSON.parse(localStorage.getItem(key(uid)) || "{}") || {}) };
  } catch (e) {
    return fresh();
  }
}

export function saveMemory(uid, memory) {
  try {
    const m = { ...memory, recent: memory.recent.slice(-40), visitDays: memory.visitDays.slice(-90), headlines: memory.headlines.slice(-20) };
    localStorage.setItem(key(uid), JSON.stringify(m));
  } catch (e) {
    // private browsing etc - she just forgets
  }
}

// The first page of a browser session, per account (not every navigation).
export function isNewSession(uid) {
  try {
    const k = `lyra_session_${uid || "guest"}`;
    if (sessionStorage.getItem(k)) return false;
    sessionStorage.setItem(k, "1");
    return true;
  } catch (e) {
    return false;
  }
}

export const today = () => new Date().toISOString().slice(0, 10);
