import { AGENTS, PROFILE, PROSPECTS, GROUP_PROSPECTS, PLAYERS, QUEUE } from './seed-data';

export const DEFAULT_ON = { gm: true, sponsorship: true, tickets: true };
export const DEFAULT_SCHEDULE = { gm: 'daily', sponsorship: 'daily', tickets: 'daily', partners: 'weekly', marketing: 'weekly', team: 'weekly' };
export const DEFAULT_GOALS = { sponsorship: 10, tickets: 10 };

export function defaultOn() {
    return Object.fromEntries(AGENTS.map(a => [a.id, !!DEFAULT_ON[a.id]]));
}
export function defaultSchedule() {
    return Object.fromEntries(AGENTS.map(a => [a.id, DEFAULT_SCHEDULE[a.id] || 'manual']));
}
/** Fill in anything a club saved by an earlier version is missing. */
export function normalize(c) {
    c.settings ||= {};
    c.settings.agentsOn = { ...defaultOn(), ...c.settings.agentsOn };
    c.settings.schedule = { ...defaultSchedule(), ...c.settings.schedule };
    c.settings.goals = { ...DEFAULT_GOALS, ...c.settings.goals };
    c.settings.weights ||= [0.4, 0.3, 0.3];
    c.settings.emailSystem ||= 'None';
    c.profile = (c.profile || []).filter(r => r[1] !== 'Opt-out line');
    c.prospects = (c.prospects || []).map(p => ({ pipeline: 'sponsor', ...p }));
    c.queue ||= []; c.outbox ||= []; c.logs ||= []; c.players ||= [];
    c.logo ||= '';
    return c;
}
const sampleDrafts = () => QUEUE.map(q => ({ ...q, status: 'pending', sample: true, createdAt: new Date().toISOString() }));
const sampleProspects = () => [
    ...PROSPECTS.map(p => ({ pipeline: 'sponsor', name: p[0] + ', McKinney', category: p[1], score: p[2], channel: p[3], sample: true })),
    ...GROUP_PROSPECTS.map(p => ({ pipeline: 'group', name: p[0], category: p[1], score: p[2], channel: p[3], ring: p[4], sample: true })),
];
/** The Chupacabras workbook, as read on Nov 13 2026. Public facts are marked Public - unconfirmed. */
export function seedClub() {
    return normalize({
        id: 'chupacabras', user: 'Paul', team: 'McKinney Chupacabras FC', real: true,
        colors: { primary: '#0B0F10', secondary: '#0E8C86' },
        profile: PROFILE, sender: { name: '', email: '', addr: '' },
        settings: {}, queue: sampleDrafts(), prospects: sampleProspects(),
        players: PLAYERS.map(p => ({ name: p[0], pos: p[1], r: p[2] })), logs: [], outbox: [],
    });
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
/** A blank club: every field Needed except the club name. */
export function blankClub(id, user, team) {
    const fields = PROFILE.map(r => [r[0], r[1], '', 'need']);
    const name = fields.find(f => f[1] === 'Club name');
    if (name) { name[2] = team; name[3] = 'ok'; }
    return normalize({
        id, user, team, real: false, colors: hueColors(team), profile: fields,
        sender: { name: '', email: '', addr: '' }, settings: {},
        queue: [], prospects: [], players: [], logs: [], outbox: [],
    });
}
