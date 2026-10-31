import IframeGame from "../../../../components/IframeGame";

// Update 6.29: SalienT, the 13i alien hero shooter (formerly "13i Alien Combat"), version 0.23.
// The game itself is a separate project (TypeScript + Three.js + Vite); its production build
// is copied into public/games/salient/ - replace that folder wholesale on each update
// and bump the ?v= below so browsers fetch the new build.
// The step-1 build stays at /games/alien-combat so you can see how far it has come.
export const metadata = { title: "SalienT" };

export default function SalientPage() {
  return (
    <div>
      <div className="page-title">SalienT</div>
      <div className="page-subtitle">in the workshop &middot; v0.23 &middot; Brontor, Skitter and Chephro &middot; team fights up to 4 v 4, two arenas</div>
      <IframeGame
        game="salient"
        src="/games/salient/index.html?v=0.23.0"
        title="SalienT"
        note="click a species · WASD move (double-tap W to sprint) · mouse aim · left click fire · right click secondary · V melee · E / Shift / F abilities · Q ultimate · Space jump · Tab scores · H all controls · Esc gives the mouse back"
      />
    </div>
  );
}
