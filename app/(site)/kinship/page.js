import ModeLanding from "../../../components/ModeLanding";

const items = [
  { href: "/forum", emblem: "forum", title: "Forum", blurb: "A meeting place for Kin — new guests always welcome.", tags: ["four spaces"] },
  { href: "/kinbook", emblem: "kinbook", title: "Kinbook", blurb: "An ongoing message list from the Kin, outside the forum.", tags: ["leave word"] },
  { href: "/messages", emblem: "messages", title: "Messages", blurb: "Private conversations between Kin. Only the two of you can read them.", unread: true, tags: ["private"] },
];

export default function KinshipPage() {
  return (
    <ModeLanding
      mode="kinship"
      title="Kinship"
      subtitle="you are not the only one who found this"
      line="Where the Kin talk, leave word for each other, and write to one another directly."
      items={items}
      next={{ line: "Curious what someone else found first?", href: "/explore", label: "Go Explore" }}
    />
  );
}
