import IframeGame from "../../../../components/IframeGame";

// Update 6.30: SalienT, the 13i alien hero shooter (formerly "13i Alien Combat"), version 0.24.
// Update 6.31: version 0.25 - Temple of 13i arena (vault doors, Temple Warden boss, Crawler centipedes), 6 v 6.
//   0.25 is a single self-contained index.html (models built in); the old assets/ folder is gone.
// The game itself is a separate project (TypeScript + Three.js + Vite); its production build
// is copied into public/games/salient/ - replace that folder wholesale on each update
// and bump the ?v= below so browsers fetch the new build.
// The step-1 build stays at /games/alien-combat so you can see how far it has come.
export const metadata = { title: "SalienT" };

export default function SalientPage() {
  return (
    <div>
      <div className="page-title">SalienT</div>
      <div className="page-subtitle">in the workshop &middot; v0.25 &middot; Brontor, Skitter, Chephro and Vexl &middot; team fights up to 6 v 6, three arenas &middot; new: Temple of 13i</div>
      <IframeGame
        game="salient"
        src="/games/salient/index.html?v=0.25.0"
        title="SalienT"
        note="pick a species, then Play · full screen button at the top · WASD move (double-tap W to sprint) · mouse aim · left click fire · right click secondary · V melee · E / Shift / F abilities · Q ultimate · Space jump · Tab scores · H all controls · Esc gives the mouse back"
      />
    </div>
  );
}
