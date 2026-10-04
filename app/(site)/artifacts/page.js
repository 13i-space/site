import ModeLanding from "../../../components/ModeLanding";

// The Artifacts hub (Update 5.58): the mode-page look (it lives in Play),
// one emblem per object.
const items = [
  { href: "/artifacts/wish-engine", emblem: "wish", title: "The Wish Engine", blurb: "A fortune cabinet found drifting, with Varrow inside. Ask a question, drop a token, get your answer.", tags: ["ask anything", "make a wish"] },
  { href: "/artifacts/cryptex", emblem: "cryptex", title: "The Cryptex", blurb: "Three alien drums, nine marks. Find the order the mechanism accepts and something real unlocks.", tags: ["a puzzle", "sound on"] },
  { href: "/artifacts/listening-well", emblem: "well", title: "The Listening Well", blurb: "13i's makers feel gravity. Set worlds in orbit and hear how 13i translates the pull of things.", tags: ["gravity", "music"] },
];

export const metadata = { title: "Artifacts" };

export default function ArtifactsHub() {
  return (
    <ModeLanding
      mode="play"
      title="Artifacts"
      subtitle="objects recovered from inside the story"
      line="Things 13i brought back, or found still running. Handle them carefully. Some of them answer."
      items={items}
      next={{ line: "Want something faster?", href: "/games", label: "Go to the Games" }}
    />
  );
}
