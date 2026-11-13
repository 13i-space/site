export const Chip = ({ k = '', children }) => <span className={`chip ${k}`}><i />{children}</span>;
export const Jersey = ({ a, lg }) => <span className={`jersey ${lg ? 'lg' : ''}`}>{a.num}</span>;
export const Head = ({ title, sub, right }) => (<div className="pagehead"><div><h1>{title}</h1>{sub ? <p>{sub}</p> : null}</div>{right}</div>);
export const stat = { pub: ['warn', 'Public, unconfirmed'], need: ['bad', 'Needed'], ok: ['good', 'Confirmed'] };
