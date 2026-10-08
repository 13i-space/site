import Link from "next/link";
import { createClient } from "../../../../lib/supabaseServer";
import AlienDeck from "../../../../components/AlienDeck";

// Signal Composer v2 (Update 5.65): the Alien DJ Controller -
// components/AlienDeck.js. (v1, the single-loop composer, is retired; its
// engine, lib/musicEngine.js, still plays every species' and story's signal.)
export default async function SignalComposerPage() {
  let loggedIn = false;
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    loggedIn = !!user;
  } catch (e) {
    loggedIn = false;
  }

  return (
    <div className="dk-page">
      <Link href="/create" className="mono" style={{ fontSize: 12, color: "#6E76B8" }}>
        &larr; back to Create
      </Link>
      <div className="page-title" style={{ marginTop: 14 }}>Signal Composer</div>
      <div className="page-subtitle">v2 &middot; the alien DJ controller &middot; every sound synthesized live, in your browser</div>
      <AlienDeck loggedIn={loggedIn} />
      <details className="dk-help">
        <summary className="mono">HOW TO PLAY</summary>
        <ul>
          <li><b>Start:</b> press &#9654; on deck A. Deck B is on SYNC, so press &#9654; on B and it comes in on the beat. Bring it in with the crossfader (and the EQ - turn the LOW down on one deck as you bring the other in).</li>
          <li><b>Jog wheels:</b> drag the top of a playing record to scratch; drag the edge to nudge it. With SYNC off, beatmatch by ear with the TEMPO fader.</li>
          <li><b>Pads:</b> HOT CUE jumps to a bar or rolls the beat while you hold it; PAD FX play while held; SAMPLER fires one-shots; ALIEN mutates the track, flips it into 13i tuning, builds a drop, starts a chant or summons something.</li>
          <li><b>Mixer:</b> EQ knobs all the way left kill that band. FILTER: left is a low-pass, right a high-pass. BEAT FX: pick an effect, a channel and a length, then ON.</li>
          <li><b>The Studio:</b> new tracks by style, any species from Aliens of the Galaxy, or describe one in words. Edit drums, bass and lead bar by bar while it plays. &#x2913; WAV saves the loop; &#9679; REC up top records your whole set.</li>
          <li><b>The crowd</b> follows the music - and what you do with it. Drops, clean transitions and a brake slammed back in send them up.</li>
        </ul>
      </details>
    </div>
  );
}
