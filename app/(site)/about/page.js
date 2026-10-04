import ModeLanding from "../../../components/ModeLanding";

// The About hub (Update 5.57): the same look as Explore / Play / Create /
// Kinship (components/ModeLanding.js), in its own soft violet.
const items = [
  { href: "/about/paul", emblem: "paul", title: "About Paul", blurb: "The person behind 13i: where I came from, and why it's never too late.", tags: ["the person"] },
  { href: "/about/origin", emblem: "origin", title: "The Origin of 13i", blurb: "It didn't begin with a novel. It began with curiosity, and a song or two.", tags: ["how it began"] },
  { href: "/about/mission", emblem: "mission", title: "Mission & Values", blurb: "Why 13i exists, and Explore. Play. Create.: the idea it's built on.", tags: ["the point of it"] },
  { href: "/about/kinship", emblem: "kin", title: "Kinship", blurb: "What it means to be Kin, why it matters, and how to be one here.", tags: ["we are Kin"] },
];

export const metadata = { title: "About" };

export default function AboutHub() {
  return (
    <ModeLanding
      mode="about"
      title="About"
      subtitle="the person, the origin, and the point of it all"
      line="Who made 13i, how it started, what it's for, and what it means to be one of the Kin."
      items={items}
      next={{ line: "Seen enough of the backstage? The universe is this way.", href: "/explore", label: "Go Explore" }}
    />
  );
}
