// SalienT online rooms (Update 6.34): the page side.
//
// The game runs in an iframe (public/games/salient). For online play its browsers need to find
// each other: this keeps a Supabase Realtime channel per room code (salient-ABCD) and passes
// messages between it and the game. Messages are small and few: who's in the room, the WebRTC
// handshake that then connects the players' browsers directly, and - only when a direct
// connection can't be made - the game's own traffic, relayed. No database tables are used.
//
// Game -> page: {source: "salient", type: "net", op: "hello" | "open" | "send" | "close", code, env}
// Page -> game: {source: "13i", type: "net", op: "ready" | "msg", code, env, name}
import { createClient } from "./supabaseBrowser";

export function salientRooms(frame) {
  let sb = null;
  const rooms = new Map(); // code -> channel
  const tell = (m) => {
    try { frame()?.contentWindow?.postMessage({ source: "13i", type: "net", ...m }, window.location.origin); } catch (e) {}
  };
  const client = () => sb || (sb = createClient());

  async function hello() {
    // the player's 13i name, so friends see who joined
    let name = null;
    try {
      const s = client();
      const { data: { user } } = await s.auth.getUser();
      if (user) {
        const { data } = await s.from("profiles").select("username").eq("id", user.id).maybeSingle();
        name = data?.username || null;
      }
    } catch (e) { name = null; }
    tell({ op: "ready", name });
  }

  function open(code) {
    if (rooms.has(code)) return;
    const ch = client().channel(`salient-${code}`, { config: { broadcast: { self: false, ack: false } } });
    ch.on("broadcast", { event: "env" }, ({ payload }) => tell({ op: "msg", code, env: payload }));
    ch.subscribe();
    rooms.set(code, ch);
  }

  function send(code, env) {
    const ch = rooms.get(code);
    if (ch) ch.send({ type: "broadcast", event: "env", payload: env });
  }

  function close(code) {
    const ch = rooms.get(code);
    if (!ch) return;
    rooms.delete(code);
    try { client().removeChannel(ch); } catch (e) {}
  }

  return {
    handle(msg) {
      if (msg.op === "hello") hello();
      else if (msg.op === "open") open(String(msg.code || "").slice(0, 4));
      else if (msg.op === "send") send(String(msg.code || "").slice(0, 4), msg.env);
      else if (msg.op === "close") close(String(msg.code || "").slice(0, 4));
    },
    closeAll() { for (const code of [...rooms.keys()]) close(code); },
  };
}
