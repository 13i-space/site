import XenoKartGame from "../../../../components/XenoKartGame";

export const metadata = { title: "XenoKart" };

export default function XenoKartPage() {
  return (
    <div>
      <div className="page-title">XenoKart</div>
      <div className="page-subtitle">grand prix of the worlds &middot; alien kart racing across four tracks &middot; leaderboard</div>
      <XenoKartGame />
    </div>
  );
}
