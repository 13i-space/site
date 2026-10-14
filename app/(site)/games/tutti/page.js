import StoryGame from "../../../../components/StoryGame";

export const metadata = { title: "TUTTI", description: "A game of The Accord: keep the Pell's web of agreements with the species of the Great Wood alive, and find out what the vine really is." };

export default function TuttiPage() {
  return (
    <div>
      <div className="page-title">TUTTI</div>
      <div className="page-subtitle">a game of The Accord &middot; what do you give, and what do you take?</div>
      <StoryGame game="tutti" />
    </div>
  );
}
