// Story of Self lives at 13i.space/story but shares nothing with 13i:
// no 13i nav, starfield, Lyra, colors or fonts. Everything for Story is in
// app/story, app/api/story and lib/story, so it can move to its own domain later.
import "./story.css";
import "./site.css";
import SiteHeader from "./_components/SiteHeader";
import SiteFooter from "./_components/SiteFooter";

export const metadata = {
  title: { default: "Story of Self", template: "%s · Story of Self" },
  description: "Story of Self: a guided journey for the year after high school. Own your story before the next chapter begins.",
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
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}
