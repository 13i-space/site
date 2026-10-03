import Link from "next/link";

// The four ways into 13i on /launch, drawn as one path rather than four
// menu boxes: a thread runs through four markers that brighten as it goes,
// from the cool blue of discovering to the warm gold of finding the others.
// Each stop names what it is (one verb) and a few of the real places in it.
// Create is marked a little more strongly - it's what makes 13i different.
const STOPS = [
  {
    key: "explore", href: "/explore", title: "Explore", verb: "discover it",
    line: "The book, the music, 13i's own records, the galaxy they happen in.",
    places: [["The Book", "/book"], ["The Music", "/music"], ["Short Stories", "/assignments"], ["The Galaxy", "/galaxy"]],
    color: "#8B95F6",
  },
  {
    key: "play", href: "/play", title: "Play", verb: "step inside it",
    line: "Speak with 13i. Make its choices. Play the games its records left behind.",
    places: [["The Oracle", "/oracle"], ["Interactive Stories", "/assignments/interactive"], ["Games", "/games"], ["Artifacts", "/artifacts"]],
    color: "#B9C0FF",
  },
  {
    key: "create", href: "/create", title: "Create", verb: "add to it",
    line: "Build a species. Compose a signal. Write an Assignment. Dig into Mars with everyone else.",
    places: [["The Alien Lab", "/create/alien-lab"], ["Write an Assignment", "/assignments/write"], ["Signal Composer", "/create/signal-composer"], ["SpaceCore", "/create/spacecore"]],
    color: "#E8CFC0",
    marked: true,
  },
  {
    key: "kinship", href: "/kinship", title: "Kinship", verb: "find the others",
    line: "Where the Kin talk, leave word for each other, and write to one another directly.",
    places: [["The Forum", "/forum"], ["The Kinbook", "/kinbook"], ["Messages", "/messages"]],
    color: "#E9D29A",
  },
];

export default function LaunchJourney() {
  return (
    <section id="journey" className="journey" aria-labelledby="journey-title">
      <h2 id="journey-title" className="mono journey-kicker">FOUR WAYS IN &middot; ONE PATH THROUGH</h2>
      <ol className="journey-path">
        {STOPS.map((s, i) => (
          <li key={s.key} className={`journey-stop${s.marked ? " journey-stop-marked" : ""}`} style={{ "--stop": s.color, "--i": i }}>
            <span className="journey-node" aria-hidden="true" />
            <div className="journey-body">
              <Link href={s.href} className="journey-head">
                <span className="wordmark journey-title">{s.title}</span>
                <span className="mono journey-verb">{s.verb}</span>
              </Link>
              <p className="journey-line">{s.line}</p>
              <ul className="journey-places">
                {s.places.map(([label, href]) => (
                  <li key={href}><Link href={href}>{label}</Link></li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
