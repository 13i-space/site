import { callClaude, hasKey as keyOk } from './claude';
import { SKILLS } from './skills';
import { AG } from './seed-data';
import { LANES, LEAD_AGENTS, LEAD_RULES, RINGS, RING_FILL } from './lanes';
import { normName } from './text';

export const hasKey = keyOk;

/** Rules the app enforces no matter what a skill says. */
const APP_RULES = `
You are running inside the Virtual GM web app, not a spreadsheet.
- The "Club Workbook" is the JSON below. Read it instead of searching for a Sheet. Never use a field whose status is "Needed".
- You cannot send, post, pay, sign or book anything. Anything that goes to another person is saved with a tool and waits for a human to approve it.
- In drafts, write the literal tokens {sender} (sender name) and {addr} (club mailing address); the app fills them in. Prices appear only if a package is Confirmed (none are yet).
- Be brief and specific. Do not invent facts, numbers, quotes or contacts.`;

const draftTool = { name: 'create_draft', description: 'Save one draft for human approval. Never sends.', input_schema: { type: 'object', properties: {
            to: { type: 'string' }, channel: { type: 'string', enum: ['email', 'web_form', 'phone_script', 'post', 'internal'] },
            subject: { type: 'string' }, body: { type: 'string' }, facts: { type: 'array', items: { type: 'string' }, description: 'Each fact used, with its source' },
            package: { type: 'string', description: 'Package, document type or purpose' }
        }, required: ['to', 'channel', 'subject', 'body', 'facts'] } };
const leadTool = { name: 'add_lead', description: 'Log one scored lead together with its ready-to-send draft. Never sends.', input_schema: { type: 'object', properties: {
            name: { type: 'string', description: 'Business or organization' }, category: { type: 'string' }, score: { type: 'integer', minimum: 3, maximum: 5 },
            hook: { type: 'string', description: 'One line: why them, why now' },
            contact_name: { type: 'string' }, contact_title: { type: 'string' },
            email: { type: 'string', description: 'Only an address you saw on a public page' }, email_source_url: { type: 'string' },
            phone: { type: 'string' }, website: { type: 'string' }, city: { type: 'string' },
            suggested_package: { type: 'string' },
            channel: { type: 'string', enum: ['email', 'web_form', 'phone_script'] },
            subject: { type: 'string' }, body: { type: 'string' }, facts: { type: 'array', items: { type: 'string' } }
        }, required: ['name', 'category', 'score', 'channel', 'subject', 'body', 'facts'] } };
const finishTool = { name: 'finish', description: 'End the run with a report.', input_schema: { type: 'object', properties: {
            summary: { type: 'string' }, steps: { type: 'array', items: { type: 'string' } }, blocked: { type: 'array', items: { type: 'string' } }
        }, required: ['summary', 'steps', 'blocked'] } };
const web = (uses) => ({ type: 'web_search_20250305', name: 'web_search', max_uses: uses });
const WEB_AGENTS = new Set(['sponsorship', 'tickets', 'partners', 'pr']);

function workbook(club) {
    return {
        club: club.team,
        profile: club.profile.map(([section, field, value, status]) => ({ section, field, value, status: status === 'ok' ? 'Confirmed' : status === 'pub' ? 'Public - unconfirmed' : 'Needed' })),
        settings: { emailSystem: club.settings.emailSystem, agentsOn: club.settings.agentsOn, ratingWeights: club.settings.weights },
        sender: club.sender,
        pendingDrafts: club.queue.filter(d => d.status === 'pending').length,
        players: club.players,
    };
}
export function ringState(club) {
    const counts = [1, 2, 3].map(n => club.prospects.filter(p => p.pipeline === 'group' && !p.sample && p.ring === n).length);
    let now = 1;
    while (now < 3 && counts[now - 1] >= RING_FILL)
        now++;
    return { counts, now };
}
const skillText = (agentId) => SKILLS[AG[agentId].skill] || '';

export async function runAgent(club, agentId, instruction) {
    const agent = AG[agentId];
    if (!agent)
        throw new Error('Unknown agent');
    if (!club.settings.agentsOn[agentId])
        throw new Error(`${agent.name} is off. Turn it on first.`);
    if (!hasKey())
        return demo(club, agentId);
    return LEAD_AGENTS[agentId] ? sprint(club, agentId) : single(club, agentId, instruction);
}

