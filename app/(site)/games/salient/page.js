import IframeGame from "../../../../components/IframeGame";

// Update 6.34: SalienT 0.28: online play (rooms of up to 3 players, through lib/salientRooms.js
// and IframeGame), 5 v 5, mouse and key settings, a first-match tutorial, smaller models.
// From 0.27 the game is built from its TypeScript source again (npm run build): index.html plus
// an assets/ folder (script, styles and the character models). Replace public/games/salient/
// wholesale on each update and bump the ?v= below so browsers fetch the new page.
// The step-1 build stays at /games/alien-combat so you can see how far it has come.
export const metadata = { title: "SalienT" };

export default function SalientPage() {
  return (
    <div>
      <div className="page-title">SalienT</div>
      <div className="page-subtitle">in the workshop &middot; v0.28 &middot; eight species &middot; team fights up to 6 v 6, three arenas &middot; new: play online with friends</div>
      <IframeGame
        game="salient"
        src="/games/salient/index.html?v=0.28.0"
        title="SalienT"
        note="pick a species, then Start Game (or Play online with friends, top right) · full screen button at the top · WASD move (double-tap W to sprint) · mouse aim · left click fire · right click secondary · V melee · E / Shift / F abilities · Q ultimate · Space jump · Tab scores · Z camera distance · H all controls · Esc gives the mouse back"
      />
    </div>
  );
}
