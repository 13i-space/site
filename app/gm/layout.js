// Virtual GM lives at 13i.space/gm but shares nothing with 13i: its own styles, fonts and
// colors. Everything is in app/gm and lib/gm. It is a demo: not indexed, not linked from the
// 13i nav, and optionally behind a passcode (GM_PASSCODE).
import "./gm.css";
import { currentClub } from "../../lib/gm/store";
import { onColor } from "../../lib/gm/text";
import { unlocked } from "../../lib/gm/gate";
import { unlock } from "../../lib/gm/actions";
import { Brand } from "./_components/ui";

export const metadata = {
  title: { default: "Virtual GM", template: "%s · Virtual GM" },
  description: "An AI front office for minor-league soccer clubs. Demo.",
  robots: { index: false, follow: false },
  icons: { icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='7' fill='%2308162B'/%3E%3Cpath d='M16 4 6 8v8c0 6 4 10 10 12 6-2 10-6 10-12V8L16 4Z' fill='%23C9F23A'/%3E%3Cpath d='M16 10l4 3-1.5 4.7h-5L12 13l4-3Z' fill='%2308162B'/%3E%3C/svg%3E" },
};
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export default async function GmLayout({ children }) {
  const open = await unlocked();
  const club = await currentClub();
  const vars = { "--club": club.colors.secondary, "--club2": club.colors.primary, "--on-club": onColor(club.colors.secondary) };
  return (
    <div className="gm" style={vars}>
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700&family=Public+Sans:wght@400;500;600;700&display=swap" />
      {open ? children : (
        <div className="gate">
          <form action={unlock} className="signup">
            <Brand href="/gm" />
            <div><h2>Private demo</h2><p className="mute" style={{ marginTop: 6 }}>Enter the passcode to continue.</p></div>
            <div><label htmlFor="code">Passcode</label><input id="code" name="code" type="password" autoComplete="off" /></div>
            <button className="btn primary lg" type="submit">Continue</button>
          </form>
        </div>
      )}
    </div>
  );
}