/** Runs one agent's tool loop until it finishes or the deadline passes. Handlers receive each tool call. */
async function loop({ system, tools, first, feature, deadline, onTool, maxTurns = 6, maxTokens = 3500 }) {
    const messages = [{ role: 'user', content: first }];
    let report = null;
    for (let turn = 0; turn < maxTurns; turn++) {
        const left = deadline - Date.now();
        if (left < 4000)
            break;
        const res = await callClaude({ system, tools, messages, maxTokens, feature, timeoutMs: left });
        messages.push({ role: 'assistant', content: res.content });
        const results = [];
        for (const block of res.content) {
            if (block.type !== 'tool_use')
                continue;
            if (block.name === 'finish') {
                report = block.input;
                results.push({ type: 'tool_result', tool_use_id: block.id, content: 'Run recorded.' });
            }
            else
                results.push({ type: 'tool_result', tool_use_id: block.id, content: onTool(block.name, block.input) });
        }
        if (report || (res.stop_reason === 'end_turn' && !results.length))
            break;
        if (res.stop_reason === 'pause_turn')
            continue;
        if (results.length)
            messages.push({ role: 'user', content: results });
    }
    return report;
}

const emailOk = (e) => /^[^\s@<>]+@[^\s@<>]+\.[a-z]{2,}$/i.test(e || '');

/** Normalize a lead from the model: an email counts only with a source page, otherwise fall back honestly. */
function cleanLead(i, agentId, ring) {
    const hasEmail = emailOk(i.email) && /^https?:\/\//i.test(i.email_source_url || '');
    let channel = i.channel;
    if (channel === 'email' && !hasEmail)
        channel = i.website ? 'web_form' : 'phone_script';
    if (channel === 'web_form' && !i.website && i.phone)
        channel = 'phone_script';
    return {
        pipeline: LEAD_AGENTS[agentId], name: String(i.name).slice(0, 120), category: i.category, score: Math.max(3, Math.min(5, i.score | 0 || 3)), hook: i.hook || '',
        contact: i.contact_name || '', title: i.contact_title || '', email: hasEmail ? i.email.trim() : '', emailSource: hasEmail ? i.email_source_url : '',
        phone: i.phone || '', website: i.website || '', city: i.city || '', pkg: i.suggested_package || '', ring,
        channel, subject: i.subject, body: i.body, facts: i.facts || [],
    };
}

/** The daily sprint: several lanes search side by side, then the results are merged and capped at the goal. */
async function sprint(club, agentId) {
    const agent = AG[agentId];
    const started = Date.now();
    const deadline = started + 45000;
    const goal = club.settings.goals[agentId] || 10;
    const lanes = LANES[agentId];
    const n = agentId === 'partners' ? lanes.length : Math.max(2, Math.min(lanes.length, Math.ceil(goal / 2)));
    const perLane = Math.max(2, Math.ceil(goal * 1.4 / n));
    const rs = ringState(club);
    const known = club.prospects.filter(p => p.pipeline === LEAD_AGENTS[agentId] && !p.sample).map(p => p.name).slice(-150);
    const sys = `${skillText(agentId)}\n\n---\n${APP_RULES}\n${LEAD_RULES}\n\nClub Workbook (JSON):\n${JSON.stringify(workbook(club), null, 1)}`;
    const found = [];
    const reports = [];
    const lanePlan = lanes.slice(0, n);
    await Promise.allSettled(lanePlan.map(async (lane) => {
        const ring = lane.ring === 'next' ? Math.min(3, rs.now + 1) : rs.now;
        const place = agentId === 'tickets' ? `Geography: ${RINGS[ring - 1].desc}. Work outward from the stadium and stay inside this ring.` : agentId === 'sponsorship' ? 'Geography: the club\'s Territory rule and home city in the workbook. Stay inside it.' : 'Geography: near the stadium and the club\'s home city.';
        const first = `Lane: ${lane.name}. Look for: ${lane.brief}.\n${place}\nFind up to ${perLane} NEW leads for ${club.team} that have a named contact and a sourced public email wherever one exists. Already in the pipeline, skip: ${JSON.stringify(known)}.`;
        const r = await loop({ system: sys, tools: [leadTool, finishTool, web(5)], first, feature: 'virtual-gm-' + agentId, deadline, maxTurns: 4, maxTokens: 3500,
            onTool: (name, i) => { if (name === 'add_lead' && i?.name && i.body && i.subject) {
                found.push(cleanLead(i, agentId, agentId === 'tickets' ? ring : undefined));
                return 'Logged.';
            } return 'Unknown tool.'; } }).catch(() => null);
        reports.push({ lane: lane.name, r });
    }));
    // Merge: drop repeats (against the pipeline and each other), best first, cap at the goal.
    const seen = new Set(club.prospects.filter(p => p.pipeline === LEAD_AGENTS[agentId]).map(p => normName(p.name)));
    const keep = [];
    for (const l of found.sort((a, b) => (b.email ? 1 : 0) - (a.email ? 1 : 0) || b.score - a.score)) {
        const k = normName(l.name);
        if (!k || seen.has(k))
            continue;
        seen.add(k);
        keep.push(l);
    }
    const take = agentId === 'partners' ? keep : keep.slice(0, goal);
    let nextId = Math.max(0, ...club.queue.map(q => q.id)) + 1;
    const now = new Date().toISOString();
    const drafts = [], prospects = [];
    for (const l of take) {
        const id = nextId++;
        const ready = l.channel !== 'phone_script' || !!l.phone;
        prospects.push({ pipeline: l.pipeline, name: l.name, category: l.category, score: l.score, hook: l.hook, contact: l.contact, title: l.title, email: l.email, emailSource: l.emailSource,
            phone: l.phone, website: l.website, city: l.city, pkg: l.pkg, ring: l.ring, channel: l.channel === 'email' ? 'Email' : l.channel === 'web_form' ? 'Web form' : 'Phone', draftId: id, foundAt: now,
            status: l.email ? 'ready' : ready ? 'form' : 'needs-contact' });
        const who = l.contact ? `${l.contact}${l.title ? ', ' + l.title : ''}, ${l.name}` : l.name;
        const facts = [...l.facts];
        if (l.email)
            facts.unshift(`Email found on a public page: ${l.emailSource}`);
        else
            facts.unshift(l.channel === 'web_form' ? 'No public email found: this goes in their contact form' : 'No public email or form found: phone script only');
        drafts.push({ id, agent: agentId, to: who, toEmail: l.email, ch: l.channel.replace('_', ' '), kind: 'out', pkg: l.pkg || l.category, subj: l.subject, facts, body: l.body, status: 'pending', createdAt: now, lead: true, score: l.score });
    }
    const withEmail = prospects.filter(p => p.email).length;
    const steps = [`Ran ${lanePlan.length} searches side by side: ${lanePlan.map(l => l.name).join(', ')}`,
        `Found ${found.length} candidates, ${found.length - keep.length} repeats removed, kept ${take.length} of a goal of ${goal}`,
        `${withEmail} with a public email, ${take.length - withEmail} by form or phone`];
    const blocked = [...new Set(reports.flatMap(x => x.r?.blocked || []))].slice(0, 4);
    const missed = reports.filter(x => !x.r).map(x => x.lane);
    if (missed.length)
        blocked.push(`Out of time before finishing: ${missed.join(', ')}`);
    const log = { id: crypto.randomUUID(), agent: agentId, at: now, mode: 'live',
        summary: `${agent.name} added ${take.length} lead${take.length === 1 ? '' : 's'} (${withEmail} with an email). Goal ${goal}.`, steps, blocked, drafts: drafts.length, seconds: Math.round((Date.now() - started) / 1000) };
    return { log, drafts, prospects };
}

