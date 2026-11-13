import { AGENTS, PROFILE, PROSPECTS, PLAYERS, QUEUE } from './seed-data';
export function allOff() {
    return Object.fromEntries(AGENTS.map(a => [a.id, false]));
}
/** The Chupacabras workbook, as read on Nov 13 2026. Public facts are marked Public - unconfirmed. */
export function seedClub() {
    return {
        id: 'chupacabras',
        user: 'Paul',
        team: 'McKinney Chupacabras FC',
        real: true,
        colors: { primary: '#0B0F10', secondary: '#0E8C86' },
        profile: PROFILE,
        sender: { name: '', email: '', addr: '' },
        settings: { emailSystem: 'None', agentsOn: { ...allOff(), sponsorship: true }, weights: [0.4, 0.3, 0.3] },
        queue: QUEUE.map(q => ({ ...q, status: 'pending', sample: true, createdAt: new Date().toISOString() })),
        prospects: PROSPECTS.map(p => ({ name: p[0] + ', McKinney', category: p[1], score: p[2], channel: p[3], sample: true })),
        players: PLAYERS.map(p => ({ name: p[0], pos: p[1], r: p[2] })),
        logs: [],
        outbox: [],
    };
}
function hueColors(team) {
    let h = 0;
    for (const c of team)
        h = (h * 31 + c.charCodeAt(0)) % 360;
    const hsl = (hh, s, l) => {
        s /= 100;
        l /= 100;
        const k = (n) => (n + hh / 30) % 12, a = s * Math.min(l, 1 - l);
        const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
        return '#' + [f(0), f(8), f(4)].map(x => Math.round(x * 255).toString(16).padStart(2, '0')).join('');
    };
    return { primary: hsl((h + 200) % 360, 25, 9), secondary: hsl(h, 62, 38) };
}
/** A blank club: every field Needed except the default opt-out line. */
export function blankClub(id, user, team) {
    const fields = PROFILE.map(r => [r[0], r[1], '', 'need']);
    const optOut = fields.find(f => f[1] === 'Opt-out line');
    if (optOut) {
        optOut[2] = PROFILE.find(r => r[1] === 'Opt-out line')[2];
        optOut[3] = 'ok';
    }
    const name = fields.find(f => f[1] === 'Club name');
    if (name) {
        name[2] = team;
        name[3] = 'ok';
    }
    return {
        id, user, team, real: false, colors: hueColors(team), profile: fields,
        sender: { name: '', email: '', addr: '' },
        settings: { emailSystem: 'None', agentsOn: { ...allOff(), sponsorship: true }, weights: [0.4, 0.3, 0.3] },
        queue: [], prospects: [], players: [], logs: [], outbox: [],
    };
}
