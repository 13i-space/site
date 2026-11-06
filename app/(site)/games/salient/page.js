import IframeGame from "../../../../components/IframeGame";

// Update 6.37: SalienT 0.32: title screen clean-up (portraits, match setup, Focus bar, Title screen button).
// Update 6.36: SalienT 0.31: five looks per species with patterns, Sunscar and Temple surfaces, alien
// tech on every map, lower jumps, Temple wash-out fix.
// Update 6.35: SalienT 0.30: headshots and more damage, lower jumps, a stairs fix, the Tidal Basin look
// pilot (photographed surface textures in public/games/salient/assets as .ktx2, transcoder in basis/) and a
// rooms fix (lib/salientRooms.js answers the game's room check at once).
// Update 6.34: SalienT 0.29 (with 0.28): online play (rooms of up to 3 players, through lib/salientRooms.js
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
      <div className="page-subtitle">in the workshop &middot; v0.32 &middot; eight species &middot; team fights up to 6 v 6, three arenas &middot; new: 40 species looks, upgraded Sunscar and Temple, alien tech on every map</div>
      <IframeGame
        game="salient"
        src="/games/salient/index.html?v=0.32.0"
        title="SalienT"
        note="pick a species, then Start Game (or Play online with friends, top right) · full screen button at the top · WASD move (double-tap W to sprint) · mouse aim · left click fire · right click secondary · V melee · E / Shift / F abilities · Q ultimate · Space jump · Tab scores · Z camera distance · H all controls · Esc gives the mouse back"
      />
    </div>
  );
}
