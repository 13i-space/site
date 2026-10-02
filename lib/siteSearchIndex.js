export const SITE_INDEX = [
  { title: "The Book", href: "/book", keywords: "book chapter read novel manuscript" },
  { title: "The Music", href: "/music", keywords: "music albums songs tracks listen" },
  { title: "Short Stories", href: "/assignments", keywords: "assignments stories archive read" },
  { title: "Interactive Assignments", href: "/assignments/interactive", keywords: "interactive visual novel choices choose story branching endings play 13i" },
  { title: "The Deep Walkers (Interactive)", href: "/assignments/87/interactive", keywords: "deep walkers veyra interactive visual novel choices endings archive ancestors stone ridge" },
  { title: "The Quiet Moon (Interactive)", href: "/assignments/28657/interactive", keywords: "quiet moon tacet interactive visual novel holders silence touch lattice season" },
  { title: "TACET", href: "/games/tacet", keywords: "tacet game quiet moon holders lattice silence shocks young" },
  { title: "Nerath's Secret (Interactive)", href: "/assignments/215783/interactive", keywords: "nerath secret interactive visual novel choices endings elder limbs nerathi" },
  { title: "Write an Assignment", href: "/assignments/write", keywords: "write create story submit" },
  { title: "SpaceCore", href: "/create/spacecore", keywords: "spacecore mars build universe mining dig colony cooperative great work xavier rig drill game create" },
  { title: "Signal Composer", href: "/create/signal-composer", keywords: "music compose composer generate synth song loop create" },
  { title: "The Alien Lab", href: "/create/alien-lab", keywords: "alien species generator create build creature" },
  { title: "The Galaxy", href: "/galaxy", keywords: "galaxy map earth space" },
  { title: "Galaxy Map", href: "/galaxy/map", keywords: "galaxy map earth planets worlds veyra nerath arms" },
  { title: "Aliens of the Galaxy", href: "/galaxy/aliens", keywords: "aliens gallery species cards alien lab creatures" },
  { title: "Space News", href: "/galaxy/news", keywords: "space news nasa esa headlines launch rss" },
  { title: "Galaxy Facts", href: "/galaxy/facts", keywords: "galaxy facts stats size" },
  { title: "Universe Quiz", href: "/quiz", keywords: "universe galaxy quiz trivia game score grade" },
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
  { title: "Messages", href: "/messages", keywords: "messages private message dm inbox chat write kin" },
  { title: "Kinbook", href: "/kinbook", keywords: "kinbook guestbook message wall kin post" },
  { title: "About Paul", href: "/about/paul", keywords: "about paul donaghy author creator bio" },
  { title: "The Origin of 13i", href: "/about/origin", keywords: "origin story how 13i began zybrex music" },
  { title: "Mission & Values", href: "/about/mission", keywords: "mission values kin kinship explore play create" },
  { title: "Contact Paul", href: "/contact", keywords: "contact email message paul" },
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
