import ModeLanding from "../../../components/ModeLanding";

const items = [
  { href: "/oracle", emblem: "oracle", title: "The Oracle", blurb: "Speak to 13i directly. You are not talking to one voice.", tags: ["ask anything"] },
  { href: "/games", emblem: "games", title: "Games", blurb: "NEMESIS Command, Asteroid Belt, 13i vs NEMESIS, and Short Story Games.", tags: ["leaderboards", "story games"] },
  { href: "/assignments/interactive", emblem: "interactive", title: "Interactive Stories", blurb: "Be 13i: Choose the Story Decisions in a Visual Novel.", tags: ["4 stories", "5 records each"] },
  { href: "/artifacts", emblem: "artifacts", title: "Artifacts", blurb: "The Wish Engine, the Cryptex and the Listening Well: objects that answer back.", tags: ["3 artifacts", "sound on"] },
];

export default function PlayPage() {
  return (
    <ModeLanding
      mode="play"
      title="Play"
      subtitle="step inside it"
      line="Speak with 13i. Make its choices. Play the games its records left behind, and open what it brought back."
      items={items}
      next={{ line: "Ready to make something of your own?", href: "/create", label: "Go Create" }}
    />
  );
}
