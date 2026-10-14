import StoryGame from "../../../../components/StoryGame";

export const metadata = { title: "RITORNELLO", description: "A game of The Ring: answer the Ring's phrase from the eyepiece on Hal Teru, as it returns with one more note each time." };

export default function RitornelloPage() {
  return (
    <div>
      <div className="page-title">RITORNELLO</div>
      <div className="page-subtitle">a game of The Ring &middot; the passage that comes back</div>
      <StoryGame game="ritornello" />
    </div>
  );
}
