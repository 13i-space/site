import { callClaude, hasKey } from './claude';
/**
 * Fills a blank club from public sources. Every value it returns is marked
 * "Public - unconfirmed" with a source. Without an API key it returns nothing
 * and the club stays blank (all Needed), which is the honest result.
 */
export async function researchClub(club, website) {
    if (!hasKey())
        return;
        const fields = club.profile.filter(r => r[3] === 'need').map(r => r[1]);
    const tool = { name: 'save_profile', description: 'Save public facts about the club.', input_schema: { type: 'object', properties: {
                rows: { type: 'array', items: { type: 'object', properties: { field: { type: 'string', enum: fields }, value: { type: 'string' }, source: { type: 'string' } }, required: ['field', 'value', 'source'] } },
                primary_color: { type: 'string', description: 'hex, only if found' }, secondary_color: { type: 'string', description: 'hex, only if found' }
            }, required: ['rows'] } };
    const res = await callClaude({ maxTokens: 3000, feature: 'virtual-gm-setup',
        system: 'You research a local soccer club using public web sources and save only facts you can source. Never guess. Skip any field you cannot source. Do not collect sender, email or mailing-address fields.',
        tools: [tool, { type: 'web_search_20250305', name: 'web_search', max_uses: 6 }],
        messages: [{ role: 'user', content: `Club: ${club.team}${website ? ` (website: ${website})` : ''}. Find: identity, league, stadium, home city, attendance, social handles, brand colors. Then call save_profile.` }] });
    for (const b of res.content) {
        if (b.type === 'tool_use' && b.name === 'save_profile') {
            for (const r of b.input.rows || []) {
                const row = club.profile.find(p => p[1] === r.field && p[3] === 'need');
                if (row && r.value) {
                    row[2] = r.value;
                    row[3] = 'pub';
                }
            }
            const hex = /^#[0-9a-f]{6}$/i;
            if (hex.test(b.input.primary_color || ''))
                club.colors.primary = b.input.primary_color;
            if (hex.test(b.input.secondary_color || ''))
                club.colors.secondary = b.input.secondary_color;
        }
    }
}
