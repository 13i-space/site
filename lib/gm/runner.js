import { callClaude, MODEL as getModel, hasKey as keyOk } from './claude';
import { SKILLS } from './skills';
import { AG } from './seed-data';
export const hasKey = keyOk;
/** Rules the app enforces no matter what a skill says. */
const APP_RULES = `
You are running inside the Virtual GM web app, not a spreadsheet.
- The "Club Workbook" is the JSON below. Read it instead of searching for a Sheet. Never use a field whose status is "need".
- You cannot send, post, pay, sign or book anything. Anything that goes to another person is saved with the create_draft tool and waits for a human to approve it.
- Put [SENDER NEEDED] / [ADDRESS NEEDED] in drafts when the sender or address is empty. Prices only appear if a package is Confirmed (none are in this workbook yet).
- Use add_prospect to log a prospect and create_draft for each draft. Call finish once, last, with a short summary, the steps you took, and what is blocked.
- Be brief and specific. Do not invent facts, numbers, quotes or contacts.`;
const TOOLS = [
    { name: 'create_draft', description: 'Save one draft for human approval. Never sends.', input_schema: { type: 'object', properties: {
                to: { type: 'string' }, channel: { type: 'string', enum: ['email', 'web_form', 'phone_script', 'post', 'internal'] },
                subject: { type: 'string' }, body: { type: 'string' }, facts: { type: 'array', items: { type: 'string' }, description: 'Each fact used, with its source' },
                package: { type: 'string', description: 'Package, document type or purpose' }
            }, required: ['to', 'channel', 'subject', 'body', 'facts'] } },
    { name: 'add_prospect', description: 'Log a sponsor or group prospect.', input_schema: { type: 'object', properties: {
                name: { type: 'string' }, category: { type: 'string' }, score: { type: 'integer', minimum: 1, maximum: 5 },
                channel: { type: 'string', enum: ['Email', 'Web form', 'Phone'] }, hook: { type: 'string' }, source_url: { type: 'string' }
            },
            required: ['name', 'category', 'score', 'channel'] } },
    { name: 'finish', description: 'End the run with a report.', input_schema: { type: 'object', properties: {
                summary: { type: 'string' }, steps: { type: 'array', items: { type: 'string' } }, blocked: { type: 'array', items: { type: 'string' } }
            },
            required: ['summary', 'steps', 'blocked'] } },
];
const WEB = { type: 'web_search_20250305', name: 'web_search', max_uses: 6 };
const WEB_AGENTS = new Set(['sponsorship', 'tickets', 'partners', 'pr']);
async function skillText(agentId) {
    return SKILLS[AG[agentId].skill] || '';
}
function workbook(club) {
    return {
        club: club.team,
        profile: club.profile.map(([section, field, value, status]) => ({ section, field, value, status: status === 'ok' ? 'Confirmed' : status === 'pub' ? 'Public - unconfirmed' : 'Needed' })),
        settings: { emailSystem: club.settings.emailSystem, agentsOn: club.settings.agentsOn, ratingWeights: club.settings.weights },
        sender: club.sender,
        existingProspects: club.prospects.map(p => `${p.name} (${p.score})`),
        pendingDrafts: club.queue.filter(d => d.status === 'pending').length,
        players: club.players,
    };
}
export async function runAgent(club, agentId, instruction) {
    const agent = AG[agentId];
    if (!agent)
        throw new Error('Unknown agent');
    if (!club.settings.agentsOn[agentId])
        throw new Error(`${agent.name} is off. Turn it on first.`);
    return hasKey() ? live(club, agentId, instruction) : demo(club, agentId);
}
async function live(club, agentId, instruction) {
        const agent = AG[agentId];
    const system = `${await skillText(agentId)}\n\n---\n${APP_RULES}\n\nClub Workbook (JSON):\n${JSON.stringify(workbook(club), null, 1)}`;
    const tools = WEB_AGENTS.has(agentId) ? [...TOOLS, WEB] : TOOLS;
    const messages = [{ role: 'user', content: instruction || `Run your normal routine for ${club.team} now. Keep this run small: at most 5 prospects or drafts.` }];
    const drafts = [];
    const prospects = [];
    let report = { summary: '', steps: [], blocked: [] };
    let nextId = Math.max(0, ...club.queue.map(q => q.id)) + 1;
    for (let turn = 0; turn < 12; turn++) {
        const res = await callClaude({ system, tools, messages, maxTokens: 4000, feature: 'virtual-gm-' + agentId });
        messages.push({ role: 'assistant', content: res.content });
        const results = [];
        let done = false;
        for (const block of res.content) {
            if (block.type !== 'tool_use')
                continue;
            const i = block.input;
            if (block.name === 'create_draft') {
                const kind = i.channel === 'internal' ? 'in' : 'out';
                drafts.push({ id: nextId++, agent: agentId, to: i.to, ch: String(i.channel).replace('_', ' '), kind, pkg: i.package || '', subj: i.subject, facts: i.facts || [], body: i.body, status: 'pending', createdAt: new Date().toISOString() });
                results.push({ type: 'tool_result', tool_use_id: block.id, content: 'Saved as pending. A human must approve it.' });
            }
            else if (block.name === 'add_prospect') {
                prospects.push({ name: i.name, category: i.category, score: i.score, channel: i.channel, hook: i.hook, source: i.source_url });
                results.push({ type: 'tool_result', tool_use_id: block.id, content: 'Logged.' });
            }
            else if (block.name === 'finish') {
                report = { summary: i.summary, steps: i.steps || [], blocked: i.blocked || [] };
                done = true;
                results.push({ type: 'tool_result', tool_use_id: block.id, content: 'Run recorded.' });
            }
        }
        if (done || (res.stop_reason === 'end_turn' && !results.length))
            break;
        if (res.stop_reason === 'pause_turn')
            continue;
        if (results.length)
            messages.push({ role: 'user', content: results });
    }
    const log = { id: crypto.randomUUID(), agent: agentId, at: new Date().toISOString(), mode: 'live',
        summary: report.summary || `${agent.name} finished.`, steps: report.steps, blocked: report.blocked, drafts: drafts.length };
    return { log, drafts, prospects };
}
/** No API key: replay the agent's canned steps so the app is fully clickable. */
async function demo(club, agentId) {
    const agent = AG[agentId];
    const log = { id: crypto.randomUUID(), agent: agentId, at: new Date().toISOString(), mode: 'demo',
        summary: `Demo run. Add ANTHROPIC_API_KEY to run ${agent.name} for real.`, steps: agent.run, blocked: agent.needs.slice(0, 3), drafts: 0 };
    return { log, drafts: [], prospects: [] };
}
