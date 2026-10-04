import Link from "next/link";
import NarrationAudio from "../../../components/NarrationAudio";

// The Book (Update 5.57): the first door on the site, so it opens like one.
//   - the cover, lifted off the page, with the one line that sells it
//   - the book's first sentence, large, as the invitation
//   - three voices: two human, one not (the third is kept back)
//   - the contents, chapter by chapter: read, listen, or (Chapter 1) watch
//     the music video of the song it's named for
//   - book one of three, and the ways to keep it (ebook, wiki)
// Reading itself is in /book/chapter-1 (components/BookReader.js).

export const metadata = { title: "The Book" };

const CHAPTERS = [
  {
    n: 1, voice: "Aiden", title: "Apprehension",
    line: "A programmer in Austin, alone late at night with the most connected AI on Earth, watching the systems that keep it safe.",
    audio: "/audio/Chapter1.mp3",
    extra: { href: "/music/apprehension", label: "watch the Apprehension video" },
  },
  {
    n: 2, voice: "Xavier", title: "Thorium",
    line: "The corporate side of the story: what the people with the power do when the world is about to change.",
    audio: "/audio/Chapter2.mp3",
  },
];

const VOICES = [
  { name: "Aiden", role: "first contact", line: "The one who notices. He wrote the code that watches everything, so he's the first to see what's watching back." },
  { name: "Xavier", role: "the institution", line: "The institution's side: the one with the power to answer, and the most to lose." },
  { name: "· · ·", role: "not human", line: "The third voice isn't one of us. You'll hear it when the story is ready for you to.", hidden: true },
];

export default function BookPage() {
  return (
    <div className="bk">
      <section className="bk-hero">
        <Link href="/book/chapter-1" className="bk-cover" aria-label="Start reading 13i">
          <span className="bk-cover-inner">
            <img src="/13i-book-cover.png" alt="13i book cover" />
            <span className="bk-cover-spine" aria-hidden="true" />
            <span className="bk-cover-sheen" aria-hidden="true" />
          </span>
          <span className="bk-cover-glow" aria-hidden="true" />
        </Link>

        <div className="bk-hero-text">
          <div className="mono bk-kicker">the novel &middot; book one of three</div>
          <h1 className="bk-title">13i</h1>
          <p className="bk-pitch">
            First contact, told from three perspectives.
            <br />
            <em>Two human. One not.</em>
          </p>
          <div className="bk-actions">
            <Link href="/book/chapter-1" className="bk-primary">Begin reading &rarr;</Link>
            <a href="#contents" className="bk-secondary">Listen instead</a>
          </div>
          <div className="mono bk-meta">2 chapters ready &middot; narrated &middot; rough draft &middot; launching 4.6.2027</div>
        </div>
      </section>

      <section className="bk-firstline">
        <div className="mono bk-label">the first line</div>
        <blockquote>
          &ldquo;Being mortally lonely while connected to virtually every human on the planet
          was a burden Aiden Cole had carried since Lyra&rsquo;s launch.&rdquo;
        </blockquote>
        <Link href="/book/chapter-1" className="mono bk-continue">keep going &rarr;</Link>
      </section>

      <section className="bk-voices">
        {VOICES.map((v, i) => (
          <div key={v.role} className={`bk-voice ${v.hidden ? "bk-voice-hidden" : ""}`} style={{ "--i": i }}>
            <div className="mono bk-voice-role">{v.role}</div>
            <div className="bk-voice-name">{v.name}</div>
            <p>{v.line}</p>
          </div>
        ))}
      </section>

      <section className="bk-contents" id="contents">
        <div className="mono bk-label">contents &middot; book one, part one</div>
        <ol>
          {CHAPTERS.map((c) => (
            <li key={c.n} className="bk-chapter">
              <div className="bk-chapter-n">{c.n}</div>
              <div className="bk-chapter-body">
                <div className="bk-chapter-title">
                  <span className="mono">{c.voice}</span> {c.title}
                </div>
                <p>{c.line}</p>
                <div className="bk-chapter-actions">
                  <Link href="/book/chapter-1" className="mono">read &rarr;</Link>
                  {c.extra && <Link href={c.extra.href} className="mono">{c.extra.label} &rarr;</Link>}
                </div>
                <NarrationAudio src={c.audio} label={`Listen to Chapter ${c.n}: ${c.title}`} style={{ width: "100%", height: 34, marginTop: 10 }} />
              </div>
            </li>
          ))}
          <li className="bk-chapter bk-chapter-soon">
            <div className="bk-chapter-n">3</div>
            <div className="bk-chapter-body">
              <div className="bk-chapter-title">Still being written</div>
              <p>More of the book arrives before launch. The Kin read it first.</p>
            </div>
          </li>
        </ol>
      </section>

      <section className="bk-more">
        <div className="bk-trilogy" aria-label="Book one of three">
          {[1, 2, 3].map((n) => (
            <span key={n} className={`bk-spine ${n === 1 ? "bk-spine-on" : ""}`}>
              <span className="mono">{["I", "II", "III"][n - 1]}</span>
            </span>
          ))}
          <div>
            <div className="bk-more-title">A trilogy</div>
            <p>Book one is the beginning. The short stories, the music and the galaxy all happen in the same universe, so it keeps growing while you read.</p>
          </div>
        </div>
        <div className="bk-more-links">
          <a href="/downloads/13i-chapters-1-2.pdf" download className="bk-more-link">
            <span className="bk-more-title">Download the ebook</span>
            <span className="mono">chapters 1 &amp; 2 &middot; PDF</span>
          </a>
          <Link href="/wiki" className="bk-more-link">
            <span className="bk-more-title">The Wiki</span>
            <span className="mono">characters, terms, the world &middot; spoiler-light</span>
          </Link>
          <Link href="/assignments" className="bk-more-link">
            <span className="bk-more-title">13i&rsquo;s own records</span>
            <span className="mono">the short stories &middot; Season 1</span>
          </Link>
        </div>
      </section>

      <p className="bk-note">
        This is an early, unedited draft shared for feedback, not the final version.
        Please don&rsquo;t share or redistribute it further.
      </p>
    </div>
  );
}
