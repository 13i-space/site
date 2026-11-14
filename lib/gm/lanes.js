// Lead sprints: the agent runs several searches side by side (one "lane" per segment) so a morning run
// can reach a daily goal instead of one slow search. Edit the lane lists to change where it looks.

export const RINGS = [
    { n: 1, label: 'Ring 1: core', desc: 'the home city and the towns within about 10 miles of the stadium' },
    { n: 2, label: 'Ring 2: extended', desc: 'towns roughly 10 to 25 miles from the stadium' },
    { n: 3, label: 'Ring 3: metro', desc: 'towns roughly 25 to 45 miles from the stadium' },
];
export const RING_FILL = 40; // group leads in a ring before the sprint leans on the next one

export const LANES = {
    sponsorship: [
        { name: 'Healthcare and family services', brief: 'orthodontists, pediatric dentists, pediatricians, urgent care, physical therapy, family practices' },
        { name: 'Auto and home services', brief: 'car dealers, auto repair, home builders, roofing, HVAC, plumbing, remodeling' },
        { name: 'Real estate and lending', brief: 'real estate teams, mortgage lenders, title companies, banks and credit unions' },
        { name: 'Insurance, legal and finance', brief: 'insurance agencies, law firms, accountants, wealth advisors' },
        { name: 'Restaurants and new openings', brief: 'restaurants, coffee, bakeries, shaved ice, new openings and new locations (skip any exclusive category such as beer if the club has an exclusive sponsor)' },
        { name: 'Fitness and family businesses', brief: 'gyms, martial arts, dance and swim schools, tutoring, child care, party venues' },
        { name: 'Retail and local employers', brief: 'local retailers, large local employers, Chamber of Commerce members' },
        { name: 'Event and team sponsors', brief: 'businesses that already sponsor local youth teams, school events, races and festivals' },
    ],
    tickets: [
        { name: 'Youth soccer clubs', ring: 'now', brief: 'recreational and competitive youth soccer clubs and their directors of coaching or registrars' },
        { name: 'Academy and select teams', ring: 'now', brief: 'academy, club, select and ECNL-style teams by age group; the team manager or coach contact for each' },
        { name: 'Youth soccer next ring out', ring: 'next', brief: 'youth soccer clubs, academies and select teams' },
        { name: 'Other youth sports', ring: 'now', brief: 'baseball, softball, basketball, lacrosse and flag football leagues' },
        { name: 'Schools and PTAs', ring: 'now', brief: 'elementary and middle school PTAs, booster clubs, school soccer programs' },
        { name: 'Churches, scouts, HOAs', ring: 'now', brief: 'church youth groups, scout troops, HOAs and neighborhood associations' },
        { name: 'Employers and community groups', ring: 'now', brief: 'employers with team-building or family-day programs, YMCAs, Boys and Girls Clubs, senior and community centers' },
        { name: 'Select teams next ring out', ring: 'next', brief: 'club, academy and select teams by age group' },
    ],
    partners: [
        { name: 'Hotels and lodging', brief: 'team hotels and group-rate lodging near the stadium' },
        { name: 'Transportation, trainers and food', brief: 'charter buses, athletic trainers, caterers and printers' },
    ],
};

export const LEAD_AGENTS = { sponsorship: 'sponsor', tickets: 'group', partners: 'vendor' };

export const LEAD_RULES = `
LEAD RULES (these beat anything above)
- The goal is a lead the GM can send with almost no editing. A lead without a way to reach a real person is only half a lead.
- Find a NAMED contact (owner, marketing manager, director of coaching, registrar, events lead) and a PUBLIC email for them or for the business. Open the business's own site, its contact or team page, a Chamber or league directory, or a news item. Do not stop at a search snippet.
- email_source_url is the page where you actually saw that email address. If you did not see an address on a page, leave email empty. NEVER guess, construct or infer an address (no first.last@ patterns).
- If there is no public email, use channel web_form (the business has a contact form) or phone_script (phone only). Say so in facts.
- Write the email to the named person ("Hi Dana,"). If you only have a general inbox, greet the business ("Hi <Business> team,"). Never write a bracketed placeholder for a name.
- Use the literal tokens {sender} and {addr} for the sender's name and the club's mailing address. The app fills them. Do NOT add an opt-out or "reply no thanks" line.
- 90 to 120 words, plain and personal, in the club's brand voice. Open with a specific hook about THEM, tie it to the club using only Confirmed or Public facts from the workbook, suggest one package or offer by name with no price unless Confirmed, and ask one easy question (15 minutes this week, or a headcount).
- Score 1 to 5 on quality: fit with a family and youth audience, size or reach, signs they spend on local marketing or group outings, a timely hook. Only call add_lead for scores of 3 or more.
- Skip anything in existingProspects, do-not-contact, or an exclusive category.
- Work fast: at most four searches, then call add_lead once per lead, then finish.`;
