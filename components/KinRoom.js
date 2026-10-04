import Link from "next/link";
import { Emblem } from "./ModeEmblems";

// The shared top of the three Kinship rooms - the Forum, the Kinbook and
// Messages (Update 5.57): the room's emblem in the gold Kinship badge, a
// big title, one warm line, and the three rooms as tabs so moving between
// them is one tap. Pages put their own content under it, inside .kr.

const ROOMS = [
  { key: "forum", href: "/forum", label: "Forum" },
  { key: "kinbook", href: "/kinbook", label: "Kinbook" },
  { key: "messages", href: "/messages", label: "Messages" },
];

export default function KinRoom({ room, title, line, back, unread = 0, children }) {
  return (
    <div className="kr">
      {back && <Link href={back.href} className="mono kr-back">&larr; {back.label}</Link>}
      <header className="kr-head">
        <span className="kr-badge" aria-hidden="true"><Emblem name={room} size={46} color="#E9D29A" /></span>
        <div className="kr-head-text">
          <div className="mono kr-kicker"><Link href="/kinship">kinship</Link> &middot; {room === "kinbook" ? "leave word" : room === "messages" ? "private" : "the meeting place"}</div>
          <h1 className="kr-title">{title}</h1>
          {line && <p className="kr-line">{line}</p>}
        </div>
      </header>
      <nav className="kr-tabs" aria-label="Kinship rooms">
        {ROOMS.map((r) => (
          <Link key={r.key} href={r.href} className={`mono ${r.key === room ? "kr-tab-on" : ""}`} aria-current={r.key === room ? "page" : undefined}>
            {r.label}{r.key === "messages" && unread > 0 && <span className="kr-dot">{unread}</span>}
          </Link>
        ))}
      </nav>
      {children}
    </div>
  );
}

// A round avatar: the picture, or the first letter in the Kinship colours
export function KinAvatar({ profile, size = 36 }) {
  const name = profile?.username || "?";
  return (
    <span className="kr-avatar" style={{ width: size, height: size, fontSize: Math.round(size * 0.4) }}>
      {profile?.avatar_url ? <img src={profile.avatar_url} alt="" /> : <span className="mono">{name[0].toUpperCase()}</span>}
    </span>
  );
}
