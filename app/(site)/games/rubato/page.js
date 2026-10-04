import StoryGame from "../../../../components/StoryGame";

export const metadata = { title: "RUBATO", description: "A game of The Borrowed Seconds: be Concord, and keep the Velani talking without letting them see your hand." };

export default function RubatoPage() {
  return (
    <div>
      <div className="page-title">RUBATO</div>
      <div className="page-subtitle">a game of The Borrowed Seconds &middot; borrow time, never the truth</div>
      <StoryGame game="rubato" />
    </div>
  );
}
