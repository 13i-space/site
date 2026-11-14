'use client';
import { useState, useTransition } from 'react';
import { toggleAgent, runAgentAction, setSchedule, setGoal } from '../../../lib/gm/actions';

export function AgentSwitch({ id, name, on }) {
    const [, go] = useTransition();
    const [v, setV] = useState(on);
    return <button className="switch" role="switch" aria-checked={v} aria-label={`Turn ${name} on`} onClick={() => { setV(!v); go(() => toggleAgent(id, !v)); }}/>;
}
export function RunPanel({ id, on, live, label }) {
    const [busy, go] = useTransition();
    const [msg, setMsg] = useState('');
    const [err, setErr] = useState('');
    return (<div className="row">
      <button className="btn primary" disabled={busy || !on} onClick={() => go(async () => { setErr(''); setMsg(''); const r = await runAgentAction(id); if (r.ok) setMsg(r.summary || 'Done.'); else setErr(r.error || 'Run failed'); })}>{busy ? 'Working… up to a minute' : label || (live ? 'Run now' : 'Run (demo)')}</button>
      {!on ? <span className="small mute">Turn the agent on first.</span> : null}
      {msg && !busy ? <span className="small" style={{ color: 'var(--green)', fontWeight: 600 }}>{msg}</span> : null}
      {err ? <span className="small" style={{ color: 'var(--bad)' }}>{err}</span> : null}
    </div>);
}
export function ScheduleSelect({ id, value }) {
    const [, go] = useTransition();
    const [v, setV] = useState(value);
    return (<select aria-label="Schedule" value={v} style={{ width: 'auto' }} onChange={e => { setV(e.target.value); go(() => setSchedule(id, e.target.value)); }}>
      <option value="daily">Every morning</option><option value="weekly">Every Monday</option><option value="manual">Manual only</option>
    </select>);
}
export function GoalSelect({ id, value }) {
    const [, go] = useTransition();
    const [v, setV] = useState(value);
    return (<select aria-label="Daily lead goal" value={v} style={{ width: 'auto' }} onChange={e => { setV(+e.target.value); go(() => setGoal(id, +e.target.value)); }}>
      {[5, 10, 15, 20].map(n => <option key={n} value={n}>{n} leads a day</option>)}
    </select>);
}
