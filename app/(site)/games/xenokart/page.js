import XenoKartGame from "../../../../components/XenoKartGame";

export const metadata = { title: "XenoKart" };

export default function XenoKartPage() {
  return (
    <div>
      <div className="page-title">XenoKart</div>
      <div className="page-subtitle">two cups &middot; nine alien worlds &middot; eight racers &middot; leaderboard</div>
      <XenoKartGame />
    </div>
  );
}
