import StoryGame from "../../../../components/StoryGame";

export const metadata = { title: "PRISM", description: "A game of The Sea of Glass: carry the light across a plain of returners before the white star rises." };

export default function PrismPage() {
  return (
    <div>
      <div className="page-title">PRISM</div>
      <div className="page-subtitle">a game of The Sea of Glass &middot; carry the light</div>
      <StoryGame game="prism" />
    </div>
  );
}
