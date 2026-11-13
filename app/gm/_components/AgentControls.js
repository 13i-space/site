'use client';
import { useState, useTransition } from 'react';
import { toggleAgent, runAgentAction } from '../../../lib/gm/actions';
export function AgentSwitch({ id, name, on }) {
    const [, go] = useTransition();
    const [v, setV] = useState(on);
    return <button className="switch" role="switch" aria-checked={v} aria-label={`Turn ${name} on`} onClick={() => { setV(!v); go(() => toggleAgent(id, !v)); }}/>;
}
export function RunPanel({ id, on, key_ }) {
    const [busy, go] = useTransition();
    const [err, setErr] = useState('');
    return (<div className="row">
      <button className="btn primary sm" disabled={busy || !on} onClick={() => go(async () => { setErr(''); const r = await runAgentAction(id); if (!r.ok)
        setErr(r.error || 'Run failed'); })}>{busy ? 'Running…' : key_ ? 'Run now' : 'Run (demo)'}</button>
      {!on ? <span className="small mute">Turn the agent on first.</span> : null}
      {err ? <span className="small" style={{ color: 'var(--bad)' }}>{err}</span> : null}
    </div>);
}
