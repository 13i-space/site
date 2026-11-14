export const fill = (t, s) => t.replace(/\{sender\}/g, s.name.trim() || '[SENDER NEEDED]').replace(/\{addr\}/g, s.addr.trim() || '[ADDRESS NEEDED]');
export const ovr = (r, w) => Math.round(r[0] * w[0] + r[1] * w[1] + r[2] * w[2]);
export const senderMissing = (s) => [!s.name.trim() && 'sender name', !s.email.trim() && 'sender email', !s.addr.trim() && 'club mailing address'].filter(Boolean);
export const onColor = (hex) => {
    const c = hex.replace('#', '');
    const l = (parseInt(c.slice(0, 2), 16) * 299 + parseInt(c.slice(2, 4), 16) * 587 + parseInt(c.slice(4, 6), 16) * 114) / 1000;
    return l > 150 ? '#0B0F10' : '#FFFFFF';
};
export const initials = (team) => team.replace(/\b(fc|sc|cf|usl|league|two)\b/gi, '').split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase() || 'FC';
export const TZ = 'America/Chicago';
export const dayKey = (iso) => new Date(iso).toLocaleDateString('en-CA', { timeZone: TZ });
export const isToday = (iso) => !!iso && dayKey(iso) === dayKey(new Date().toISOString());
export const SCHEDULES = { daily: 'Every morning', weekly: 'Every Monday', manual: 'Manual only' };
const HOURS = { daily: 20, weekly: 24 * 6.5 };
/** Is a scheduled agent due? On, scheduled, and not run within its interval. */
export function isDue(club, id) {
    const mode = club.settings.schedule[id] || 'manual';
    if (!club.settings.agentsOn[id] || mode === 'manual')
        return false;
    const last = club.logs.find(l => l.agent === id && l.mode === 'live');
    if (!last)
        return true;
    return (Date.now() - new Date(last.at).getTime()) / 36e5 > HOURS[mode];
}
export function nextRun(club, id) {
    const mode = club.settings.schedule[id] || 'manual';
    if (!club.settings.agentsOn[id])
        return 'Off';
    if (mode === 'manual')
        return 'When you press Run';
    return isDue(club, id) ? 'Due now' : mode === 'daily' ? 'Tomorrow morning' : 'Next Monday';
}
const enc = encodeURIComponent;
export const gmailLink = (to, subj, body) => `https://mail.google.com/mail/?view=cm&fs=1&to=${enc(to)}&su=${enc(subj)}&body=${enc(body)}`;
export const mailtoLink = (to, subj, body) => `mailto:${to}?subject=${enc(subj)}&body=${enc(body)}`;
export const normName = (n) => n.toLowerCase().replace(/&/g, 'and').replace(/\b(llc|inc|co|company|corp|the|of|mckinney|tx|texas|pllc|pc|dds|md)\b/g, '').replace(/[^a-z0-9]+/g, '');
