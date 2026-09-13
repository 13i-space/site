import Link from "next/link";

export default function Nav() {
  return (
    <nav className="site-nav">
      <Link href="/launch" className="logo wordmark">
        13i
      </Link>
      <ul>
        <li><Link href="/book">Book</Link></li>
        <li><Link href="/music">Music</Link></li>
        <li><Link href="/oracle">Oracle</Link></li>
        <li className="nav-dropdown">
          <Link href="/games">Games</Link>
          <div className="nav-dropdown-menu">
            <ul className="nav-dropdown-menu-inner">
              <li><Link href="/games/nemesis-command">NEMESIS Command</Link></li>
              <li><Link href="/games/13i-vs-nemesis">13i vs NEMESIS</Link></li>
            </ul>
          </div>
        </li>
        <li className="nav-dropdown">
          <Link href="/artifacts">Artifacts</Link>
          <div className="nav-dropdown-menu">
            <ul className="nav-dropdown-menu-inner">
              <li><Link href="/artifacts/ninefold">The Ninefold</Link></li>
              <li><Link href="/artifacts/cryptex">The Cryptex</Link></li>
            </ul>
          </div>
        </li>
        <li><Link href="/wiki">Wiki</Link></li>
        <li><Link href="/assignments">Assignments</Link></li>
        <li><Link href="/galaxy">Galaxy</Link></li>
      </ul>
    </nav>
  );
}
