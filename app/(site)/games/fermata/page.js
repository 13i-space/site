import StoryGame from "../../../../components/StoryGame";

export const metadata = { title: "FERMATA", description: "A game of The Fermata: lean on a comet as lightly as you can, so its people wake one more time." };

export default function FermataPage() {
  return (
    <div>
      <div className="page-title">FERMATA</div>
      <div className="page-subtitle">a game of The Fermata &middot; one more waking, and one more</div>
      <StoryGame game="fermata" />
    </div>
  );
}
