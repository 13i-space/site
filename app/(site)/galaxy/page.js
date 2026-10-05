import ModeLanding from "../../../components/ModeLanding";

// The Galaxy hub (Update 5.59): the mode-page look (it lives in Explore),
// an emblem for every place.
const items = [
  { href: "/galaxy/map", emblem: "map", title: "The Map", blurb: "The galaxy in 3D, full screen: Earth, the Assignments' worlds, your species and the book's characters.", tags: ["full screen", "sound"] },
  { href: "/galaxy/black-hole", emblem: "blackhole", title: "The Black Hole", blurb: "A weekly deep dive into one idea in space and physics, with something to touch at every step.", tags: ["new every week"] },
  { href: "/galaxy/aliens", emblem: "aliens", title: "Aliens of the Galaxy", blurb: "Every species built in the Alien Lab, as cards. Browse them, and run the Survival Trials.", tags: ["cards", "survival trials"] },
  { href: "/galaxy/news", emblem: "news", title: "Space News", blurb: "The Galactic Gazette: today's headlines from NASA, ESA and more, refreshed through the day.", tags: ["daily"] },
  { href: "/galaxy/facts", emblem: "facts", title: "Galaxy Facts", blurb: "Zoom from you to the whole universe, ride a light beam, and watch galaxies collide.", tags: ["hands-on"] },
  { href: "/quiz", emblem: "quiz", title: "Universe Quiz", blurb: "Ten questions from across the cosmos. Light the ring gold.", tags: ["10 signals"] },
];

export const metadata = { title: "The Galaxy" };

export default function GalaxyHub() {
  return (
    <ModeLanding
      mode="explore"
      title="The Galaxy"
      subtitle="where this all takes place"
      line="The map, the black hole, every species the Kin have made, and the news from our own corner of it."
      items={items}
      next={{ line: "Ready to step inside it?", href: "/play", label: "Go Play" }}
    />
  );
}
