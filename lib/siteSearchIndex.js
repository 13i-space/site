export const SITE_INDEX = [
  { title: "The Book", href: "/book", keywords: "book chapter read novel manuscript" },
  { title: "The Music", href: "/music", keywords: "music albums songs tracks listen" },
  { title: "Short Stories", href: "/assignments", keywords: "assignments stories archive read" },
  { title: "Write an Assignment", href: "/assignments/write", keywords: "write create story submit" },
  { title: "The Galaxy", href: "/galaxy", keywords: "galaxy map earth space" },
  { title: "Galaxy Facts", href: "/galaxy/facts", keywords: "galaxy facts stats size" },
  { title: "Galaxy Quiz", href: "/galaxy/quiz", keywords: "galaxy quiz trivia game score" },
  { title: "The Wiki", href: "/wiki", keywords: "wiki glossary characters terms lore aiden xavier lyra continuance" },
  { title: "The Oracle", href: "/oracle", keywords: "oracle chat talk ask 13i collective" },
  { title: "Games", href: "/games", keywords: "games arcade play" },
  { title: "NEMESIS Command", href: "/games/nemesis-command", keywords: "nemesis command game arcade" },
  { title: "Asteroid Belt", href: "/games/asteroid-belt", keywords: "asteroid belt game arcade ship" },
  { title: "13i vs NEMESIS", href: "/games/13i-vs-nemesis", keywords: "13i vs nemesis game defend earth" },
  { title: "Artifacts", href: "/artifacts", keywords: "artifacts puzzles" },
  { title: "The Ninefold", href: "/artifacts/ninefold", keywords: "ninefold puzzle wheel fortune answer" },
  { title: "The Cryptex", href: "/artifacts/cryptex", keywords: "cryptex puzzle lock combination transmission" },
  { title: "Forum", href: "/forum", keywords: "forum discuss talk community kin" },
  { title: "Guestbook", href: "/guestbook", keywords: "guestbook sign message wall" },
  { title: "Your Node", href: "/account", keywords: "account profile node settings username avatar" },
  { title: "Login", href: "/login", keywords: "login signup sign in password" },
  { title: "Explore", href: "/explore", keywords: "explore discover" },
  { title: "Play", href: "/play", keywords: "play games interactive" },
  { title: "Create", href: "/create", keywords: "create write make" },
  { title: "Kinship", href: "/kinship", keywords: "kinship community connect people" },
];

export function searchSite(query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return SITE_INDEX.filter(
    (item) => item.title.toLowerCase().includes(q) || item.keywords.includes(q)
  ).slice(0, 6);
}
