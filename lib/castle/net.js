// Murder in the Donaghy Castle: how the laptops talk to each other.
//
// One "room" per game, named by a 4-letter code. Two lanes:
//   down: castle-CODE     everyone listens. The host sends the castle
//                         (snapshots); anyone can send room chatter and voice
//                         signalling.
//   up:   castle-CODE-up  only the host listens. Players send their position
//                         and key presses here, so their many small messages
//                         go to one laptop instead of everybody.
// The live site uses Supabase Realtime (no database tables needed). Adding
// ?local=1 to the address uses the browser's own BroadcastChannel instead,
// so several tabs on one computer can play together for testing.
import { createClient } from "../supabaseBrowser";

const LETTERS = "ABCDEFGHJKLMNPQRSTUVWXYZ"; // no I or O: they look like 1 and 0
export const newRoomCode = () => Array.from({ length: 4 }, () => LETTERS[Math.floor(Math.random() * LETTERS.length)]).join("");
export const cleanCode = (s) => String(s || "").toUpperCase().replace(/[^A-Z]/g, "").slice(0, 4);

// handlers: { onDown(event, payload), onUp(event, payload) (host only), onPeople(list) }
// me: { pid, name, look, host } - what this laptop shows in the waiting room
export function openRoom(code, { host, me, onDown, onUp, onPeople, onStatus, local }) {
  return local ? localRoom(code, { host, me, onDown, onUp, onPeople, onStatus }) : supabaseRoom(code, { host, me, onDown, onUp, onPeople, onStatus });
}

function supabaseRoom(code, { host, me, onDown, onUp, onPeople, onStatus }) {
  const sb = createClient();
  const down = sb.channel(`castle-${code}`, { config: { broadcast: { self: false, ack: false }, presence: { key: me.pid } } });
  const up = sb.channel(`castle-${code}-up`, { config: { broadcast: { self: false, ack: false } } });
  let closed = false, upJoined = false, upMode = host ? "ws" : "http";
  const joinedAt = Date.now();
  let meta = { ...me, at: joinedAt };

  down.on("broadcast", { event: "*" }, ({ event, payload }) => onDown(event, payload));
  down.on("presence", { event: "sync" }, () => {
    const state = down.presenceState();
    const list = [];
    for (const key of Object.keys(state)) {
      const m = state[key][0];
      if (m) list.push({ ...m, pid: key });
    }
    onPeople(list.sort((a, b) => a.at - b.at));
  });
  down.subscribe((status) => {
    onStatus?.(status);
    if (status === "SUBSCRIBED") down.track(meta);
  });
  const joinUp = () => {
    if (upJoined) return;
    upJoined = true;
    if (host) up.on("broadcast", { event: "*" }, ({ event, payload }) => onUp(event, payload));
    up.subscribe();
  };
  if (host) joinUp();

  return {
    kind: "supabase",
    // to everyone
    send(event, payload) { if (!closed) down.send({ type: "broadcast", event, payload }); },
    // to the host only
    sendUp(event, payload) {
      if (closed) return;
      if (upMode === "http") {
        // a quick web request: nobody but the host has to hear it
        up.httpSend(event, payload).catch(() => { upMode = "ws"; joinUp(); });
      } else up.send({ type: "broadcast", event, payload });
    },
    setMe(next) { meta = { ...meta, ...next }; if (!closed) down.track(meta); },
    close() { closed = true; try { down.untrack(); } catch { /* gone */ } sb.removeChannel(down); sb.removeChannel(up); },
  };
}

// Same thing for tabs on one computer. Presence is a heartbeat every second.
function localRoom(code, { host, me, onDown, onUp, onPeople }) {
  const down = new BroadcastChannel(`castle-${code}`);
  const up = new BroadcastChannel(`castle-${code}-up`);
  let meta = { ...me, at: Date.now() };
  const seen = new Map();
  const report = () => {
    const now = Date.now();
    const list = [meta, ...[...seen.values()].filter((p) => now - p.last < 3500 && p.pid !== meta.pid)];
    onPeople(list.map(({ last, ...p }) => p).sort((a, b) => a.at - b.at)); // eslint-disable-line no-unused-vars
  };
  down.onmessage = ({ data }) => {
    if (data.event === "__here") { seen.set(data.payload.pid, { ...data.payload, last: Date.now() }); return; }
    if (data.event === "__gone") { seen.delete(data.payload.pid); report(); return; }
    onDown(data.event, data.payload);
  };
  if (host) up.onmessage = ({ data }) => onUp(data.event, data.payload);
  const beat = () => down.postMessage({ event: "__here", payload: meta });
  beat();
  const iv = setInterval(() => { beat(); report(); }, 1000);
  setTimeout(report, 50);
  const bye = () => down.postMessage({ event: "__gone", payload: { pid: meta.pid } });
  window.addEventListener("beforeunload", bye);
  return {
    kind: "local",
    send(event, payload) { down.postMessage({ event, payload }); },
    sendUp(event, payload) { up.postMessage({ event, payload }); },
    setMe(next) { meta = { ...meta, ...next }; beat(); report(); },
    close() { clearInterval(iv); bye(); window.removeEventListener("beforeunload", bye); down.close(); up.close(); },
  };
}
