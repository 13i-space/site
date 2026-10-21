"use client";
// The castle owl: a help button that knows what's going on. It watches the
// night and offers the tip that matters right now (your next chore, how to
// capture, what to do when the lights go out), and opens to the full rules.
import { useEffect, useRef, useState } from "react";
import { ROLES } from "../../lib/castle/engine";

function tipsFor(hud) {
  const me = hud.me, r = me.role, tips = [];
  if (!me.alive) {
    tips.push({ key: "ghost", text: "You're a ghost now. You can float straight through walls, and your chores still count toward the castle's bar. You can't vote, but you can watch." });
  }
  if (hud.ctx.claymore === "take") tips.push({ key: "claymore", hot: true, text: "The Donaghy Claymore! Press E to take it up. It strikes once, at anyone, and if it's the Black Knight the castle wins on the spot. Strike an innocent and you've helped the darkness..." });
  if (hud.claymore) tips.push({ key: "claymore-held", text: "You carry the Donaghy Claymore. Walk right up to someone and press G to strike. One blow only. Nobody else knows you have it (unless you tell them)." });
  if (me.alive && hud.missing?.some((m) => !m.found)) tips.push({ key: "missing", hot: true, text: "Someone has gone missing and nobody knows where. Do your chores: each one turns up a clue card for its room (a struggle there or not) and a weapon. A chore in the right room finds the helmet. Press C for your Detective's Notebook." });
  if (hud.ctx.marker && me.alive) tips.push({ key: "helmet", hot: true, text: "That's a dropped helmet: someone was captured here. Press R to report it and call everyone to the Great Hall." });
  if (hud.ctx.power?.hot) tips.push({ key: "power-" + hud.ctx.power.key, hot: true, text: `Press ${hud.ctx.power.key}: ${hud.ctx.power.label}.` });
  if (hud.lightsOut && ROLES[r].side === "castle" && me.alive) tips.push({ key: "lights", hot: true, text: "The Black Knight has put the lights out! Follow the red arrow to the Forge and hold E at the fire to relight every torch." });
  if (hud.gate && ROLES[r].side === "castle" && me.alive) tips.push({ key: "gate", hot: true, text: "The portcullis is jammed. Free it at the winch in the Gatehouse (hold E)." });
  if (r === "blackknight" && me.alive) {
    if (me.cd.capture <= 0) tips.push({ key: "bk-ready", hot: true, text: "Your capture is ready. Find someone on their own, walk until you're nearly touching, and press Q. Then slip away (a secret passage helps) before anyone finds the helmet." });
    else tips.push({ key: "bk-wait", text: `Capture recharges in ${Math.ceil(me.cd.capture)}s. Meanwhile stand at a 'pretend chore' to look busy. Press 1 for Lights Out (everyone's torch shrinks), 2 to jam the portcullis, 3 to disguise yourself as someone else, 4 for a smoke bomb nobody can see through. Your schemes are listed bottom-left. Careful: Sheba growls at the Black Knight.` });
  }
  if (r === "jester" && me.alive) tips.push({ key: "jester", text: `You'll pop out somewhere random in ${Math.ceil(me.cd.hop)}s. Q swaps places with the nearest person, once a round. 1 fakes a scream in another room so people run the wrong way. 2 drops marbles that send people sprawling. Help the Black Knight: muddle the meetings and point at the innocent.` });
  if (r === "knight" && me.alive) tips.push({ key: "knight", text: me.cd.truth > 0 ? `Torch of Truth recharging (${Math.ceil(me.cd.truth)}s). When it's ready, face someone close and press F to see who they really are.` : "Your Torch of Truth is ready: face someone close and press F. It sees through the Black Knight's disguise." });
  if (r === "locksmith" && me.alive && hud.prisoners && !hud.freeUsed) tips.push({ key: "lock", hot: true, text: "Someone's locked in the dungeon cell. Go to the cell door in the Dungeon and hold E to free them (once a night)." });
  if (hud.job && me.alive) tips.push({ key: "job", text: `Your nearest job: ${hud.job.label} in the ${hud.job.room}. Follow the ${hud.job.urgent ? "red" : "gold"} arrow by your knight, or the dots on the map.` });
  if (hud.ctx.pet) tips.push({ key: "sheba", text: "That's Sheba! Press E to give her a pet. One of the chores is feeding her: her bowl is in the Kitchen." });
  if (!tips.length) tips.push({ key: "idle", text: "All your chores are done. Keep your eyes open: note who you see where, and ring the Great Bell (B, in the Great Hall) if you're suspicious." });
  return tips;
}

