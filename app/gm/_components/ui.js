import { initials } from '../../../lib/gm/text';

export const Chip = ({ k = '', children }) => <span className={`chip ${k}`}><i />{children}</span>;
export const Jersey = ({ a, lg, on }) => <span className={`jersey ${lg ? 'lg' : ''} ${on ? 'on' : ''}`}>{a.num}</span>;
export const Head = ({ title, sub, right }) => (<div className="pagehead"><div><h1>{title}</h1>{sub ? <p>{sub}</p> : null}</div>{right}</div>);
export const stat = { pub: ['warn', 'Public, unconfirmed'], need: ['bad', 'Needed'], ok: ['good', 'Confirmed'] };
export const Pips = ({ n }) => <span className="pips" aria-label={`${n} out of 5`}>{[1, 2, 3, 4, 5].map(i => <i key={i} className={i <= n ? 'f' : ''} />)}</span>;
export const Crest = ({ club, big }) => club.logo
    ? <span className={big ? 'bigcrest' : 'crest'}><img src={club.logo} alt="" /></span>
    : <span className={big ? 'bigcrest' : 'crest'}>{initials(club.team)}</span>;

/** The Virtual GM mark: a shield with a ball panel. */
export const Mark = () => (
  <svg viewBox="0 0 32 36" aria-hidden="true">
    <path d="M16 1 3 6v11c0 9 6 15 13 18 7-3 13-9 13-18V6L16 1Z" fill="#C9F23A" />
    <path d="M16 9.4l5.2 3.8-2 6.1h-6.4l-2-6.1L16 9.4Z" fill="#08162B" />
    <path d="M16 9.4V5.6M21.2 13.2l3.6-1.2M19.2 19.3l2.4 3.1M12.8 19.3l-2.4 3.1M10.8 13.2 7.2 12" stroke="#08162B" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);
export const Brand = ({ href = '/gm/brief' }) => <a className="brand" href={href}><Mark /><b>VIRTUAL GM</b></a>;
