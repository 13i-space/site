import StoryGame from "../../../../components/StoryGame";

export const metadata = { title: "HOLD FIRE", description: "A game of First Fire: the Kesh are firing on you. Bend their fire away, never return it, and stand between their star and their world when it flares." };

export default function HoldFirePage() {
  return (
    <div>
      <div className="page-title">HOLD FIRE</div>
      <div className="page-subtitle">a game of First Fire &middot; outlast their fear, in plain sight</div>
      <StoryGame game="hold-fire" />
    </div>
  );
}
