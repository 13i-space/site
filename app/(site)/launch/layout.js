// Metadata for /launch (the page itself is a client component).
const description = "A signal, translated. 13i is a science-fiction universe still arriving: a novel and its music, short stories, the galaxy they happen in, an Oracle, games, and places to create your own. Launching April 6, 2027.";

export const metadata = {
  title: "13i · a signal, translated",
  description,
  alternates: { canonical: "/launch" },
  openGraph: { title: "13i · a signal, translated", description, url: "/launch" },
};

export default function LaunchLayout({ children }) {
  return children;
}
