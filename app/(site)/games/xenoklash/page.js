import XenoKlashGame from "../../../../components/XenoKlashGame";

export const metadata = { title: "XenoKlash" };

export default function XenoKlashPage() {
  return (
    <div>
      <div className="page-title">XenoKlash</div>
      <div className="page-subtitle">galactic gladiators &middot; three tournaments &middot; the Hollow King &middot; tournament leaderboard</div>
      <XenoKlashGame />
    </div>
  );
}
