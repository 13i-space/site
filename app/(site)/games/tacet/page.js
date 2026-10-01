import StoryGame from "../../../../components/StoryGame";

export const metadata = { title: "TACET", description: "A game of The Quiet Moon: be the silence that holds a loud moon together." };

export default function TacetPage() {
  return (
    <div>
      <div className="page-title">TACET</div>
      <div className="page-subtitle">a game of The Quiet Moon &middot; be the silence</div>
      <StoryGame game="tacet" />
    </div>
  );
}