/** One normal run for every other agent. */
async function single(club, agentId, instruction) {
    const agent = AG[agentId];
    const system = `${skillText(agentId)}\n\n---\n${APP_RULES}\n- Do not add an opt-out line to drafts.\n\nClub Workbook (JSON):\n${JSON.stringify(workbook(club), null, 1)}`;
    const tools = WEB_AGENTS.has(agentId) ? [draftTool, finishTool, web(4)] : [draftTool, finishTool];
    const drafts = [];
    let nextId = Math.max(0, ...club.queue.map(q => q.id)) + 1;
    const report = await loop({ system, tools, deadline: Date.now() + 48000, maxTurns: 8, feature: 'virtual-gm-' + agentId,
        first: instruction || `Run your normal routine for ${club.team} now. Keep this run small: at most 5 drafts.`,
        onTool: (name, i) => { if (name === 'create_draft') {
            drafts.push({ id: nextId++, agent: agentId, to: i.to, ch: String(i.channel).replace('_', ' '), kind: i.channel === 'internal' ? 'in' : 'out', pkg: i.package || '', subj: i.subject, facts: i.facts || [], body: i.body, status: 'pending', createdAt: new Date().toISOString() });
            return 'Saved as pending. A human must approve it.';
        } return 'Unknown tool.'; } }).catch(() => null);
    const r = report || { summary: '', steps: [], blocked: ['The run ran out of time before finishing.'] };
    const log = { id: crypto.randomUUID(), agent: agentId, at: new Date().toISOString(), mode: 'live', summary: r.summary || `${agent.name} finished.`, steps: r.steps || [], blocked: r.blocked || [], drafts: drafts.length };
    return { log, drafts, prospects: [] };
}

/** No API key: replay the agent's canned steps so the app is fully clickable. */
async function demo(club, agentId) {
    const agent = AG[agentId];
    const log = { id: crypto.randomUUID(), agent: agentId, at: new Date().toISOString(), mode: 'demo',
        summary: `Demo run. Add ANTHROPIC_API_KEY to run ${agent.name} for real.`, steps: agent.run, blocked: agent.needs.slice(0, 3), drafts: 0 };
    return { log, drafts: [], prospects: [] };
}
