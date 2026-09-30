// SaveManager - everything persistent lives in one localStorage record.
// Every read/write is guarded: private browsing or blocked storage just
// means nothing is remembered, never a crash.

const KEY = "13i-deep-signal-v1";

const DEFAULTS = {
  settings: {
    volume: 0.7,
    muted: false,
    reducedEffects: false,
    highContrast: false,
  },
  discovered: {}, // lore id -> true
  totalRuns: 0,
  highestSignal: 0,
  bestScore: 0,
  endingsSeen: {}, // ending id -> true
};

function clone(o) {
  return JSON.parse(JSON.stringify(o));
}

export function createSave() {
  let data = clone(DEFAULTS);
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      data = { ...clone(DEFAULTS), ...parsed, settings: { ...DEFAULTS.settings, ...(parsed.settings || {}) } };
    }
  } catch (e) {
    // storage unavailable - run with defaults
  }

  const persist = () => {
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
    } catch (e) {
      // ignore
    }
  };

  return {
    get data() { return data; },
    settings: () => data.settings,
    setSetting(k, v) { data.settings[k] = v; persist(); },
    discover(id) {
      if (data.discovered[id]) return false;
      data.discovered[id] = true;
      persist();
      return true;
    },
    isDiscovered: (id) => !!data.discovered[id],
    recordRun({ signal, score, ending }) {
      data.totalRuns += 1;
      data.highestSignal = Math.max(data.highestSignal, Math.round(signal));
      data.bestScore = Math.max(data.bestScore, score);
      if (ending) data.endingsSeen[ending] = true;
      persist();
    },
    reset() {
      const settings = data.settings;
      data = clone(DEFAULTS);
      data.settings = settings; // keep volume etc. - "reset" means progress
      persist();
    },
  };
}
