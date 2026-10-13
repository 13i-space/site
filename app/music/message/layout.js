// The hidden original Apprehension film (Update 5.81): keep it out of search results.
export const metadata = {
  title: "13i",
  robots: { index: false, follow: false },
};

export default function MessageLayout({ children }) {
  return children;
}
