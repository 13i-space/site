import IframeGame from "../../../../components/IframeGame";

// Update 6.28: SalienT, the 13i alien hero shooter (formerly "13i Alien Combat"), version 0.21.
// The game itself is a separate project (TypeScript + Three.js + Vite); its production build
// is copied into public/games/salient/ - replace that folder wholesale on each update
// and bump the ?v= below so browsers fetch the new build.
// The step-1 build stays at /games/alien-combat so you can see how far it has come.
export const metadata = { title: "SalienT" };

export default function SalientPage() {
  return (
    <div>
      <div className="page-title">SalienT</div>
      <div className="page-subtitle">in the workshop &middot; v0.21 &middot; Brontor and Skitter, team fights up to 4 v 4, two arenas</div>
      <IframeGame
        game="salient"
        src="/games/salient/index.html?v=0.21.0"
        title="SalienT"
        note="click a species · WASD move · mouse aim · click shoot · E melee · Q / C abilities · X ultimate · Space jump · H controls · Esc gives the mouse back"
      />
    </div>
  );
}
