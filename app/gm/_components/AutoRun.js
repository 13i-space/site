'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { dueAgents, runAgentAction } from '../../../lib/gm/actions';

/** Runs whatever is scheduled and due when the office opens, one agent at a time, with a visible banner. */
export default function AutoRun({ names }) {
  const router = useRouter();
  const started = useRef(false);
  const [state, setState] = useState(null);
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    let stamp = 0;
    try { stamp = Number(sessionStorage.getItem('gm_auto') || 0); } catch {}
    if (Date.now() - stamp < 10 * 60 * 1000) return;
    (async () => {
      const due = await dueAgents();
      if (!due.length) return;
      try { sessionStorage.setItem('gm_auto', String(Date.now())); } catch {}
      const done = [];
      for (const id of due) {
        setState({ running: names[id], done });
        const r = await runAgentAction(id);
        done.push(r.ok ? `${names[id]}: ${r.summary}` : `${names[id]} could not run (${r.error})`);
        if (!r.ok) break;
      }
      setState({ finished: true, done });
      router.refresh();
    })();
  }, [names, router]);
  if (!state) return null;
  return (
    <div className="notice" role="status" style={{ background: state.finished ? '#EAF6D2' : '#FFF7E3', borderColor: state.finished ? '#B7DB6B' : '#EBD79B' }}>
      <b>{state.finished ? 'Morning run done.' : `Morning run: ${state.running} is working…`}</b>
      <span>{state.done.length ? state.done.join(' · ') : 'Your scheduled agents are catching up. This takes about a minute each.'}</span>
    </div>
  );
}
