// Story of Self lives at 13i.space/story but shares nothing with 13i:
// no 13i nav, starfield, Lyra, colors or fonts. Everything for Story is in
// app/story, app/api/story and lib/story, so it can move to its own domain later.
import "./story.css";

export const metadata = {
  title: { default: "Story of Self", template: "%s · Story of Self" },
  description: "Own your story before your next chapter begins.",
  // Prototype: keep it out of search engines until Aaron signs off.
  robots: { index: false, follow: false },
  openGraph: { siteName: "Story of Self", title: "Story of Self", description: "Own your story before your next chapter begins." },
  icons: { icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Ccircle cx='16' cy='16' r='12' fill='none' stroke='%23C25B34' stroke-width='3'/%3E%3Ccircle cx='16' cy='4' r='3' fill='%23C25B34'/%3E%3C/svg%3E" },
};

export const viewport = { themeColor: "#F7F1E8" };

export default function StoryLayout({ children }) {
  return (
    <div className="sos">
      {/* Story's own fonts (13i loads Fraunces/Inter; Story uses Newsreader/Manrope) */}
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400;1,6..72,500&display=swap"
      />
      <header className="sos-top">
        <a href="/story" className="sos-brand">
          <span className="sos-brand-mark" aria-hidden="true" />
          Story <em>of</em> Self
        </a>
        <nav className="sos-top-links">
          <a href="/story/lesson-1">Lesson 1</a>
          <a href="/story/start">Account</a>
        </nav>
      </header>
      <main>{children}</main>
      <footer className="sos-foot">
        <p>
          Story of Self is a guided reflection program, not therapy or counseling. If you're struggling or
          not safe, call or text <strong>988</strong> (U.S.), or text <strong>HOME</strong> to <strong>741741</strong>. In an
          emergency, call 911.
        </p>
        <p className="sos-foot-small">
          Story of Self method © Aaron Donaghy · storyofself.com · Prototype preview
        </p>
      </footer>
    </div>
  );
}
