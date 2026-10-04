import ModeLanding from "../../../components/ModeLanding";

const items = [
  { href: "/book", emblem: "book", title: "The Book", blurb: "First contact, told from three perspectives — two human, one not. Read the rough draft now.", tags: ["2 chapters", "narrated"] },
  { href: "/music", emblem: "music", title: "The Music", blurb: "Three albums, 36 signals. What you hear is a translation of something felt, not heard.", tags: ["3 albums", "shuffle all", "a music video"] },
  { href: "/assignments", emblem: "stories", title: "Short Stories", blurb: "A growing archive of Assignments — 13i, sent somewhere, reporting back.", tags: ["Season 1", "audio", "interactive"] },
  { href: "/galaxy", emblem: "galaxy", title: "The Galaxy", blurb: "Where this all takes place, with Earth marked on the map.", tags: ["3D map", "The Black Hole", "space news"] },
];

export default function ExplorePage() {
  return (
    <ModeLanding
      mode="explore"
      title="Explore"
      subtitle="what's already here, waiting to be found"
      line="The book, the music, 13i's own records, and the galaxy they happen in. Start anywhere; every door leads further in."
      items={items}
      next={{ line: "Found something that makes you want to do more than read?", href: "/play", label: "Go Play" }}
    />
  );
}
