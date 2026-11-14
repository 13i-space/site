import Link from 'next/link';
import { AGENTS } from '../../../lib/gm/seed-data';
import { SCHEDULES } from '../../../lib/gm/text';

/** The 4-4-2. Filled volt circles are agents that are on; dashed outlines are off. */
export default function Pitch({ on, schedule, links = true, allOn = false }) {
  return (
    <div className="pitch">
      <svg className="lines" viewBox="0 0 160 90" preserveAspectRatio="none" aria-hidden="true" fill="none" stroke="#ffffffaa" strokeWidth=".45">
        <rect x="3" y="3" width="154" height="84" /><line x1="80" y1="3" x2="80" y2="87" /><circle cx="80" cy="45" r="11" /><circle cx="80" cy="45" r=".8" fill="#ffffffaa" />
        <rect x="3" y="22" width="20" height="46" /><rect x="3" y="33" width="7" height="24" /><rect x="137" y="22" width="20" height="46" /><rect x="150" y="33" width="7" height="24" />
        <path d="M23 36a11 11 0 0 1 0 18M137 36a11 11 0 0 0 0 18" />
      </svg>
      {AGENTS.map(a => {
        const isOn = allOn || on?.[a.id];
        const inner = (<>
          <span className={`jersey ${isOn ? 'on' : ''}`}>{a.num}</span>
          <span className="nm">{a.name}</span>
          {isOn && schedule && schedule[a.id] && schedule[a.id] !== 'manual' ? <span className="sc">{SCHEDULES[schedule[a.id]]}</span> : null}
        </>);
        const style = { left: `${a.x}%`, top: `${a.y}%` };
        return links
          ? <Link key={a.id} className={`pos ${isOn ? 'on' : 'off'}`} style={style} href={`/gm/agents/${a.id}`}>{inner}</Link>
          : <span key={a.id} className={`pos ${isOn ? 'on' : 'off'}`} style={style}>{inner}</span>;
      })}
    </div>
  );
}
