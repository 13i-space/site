import IframeGame from "../../../../components/IframeGame";

// Update 6.33: SalienT, the 13i alien hero shooter, version 0.27: four new species (Thulkar,
// Kryvax, Elyra, Murm), random 6 v 6 line-ups, a new title screen and logo, Temple of 13i fixes.
// From 0.27 the game is built from its TypeScript source again (npm run build): index.html plus
// an assets/ folder (script, styles and the character models). Replace public/games/salient/
// wholesale on each update and bump the ?v= below so browsers fetch the new page.
// The step-1 build stays at /games/alien-combat so you can see how far it has come.
export const metadata = { title: "SalienT" };

export default function SalientPage() {
  return (
    <div>
      <div className="page-title">SalienT</div>
      <div className="page-subtitle">in the workshop &middot; v0.27 &middot; eight species &middot; team fights up to 6 v 6, three arenas &middot; new: Thulkar, Kryvax, Elyra and Murm</div>
      <IframeGame
        game="salient"
        src="/games/salient/index.html?v=0.27.0"
        title="SalienT"
        note="pick a species, then Play · full screen button at the top · WASD move (double-tap W to sprint) · mouse aim · left click fire · right click secondary · V melee · E / Shift / F abilities · Q ultimate · Space jump · Tab scores · Z camera distance · H all controls · Esc gives the mouse back"
      />
    </div>
  );
}
