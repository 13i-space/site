import XenoKlashGame from "../../../../components/XenoKlashGame";

export const metadata = { title: "XenoKlash" };

export default function XenoKlashPage() {
  return (
    <div>
      <div className="page-title">XenoKlash</div>
      <div className="page-subtitle">galactic gladiators &middot; one-on-one alien fighting &middot; tournament leaderboard</div>
      <XenoKlashGame />
    </div>
  );
}
