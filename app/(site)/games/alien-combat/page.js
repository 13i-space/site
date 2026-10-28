import IframeGame from "../../../../components/IframeGame";

// Update 6.27: 13i Alien Combat, the third-person alien hero shooter, built in the open.
// The game itself is a separate project (TypeScript + Three.js + Vite); its production build
// is copied into public/games/alien-combat/ - replace that folder wholesale on each update
// and bump the ?v= below so browsers fetch the new build.
export const metadata = { title: "13i Alien Combat" };

export default function AlienCombatPage() {
  return (
    <div>
      <div className="page-title">13i Alien Combat</div>
      <div className="page-subtitle">in the workshop &middot; step 1 of 6 &middot; movement and camera in the Tidal Basin</div>
      <IframeGame
        game="alien-combat"
        src="/games/alien-combat/index.html?v=6.27"
        title="13i Alien Combat"
        note="click Enter arena · WASD move · mouse look · Space jump · V swap shoulder · Esc gives the mouse back"
      />
    </div>
  );
}
