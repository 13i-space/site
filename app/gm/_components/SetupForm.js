'use client';
import { useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { startSetup } from '../../../lib/gm/actions';

const STEPS = ['Finding the club and its website', 'Pulling the logo and team colors', 'Filling in the club profile from public sources', 'Mapping the territory', 'Putting your starting eleven on the pitch', 'Assembling your front office'];

function Body({ defaultName, defaultTeam }) {
  const { pending } = useFormStatus();
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (!pending) { setStep(0); return; }
    const t = setInterval(() => setStep(s => Math.min(s + 1, STEPS.length - 1)), 1800);
    return () => clearInterval(t);
  }, [pending]);

  if (pending) {
    return (
      <>
        <div><div className="eyebrow">Setting up</div><h2 style={{ marginTop: 8 }}>Your front office</h2></div>
        <ul className="steps">
          {STEPS.map((t, i) => (
            <li key={t} className={i < step ? 'done' : i === step ? 'run' : ''}><span className="dot">{i < step ? '✓' : ''}</span>{t}</li>
          ))}
        </ul>
      </>
    );
  }
  return (
    <>
      <div><div className="eyebrow">Kick off</div><h2 style={{ marginTop: 8 }}>Who are you, and what team?</h2></div>
      <div className="grid" style={{ gap: 14 }}>
        <div><label htmlFor="name">Your name</label><input id="name" name="name" type="text" defaultValue={defaultName} autoComplete="off" /></div>
        <div><label htmlFor="team">Team name</label><input id="team" name="team" type="text" defaultValue={defaultTeam} autoComplete="off" /></div>
        <div><label htmlFor="website">Website (optional)</label><input id="website" name="website" type="text" placeholder="club website" autoComplete="off" /></div>
        <button className="btn primary lg" type="submit">Set up my front office</button>
      </div>
    </>
  );
}

export default function SetupForm(props) {
  return <form className="signup" action={startSetup}><Body {...props} /></form>;
}
