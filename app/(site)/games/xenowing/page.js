import XenoWingGame from "../../../../components/XenoWingGame";

export const metadata = { title: "XenoWing" };

export default function XenoWingPage() {
  return (
    <div>
      <div className="page-title">XenoWing</div>
      <div className="page-subtitle">four pilots from the Rave &middot; five worlds &middot; five missions &middot; one methane wyrm &middot; leaderboard</div>
      <XenoWingGame />
    </div>
  );
}
