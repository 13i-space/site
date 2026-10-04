import Link from "next/link";
import { Emblem } from "./ModeEmblems";
import MessagesLabel from "./MessagesLabel";

// The one look shared by the four mode landing pages - Explore, Play,
// Create, Kinship (Update 5.55). A hero in the mode's own colour (the same
// colours as the path on /launch) with its four places orbiting a lit core
// and a "you are here" on the four-stop path; then a card for each place,
// each with its emblem (components/ModeEmblems.js) in the same ringed badge;
// then the way on to the next mode.

const PATH = [
  { key: "explore", label: "Explore", href: "/explore", color: "#8B95F6" },
  { key: "play", label: "Play", href: "/play", color: "#B9C0FF" },
  { key: "create", label: "Create", href: "/create", color: "#E8CFC0" },
  { key: "kinship", label: "Kinship", href: "/kinship", color: "#E9D29A" },
];
// About isn't one of the four stops, but wears the same look (Update 5.57).
const OTHER = { about: "#C9B8F0" };

export default function ModeLanding({ mode, title, subtitle, line, items, next }) {
  const at = PATH.findIndex((p) => p.key === mode);
  const color = PATH[at]?.color || OTHER[mode] || "#B9C0FF";
  const cols = items.length === 3 ? 3 : 2;
  return (
    <div className="mode" style={{ "--mode": color }}>
      <section className="mode-hero">
        <div className="mode-hero-text">
          <ol className="mode-path" aria-label="The four ways in">
            {PATH.map((p, i) => (
              <li key={p.key} className={i === at ? "mode-path-here" : ""} style={{ "--stop": p.color }}>
                <Link href={p.href}>
                  <span className="mode-path-dot" aria-hidden="true" />
                  <span className="mono">{p.label}</span>
                </Link>
              </li>
            ))}
          </ol>
          <h1 className="mode-title">{title}</h1>
          <div className="mono mode-subtitle">{subtitle}</div>
          <p className="mode-line">{line}</p>
        </div>
        {/* the orbit's badges are links too (Update 5.57): it pauses while
            the pointer is on it, so they can be caught */}
        <nav className="mode-orbit" aria-label={`${title}: places`}>
          <div className="mode-orbit-ring mode-orbit-ring-a" />
          <div className="mode-orbit-ring mode-orbit-ring-b" />
          <div className="mode-orbit-core" />
          <div className="mode-orbit-spin">
            {items.map((it, i) => {
              const a = (i / items.length) * 360;
              return (
                <div key={it.href} className="mode-orbit-slot" style={{ transform: `rotate(${a}deg) translate(var(--orbit-r)) rotate(${-a}deg)` }}>
                  <Link href={it.href} className="mode-orbit-badge" title={it.title} aria-label={it.title}>
                    <Emblem name={it.emblem} size={34} color={color} />
                    <span className="mono mode-orbit-name" aria-hidden="true">{it.title}</span>
                  </Link>
                </div>
              );
            })}
          </div>
        </nav>
      </section>

      <div className="mode-grid" style={{ "--cols": cols }}>
        {items.map((it, i) => (
          <Link key={it.href} href={it.href} className="mode-card" style={{ "--i": i }}>
            <span className="mode-badge" aria-hidden="true">
              <Emblem name={it.emblem} size={52} color={color} />
            </span>
            <span className="mode-card-body">
              <span className="wordmark mode-card-title">{it.unread ? <MessagesLabel label={it.title} /> : it.title}</span>
              <span className="mode-card-blurb">{it.blurb}</span>
              {it.tags && (
                <span className="mode-card-tags">
                  {it.tags.map((t) => <span key={t} className="mono">{t}</span>)}
                </span>
              )}
              <span className="mono mode-card-go">enter &rarr;</span>
            </span>
          </Link>
        ))}
      </div>

      {next && (
        <p className="mode-next">
          {next.line}{" "}
          <Link href={next.href} style={{ color: PATH.find((p) => p.href === next.href)?.color }}>{next.label} &rarr;</Link>
        </p>
      )}
    </div>
  );
}
