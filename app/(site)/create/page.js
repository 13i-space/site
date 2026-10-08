import ModeLanding from "../../../components/ModeLanding";

const items = [
  { href: "/create/alien-lab", emblem: "alienlab", title: "The Alien Lab", blurb: "Build a species, question by question — the environment, the body, the mind. Then watch it face the Survival Trials.", tags: ["species cards", "13i's assessment"] },
  { href: "/create/spacecore", emblem: "spacecore", title: "SpaceCore", blurb: "Mission One: Mars. Dig in, build your own rooms underground, and help every Kin raise the colony. One world, always growing.", tags: ["shared world"] },
  { href: "/create/signal-composer", emblem: "composer", title: "Signal Composer", blurb: "The alien DJ controller: two decks, a mixer, pads and effects, a studio to build tracks - and a crowd from every world to play to.", tags: ["v2", "DJ"] },
  { href: "/assignments/write", emblem: "write", title: "Write an Assignment", blurb: "You are 13i. You have been sent somewhere. Tell us what happens.", tags: ["the archive"] },
];

export default function CreatePage() {
  return (
    <ModeLanding
      mode="create"
      title="Create"
      subtitle="express yourself, inside the universe"
      line="Build a species. Compose a signal. Write an Assignment. Dig into Mars with everyone else. What you make here becomes part of 13i."
      items={items}
      next={{ line: "Made something? Bring it to the others.", href: "/kinship", label: "Go to Kinship" }}
    />
  );
}
