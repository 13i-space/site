import Link from "next/link";

export default function Nav() {
  return (
    <nav className="site-nav">
      <Link href="/" className="logo wordmark">
        13i
      </Link>
      <ul>
        <li><Link href="/book">Book</Link></li>
        <li><Link href="/music">Music</Link></li>
        <li><Link href="/oracle">Oracle</Link></li>
      </ul>
    </nav>
  );
}
