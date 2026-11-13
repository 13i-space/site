export const fill = (t, s) => t.replace(/\{sender\}/g, s.name.trim() || '[SENDER NEEDED]').replace(/\{addr\}/g, s.addr.trim() || '[ADDRESS NEEDED]');
export const ovr = (r, w) => Math.round(r[0] * w[0] + r[1] * w[1] + r[2] * w[2]);
export const senderMissing = (s) => [!s.name.trim() && 'sender name', !s.email.trim() && 'sender email', !s.addr.trim() && 'club mailing address'].filter(Boolean);
export const onColor = (hex) => {
    const c = hex.replace('#', '');
    const l = (parseInt(c.slice(0, 2), 16) * 299 + parseInt(c.slice(2, 4), 16) * 587 + parseInt(c.slice(4, 6), 16) * 114) / 1000;
    return l > 150 ? '#0B0F10' : '#FFFFFF';
};
