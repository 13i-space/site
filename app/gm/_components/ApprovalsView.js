'use client';
import { useState, useTransition } from 'react';
import { setDraftStatus, editDraft, sendApproved, markSent } from '../../../lib/gm/actions';
import { fill, senderMissing, gmailLink, mailtoLink } from '../../../lib/gm/text';

function Highlight({ text }) {
    const parts = text.split(/(\[[A-Z][A-Z ]+\])/g);
    return <>{parts.map((p, i) => /^\[[A-Z][A-Z ]+\]$/.test(p) ? <span key={i} className="ph">{p}</span> : <span key={i}>{p}</span>)}</>;
}
const GROUPS = [
    ['hot', 'Replies and hot leads: answer these first'],
    ['rev', 'Revenue: sponsors and groups'],
    ['rest', 'Everything else'],
];
const groupOf = (x) => x.kind === 'reply' ? 'hot' : x.rank <= 2 ? 'rev' : 'rest';

export default function ApprovalsView({ items, sender, first }) {
    const [sel, setSel] = useState(first ?? items.find(i => i.status === 'pending')?.id ?? items[0]?.id);
    const [edit, setEdit] = useState(false);
    const [text, setText] = useState('');
    const [modal, setModal] = useState(null);
    const [busy, go] = useTransition();
    const cur = items.find(i => i.id === sel) ?? items[0];
    const approved = items.filter(i => i.status === 'approved' && i.kind !== 'in').length;
    const next = (after) => { const n = items.find(i => i.status === 'pending' && i.id !== after); if (n)
        setSel(n.id); };
    const miss = senderMissing(sender);
    if (!items.length)
        return <div className="card"><h3>Nothing to approve</h3><p className="mute" style={{ marginTop: 6 }}>Run an agent from the team page and its drafts land here.</p></div>;
    const body = fill(cur.body, sender);
    const canMail = cur.toEmail && cur.kind !== 'in';
    const locked = cur.status === 'released';
    let lastGroup = '';
    return (<>
      <div className="row" style={{ justifyContent: 'flex-end', marginBottom: 14 }}>
        <button className="btn dark" disabled={!approved} onClick={() => setModal(miss.length ? { message: `Sending is blocked. Missing: ${miss.join(', ')}.` } : { confirm: true, message: `Release ${approved} approved drafts? This is the one confirmation.` })}>Send approved ({approved})</button>
      </div>
      <div className="split">
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {items.map(x => {
            const g = groupOf(x);
            const head = g !== lastGroup ? GROUPS.find(k => k[0] === g)[1] : null;
            lastGroup = g;
            return (<div key={x.id}>
              {head ? <div className={`qgroup ${g === 'hot' ? 'hot' : ''}`}>{head}</div> : null}
              <button className="qitem" aria-current={x.id === cur.id} onClick={() => { setSel(x.id); setEdit(false); }}>
                <span className="jersey on" style={{ width: 34, height: 34, fontSize: 16, borderWidth: 2, boxShadow: 'none' }}>{x.agentNum}</span>
                <span style={{ flex: 1, minWidth: 0 }}><b style={{ display: 'block', lineHeight: 1.25 }}>{x.to}</b><span className="small mute">{x.agentName} · {x.ch}</span></span>
                <span className={`chip ${x.status === 'approved' || x.status === 'released' ? 'good' : x.status === 'skipped' ? '' : 'warn'}`}><i />{x.status === 'pending' ? 'Review' : x.status === 'released' ? 'Sent' : x.status === 'approved' ? 'Approved' : 'Skipped'}</span>
              </button></div>);
          })}
        </div>
        <section className="card" style={{ display: 'grid', gap: 14 }}>
          <div className="row spread">
            <div><div className="eyebrow">{cur.agentName} · {cur.pkg}</div><h3 style={{ marginTop: 6 }}>{cur.subj}</h3></div>
            <span className={`chip ${cur.kind === 'in' ? '' : cur.kind === 'reply' ? 'bad' : 'warn'}`}><i />{cur.kind === 'in' ? 'Internal only' : cur.kind === 'reply' ? 'Reply: revenue' : 'Outbound: needs your yes'}</span>
          </div>
          <div className="tofield"><span><b>To:</b> {cur.to}</span>{cur.toEmail ? <span><b>Email:</b> {cur.toEmail}</span> : null}<span className="mute">Channel: {cur.ch}{cur.sample ? ' · sample' : ''}</span></div>
          {edit
            ? <textarea aria-label="Edit draft" value={text} onChange={e => setText(e.target.value)}/>
            : <div className="draft"><Highlight text={body}/></div>}
          <div><div className="eyebrow" style={{ marginBottom: 6 }}>Facts used</div><ul className="tidy small">{cur.facts.map((f, i) => <li key={i}>{f}</li>)}</ul></div>
          <div className="row">
            <button className="btn primary" disabled={busy || locked} onClick={() => go(async () => { await setDraftStatus(cur.id, 'approved'); setEdit(false); next(cur.id); })}>Approve</button>
            <button className="btn" disabled={busy || locked} onClick={() => { if (edit)
        go(async () => { await editDraft(cur.id, text); setEdit(false); });
    else {
        setText(body);
        setEdit(true);
    } }}>{edit ? 'Save edit' : 'Edit'}</button>
            <button className="btn" disabled={busy || locked} onClick={() => go(async () => { await setDraftStatus(cur.id, 'skipped'); next(cur.id); })}>Skip</button>
          </div>
          {canMail && cur.status === 'approved' && !miss.length ? (
            <div className="row" style={{ borderTop: '1px solid var(--line)', paddingTop: 12 }}>
              <a className="btn primary" target="_blank" rel="noreferrer" href={gmailLink(cur.toEmail, cur.subj, body)}>Open in Gmail</a>
              <a className="btn" href={mailtoLink(cur.toEmail, cur.subj, body)}>Open in mail app</a>
              <button className="btn" disabled={busy} onClick={() => go(async () => { await markSent(cur.id); next(cur.id); })}>Mark as sent</button>
              <span className="small mute">Addressed and ready. You press send.</span>
            </div>) : canMail && cur.status === 'approved' ? <p className="small mute">Add sender details on the Club workbook page to open this in your email.</p> : null}
        </section>
      </div>
      {modal && (<div className="modal" onClick={() => setModal(null)}>
          <div className="card" role="dialog" aria-modal="true" onClick={e => e.stopPropagation()} style={{ display: 'grid', gap: 12 }}>
            <h3>{modal.confirm ? `Send ${approved} approved drafts?` : modal.ok ? 'Done' : 'Sending is blocked'}</h3>
            <p>{modal.message}</p>
            <div className="row">
              {modal.confirm
                ? <><button className="btn primary" disabled={busy} onClick={() => go(async () => setModal(await sendApproved()))}>Confirm and send</button><button className="btn" onClick={() => setModal(null)}>Cancel</button></>
                : <><button className="btn primary" onClick={() => setModal(null)}>Close</button></>}
            </div>
          </div>
        </div>)}
    </>);
}
