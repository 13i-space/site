import AboutProse from "../../../../components/AboutProse";

export const metadata = { title: "The Origin of 13i" };

const blocks = [
  { p: "13i didn't start as a novel. It didn't start as a website, or an album, or any kind of plan. It started the way most of my better ideas have: with curiosity." },
  { p: "For as long as I can remember, I've been drawn to the things we don't fully understand: dinosaurs, ancient civilizations, space, other worlds, and the nagging question of whether we're really as alone as we tend to assume. Those interests never went away. What changed, decades later, was that I finally had the time and the freedom to do something with them." },
  { p: "I'd spent my career in business: marketing, leadership, management. When I stepped away from that, I got to ask a question I'd rarely had the luxury of asking. Not what I was supposed to make, but what I actually wanted to make. The honest answer was that I didn't know yet." },
  { p: "So I started with music. I had no background as a composer or a producer. I just wanted to see whether I could teach myself to make electronic music. The experimenting turned into dozens of songs, and the songs turned into an education: how to notice an idea, build on it, throw it out when it isn't working, and keep going when something finally clicks. Somewhere along the way, I gave the music an identity of its own: ZYBЯΞX." },
  { p: "Then a different question showed up. What if the music wasn't just music? What if it was evidence, a signal, with some kind of intelligence on the other end of it?" },
  { p: "That was the beginning of 13i." },
  { p: "The idea grew into a science-fiction story about signals, consciousness, artificial intelligence, alien civilizations, and the possibility that our idea of intelligence is a lot smaller than the real thing. The story became a novel. Then came short stories, artwork, characters, lore, timelines, transmissions, and all kinds of experiments in how people might experience the world I was building." },
  { p: "The more pieces I made, the more obvious it became that they weren't separate projects at all. They belonged together, and 13i became the name for the universe that holds them. The music is part of the mystery. The novel is one doorway in. The short stories are fragments of a bigger history. And this website is where you can find all of it." },
  { p: "One thing I want to be clear about. Artificial intelligence is everywhere in the 13i universe, but 13i is fiction. The music isn't. Every song is written, arranged, performed and produced by me, a human being learning the craft one experiment at a time." },
  { strong: "100% HUMAN-CREATED MUSIC" },
  { p: "That distinction matters to me, because at its heart 13i isn't really a project about artificial intelligence. It's about human curiosity: asking questions before you know the answers, looking past what's familiar, and taking seriously the idea that reality is bigger than the part we can currently see." },
  { p: "It's also my proof that making something new doesn't come with an expiration date. I started this later in life than most people start anything. I've never seen that as a disadvantage. It's become part of the story." },
  { p: "There was never a master plan. There was just the next signal, and then the next one, until eventually they connected." },
];

export default function OriginPage() {
  return (
    <AboutProse
      title="The Origin of 13i"
      subtitle="how a curiosity became a universe"
      current="/about/origin"
      blocks={blocks}
      closing={["This is 13i.", "Listen. Feel. Transcend."]}
    />
  );
}