export function HelpOwl({ hud, open, setOpen }) {
  const [tab, setTab] = useState("now");
  const [bubble, setBubble] = useState(null);
  const seen = useRef(new Set());
  const tips = hud ? tipsFor(hud) : [];
  // pop up a hot tip the first time it appears
  useEffect(() => {
    const hot = tips.find((t) => t.hot && !seen.current.has(t.key));
    if (hot) {
      seen.current.add(hot.key);
      setBubble(hot.text);
      const id = setTimeout(() => setBubble(null), 7000);
      return () => clearTimeout(id);
    }
  }, [tips.map((t) => t.key).join("|")]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!hud) return null;
  const r = ROLES[hud.me.role];
  const tabs = [["now", "Right now"], ["role", "Your role"], ["chores", "Chores"], ["win", "Winning"], ["keys", "Keys"]];
  return (
    <>
      {bubble && !open && (
        <div onClick={() => { setBubble(null); setOpen(true); }} style={{ position: "absolute", right: 86, bottom: 28, maxWidth: 320, background: "rgba(20,16,40,0.95)", border: "1px solid #c9a227", borderRadius: 12, padding: "10px 14px", color: "#f2e6c8", fontSize: 13.5, lineHeight: 1.5, cursor: "pointer", boxShadow: "0 8px 30px rgba(0,0,0,0.5)" }}>
          {bubble}
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        aria-label="Help: ask the owl"
        title="Help (H)"
        style={{ position: "absolute", right: 16, bottom: 16, width: 58, height: 58, borderRadius: "50%", border: "2px solid #c9a227", background: "radial-gradient(circle at 50% 40%, #3a2d18, #14100a)", cursor: "pointer", boxShadow: bubble ? "0 0 22px rgba(255,210,120,0.7)" : "0 0 10px rgba(255,210,120,0.25)", animation: bubble ? "owlPulse 1.2s ease-in-out infinite" : "none", padding: 0 }}
      >
        <svg viewBox="0 0 40 40" width="42" height="42" aria-hidden="true">
          <path d="M8 10 L13 15 L20 12 L27 15 L32 10 L31 24 Q30 34 20 36 Q10 34 9 24 Z" fill="#8a6a3a" />
          <path d="M13 22 Q20 33 27 22 Q24 31 20 32 Q16 31 13 22" fill="#c9a66a" />
          <circle cx="15" cy="19" r="5" fill="#f2e6c8" /><circle cx="25" cy="19" r="5" fill="#f2e6c8" />
          <circle cx="15" cy="19" r="2.4" fill="#1b1406" /><circle cx="25" cy="19" r="2.4" fill="#1b1406" />
          <circle cx="15.8" cy="18.2" r="0.8" fill="#fff" /><circle cx="25.8" cy="18.2" r="0.8" fill="#fff" />
          <path d="M18.5 22 L20 25 L21.5 22 Z" fill="#e9b44a" />
        </svg>
      </button>
      {open && (
        <div style={{ position: "absolute", right: 16, bottom: 86, width: "min(420px, calc(100vw - 32px))", maxHeight: "70vh", overflow: "auto", background: "rgba(14,12,28,0.97)", border: "1px solid #c9a227", borderRadius: 12, padding: 16, color: "#e7e1ff", boxShadow: "0 12px 40px rgba(0,0,0,0.6)" }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
            <div style={{ fontFamily: "Fraunces, Georgia, serif", fontStyle: "italic", fontSize: 22, color: "#f2dc9a" }}>The castle owl</div>
            <button onClick={() => setOpen(false)} style={{ background: "transparent", border: 0, color: "#a9a3c4", fontSize: 18, cursor: "pointer" }} aria-label="Close help">×</button>
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", margin: "8px 0 12px" }}>
            {tabs.map(([k, n]) => (
              <button key={k} onClick={() => setTab(k)} style={{ background: tab === k ? "#c9a227" : "#17142e", color: tab === k ? "#1b1406" : "#e7e1ff", border: "1px solid #3a3560", borderRadius: 999, padding: "4px 10px", fontSize: 12, cursor: "pointer" }}>{n}</button>
            ))}
          </div>
          <div style={{ fontSize: 13.5, lineHeight: 1.6, color: "#d7d1ef" }}>
            {tab === "now" && tips.map((t) => <p key={t.key} style={{ margin: "0 0 10px", color: t.hot ? "#ffe2a8" : "#d7d1ef" }}>{t.text}</p>)}
            {tab === "role" && (
              <>
                <p style={{ margin: "0 0 8px" }}><b style={{ color: r.side === "dark" ? "#ff9a85" : "#f2dc9a" }}>You are the {r.name}.</b> {r.blurb}</p>
                {r.keys.map(([k, l]) => <p key={k + l} style={{ margin: "0 0 4px" }}><b style={{ border: "1px solid #8a83c0", borderRadius: 4, padding: "0 5px" }}>{k}</b> {l}</p>)}
                {hud.me.role === "blackknight" && <p style={{ margin: "8px 0 0" }}>To capture: walk right up to someone, nearly touching, and press <b>Q</b>. A prompt appears at the bottom of the screen when someone is in reach. Don&rsquo;t do it where others can see you, and don&rsquo;t capture the Jester: they&rsquo;re on your side.</p>}
                {hud.ally.length > 0 && <p style={{ margin: "8px 0 0", color: "#ffb4a2" }}>Your secret partner: {hud.ally.map((a) => `${a.name} (the ${a.role})`).join(", ")}.</p>}
              </>
            )}
            {tab === "chores" && (
              <>
                <p style={{ margin: "0 0 8px" }}>Everyone on the castle&rsquo;s side has 8 chores spread around the castle. They&rsquo;re listed bottom-left, glow gold on the floor, show as gold dots on the little map, and the gold arrow next to your knight points to the nearest one.</p>
                <p style={{ margin: "0 0 8px" }}>Walk to one and <b>press E</b> (or click the prompt). A small job opens: scrub, stir, pour, light candles, sharpen a sword, knead dough, carry hay, wind the clock... Some take longer than others, and the castle carries on around you while you work, so mind your back. Esc stops. When everybody&rsquo;s chores are done (the bar at the top), the castle wins. Ghosts&rsquo; chores still count.</p>
                <p style={{ margin: "0 0 8px" }}><b style={{ color: "#f2dc9a" }}>Every chore is a clue card</b>, like being shown a card in Clue: was there a struggle in that room this round, and one weapon that&rsquo;s accounted for (or, if the room has a weapon stand, whether it&rsquo;s empty). It all goes in your Detective&rsquo;s Notebook (C). Six weapons stand in six rooms: the Dagger (Kitchen), Battle-Axe (Armory), Mace (Gatehouse), Iron Candlestick (Chapel), Rope (Stables) and Poisoned Goblet (Wine Cellar). The Black Knight&rsquo;s weapon this round leaves its stand empty.</p>
                <p style={{ margin: "0 0 8px" }}>Red spots and a red arrow mean sabotage to fix: relight the torches at the Forge, or free the portcullis in the Gatehouse.</p>
                <p style={{ margin: 0 }}>The Black Knight and the Jester have <i>pretend</i> chores: standing at them makes you look busy, but they don&rsquo;t count. Watch for someone who stands at a chore and the bar doesn&rsquo;t move.</p>
              </>
            )}
            {tab === "win" && (
              <>
                <p style={{ margin: "0 0 8px" }}><b style={{ color: "#f2dc9a" }}>The castle wins</b> by finishing every chore, or by voting the Black Knight into the joust, where they&rsquo;re knocked off their horse.</p>
                <p style={{ margin: "0 0 8px" }}><b style={{ color: "#ff9a85" }}>The Black Knight (and Jester) win</b> at midnight, or when there are no more honest folk free than there are of them.</p>
                <p style={{ margin: "0 0 8px" }}><b style={{ color: "#f2dc9a" }}>At every meeting you make an accusation, like the end of Clue:</b> who, with what weapon, in what room. Who you name decides the joust. Name the weapon and you get Swift Boots (faster) next round; name the room and you get the Owl&rsquo;s Lantern (a bigger torch that the dark can&rsquo;t put out); both, and the Raven brings you a free clue card. All three right and you&rsquo;ve solved the whole murder: big dominoes at the end.</p>
                <p style={{ margin: "0 0 8px" }}><b style={{ color: "#f2dc9a" }}>The Donaghy Claymore</b> is hidden somewhere in the castle each night (look for a glint). Anyone but the Black Knight can take it up and strike once, at anyone. Slay the Black Knight and the castle wins on the spot.</p>
                <p style={{ margin: "0 0 8px" }}>Clues: a captured person&rsquo;s helmet lies hidden until someone does a chore in that room, trips over it, or saw it happen. A found helmet tells you which room the captor came from (soot means the Forge, straw the Stables, and so on), and its marks narrow the weapon down to two (a cut strap, a dent, or no mark at all). In the meeting, compare that with where people say they were, and with what you saw yourself.</p>
                <p style={{ margin: 0 }}>Secret passages, like in Clue: the trapdoors in the corner rooms join the North Tower to the Well House, and the Armory to the Dungeon. Stand on one and hold E, and you&rsquo;ll row round the moat in a little boat and climb out in the opposite corner.</p>
              </>
            )}
            {tab === "keys" && (
              <p style={{ margin: 0 }}>
                Click on the floor to walk there, or hold the mouse button and steer · arrows or WASD also walk · E: start a chore or repair, pet Sheba · hold E: trapdoor · R: report a helmet · B: ring the Great Bell (once a night, in the Great Hall) ·
                Q: capture (Black Knight) / swap (Jester) · F: Torch of Truth (Knight) · 1, 2, 3, 4: Black Knight sabotage and disguise · E by the Claymore: take it · G: strike with the Claymore · C: your Detective&rsquo;s Notebook · H: this owl · N: music · M: sound effects · V: your microphone on or off (in a family game)
              </p>
            )}
          </div>
        </div>
      )}
      <style>{`@keyframes owlPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}`}</style>
    </>
  );
}
