// Where the deep-space missions are (Update 6.26), from NASA JPL's Horizons
// system: public, no key, no account. Fetched on the server and cached for
// DEEP_REFRESH_SECONDS, so the whole site asks Horizons about a dozen
// questions every six hours, however many people are watching.
//
// Each mission is asked for its position over the past year (monthly steps,
// for the trail on the map) up to today. A reply only counts if the name
// Horizons reports matches the mission (lib/solarSystem.js `match`). Anything
// that fails just leaves that mission's live position out; the console then
// uses its rough position (marked approximate) or says it has none.

import { MISSIONS } from "./solarSystem";

export const DEEP_REFRESH_SECONDS = 6 * 3600;
const API = "https://ssd.jpl.nasa.gov/api/horizons.api";

const ymd = (ms) => new Date(ms).toISOString().slice(0, 10);

function parseVectors(text) {
  const soe = text.indexOf("$$SOE"), eoe = text.indexOf("$$EOE");
  if (soe < 0 || eoe < 0) return [];
  return text.slice(soe + 5, eoe).split("\n").map((line) => {
    // CSV rows: JDTDB, Calendar Date (TDB), X, Y, Z,
    const f = line.split(",").map((s) => s.trim());
    if (f.length < 5) return null;
    const xyz = [f[2], f[3], f[4]].map(Number);
    return xyz.every((v) => Number.isFinite(v)) ? { date: f[1].replace(/^A\.D\.\s*/, "").replace(/\s+\d\d:\d\d.*$/, ""), xyz } : null;
  }).filter(Boolean);
}

async function fetchMission(m, now) {
  const q = {
    format: "json",
    COMMAND: `'${m.horizons}'`,
    OBJ_DATA: "'NO'",
    MAKE_EPHEM: "'YES'",
    EPHEM_TYPE: "'VECTORS'",
    CENTER: "'500@10'",
    START_TIME: `'${ymd(now - 360 * 86400000)}'`, // 12 steps of 30 days land on today
    STOP_TIME: `'${ymd(now)}'`,
    STEP_SIZE: "'30 d'",
    VEC_TABLE: "'1'",
    OUT_UNITS: "'AU-D'",
    REF_PLANE: "'ECLIPTIC'",
    CSV_FORMAT: "'YES'",
  };
  // spaces as %20 (not +), as the Horizons API asks
  const params = Object.entries(q).map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join("&");
  try {
    // a slow Horizons never holds the page up for long (a race rather than an
    // abort signal, which would stop Next caching the reply)
    const res = await Promise.race([
      fetch(`${API}?${params}`, { next: { revalidate: DEEP_REFRESH_SECONDS } }),
      new Promise((resolve) => setTimeout(() => resolve(null), 6000)),
    ]);
    if (!res) return null;
    if (!res.ok) return null;
    const data = await res.json();
    if (data.error || typeof data.result !== "string") return null;
    const name = (data.result.match(/Target body name:\s*([^\n{]+)/i) || [])[1] || "";
    if (!m.match.test(name)) return null; // not the spacecraft we asked for
    const rows = parseVectors(data.result);
    if (!rows.length) return null;
    const last = rows[rows.length - 1];
    return { xyz: last.xyz, date: last.date, trail: rows.map((r) => r.xyz), source: name.trim() };
  } catch (e) {
    return null;
  }
}

// { [missionId]: { xyz, date, trail, source } } for every mission Horizons answered for
export async function getDeepSpace() {
  const now = Date.now();
  // the day, not the moment, so the cached replies are shared all day
  const day = Date.parse(ymd(now));
  const asked = MISSIONS.filter((m) => m.horizons);
  const out = {};
  // all at once (about a dozen small requests, a few times a day), so the
  // page never waits longer than one slow reply
  const got = await Promise.all(asked.map((m) => fetchMission(m, day)));
  asked.forEach((m, k) => { if (got[k]) out[m.id] = got[k]; });
  return out;
}
