'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Nav({ pending, on }) {
    const p = usePathname();
    const item = (href, label, badge) => {
        const cur = p === href || (href === '/gm/team' && p.startsWith('/gm/agents'));
        return (<Link href={href} aria-current={cur ? 'page' : undefined}>
        {label}{badge ? <span className="badge">{badge}</span> : null}
      </Link>);
    };
    const work = [
        on.sponsorship && ['/gm/pipeline', 'Sponsor pipeline'],
        on.tickets && ['/gm/groups', 'Tickets & groups'],
        on.partners && ['/gm/vendors', 'Partners & vendors'],
        on.team && ['/gm/roster', 'Roster & tryouts'],
        ['/gm/club', 'Club workbook'],
    ].filter(Boolean);
    return (<nav className="nav" aria-label="Main">
      <div className="lbl">Office</div>
      {item('/gm/brief', 'Daily brief')}{item('/gm/approvals', 'Approvals', pending)}{item('/gm/team', 'Meet the team')}
      <div className="lbl">Work</div>
      {work.map(w => item(w[0], w[1]))}
      <div className="lbl">Demo</div>
      <Link href="/gm">Front door</Link>
    </nav>);
}
