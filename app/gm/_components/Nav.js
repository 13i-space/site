'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
export default function Nav({ pending }) {
    const p = usePathname();
    const item = (href, label, badge) => {
        const on = p === href || (href === '/gm/team' && p.startsWith('/gm/agents'));
        return (<Link href={href} aria-current={on ? 'page' : undefined}>
        {label}{badge ? <span className="badge">{badge}</span> : null}
      </Link>);
    };
    return (<nav className="nav" aria-label="Main">
      <div className="lbl">Office</div>
      {item('/gm/brief', 'Daily brief')}{item('/gm/approvals', 'Approvals', pending)}{item('/gm/team', 'Meet the team')}
      <div className="lbl">Work</div>
      {item('/gm/pipeline', 'Sponsor pipeline')}{item('/gm/roster', 'Roster and tryouts')}{item('/gm/club', 'Club workbook')}
      <div className="lbl">Demo</div>
      <Link href="/gm">Front door</Link>
    </nav>);
}
