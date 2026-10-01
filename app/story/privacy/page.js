import Legal from "../_site/Legal";

export const metadata = { title: "Privacy policy" };

const SECTIONS = [
  { h: "The short version", list: [
    "Your story belongs to you. What you write is private to your account.",
    "We collect only what we need to run Story of Self and save your progress.",
    "We never sell your information, and we don't show ads.",
    "AI helps power your Champion, through providers who process your words only to respond to you.",
    "You can ask us to delete your account and everything in it at any time.",
  ] },
  { h: "What we collect", list: [
    "Account details: your email address, the first name you give us, and your confirmation that you're 18 or older. Passwords are handled by our authentication provider and never seen by us.",
    "Your Story work: your conversations with your Story Champion, the details your Champion saves as you go (like your five words or your Hidden Value), and the drafts of your Story of Self.",
    "Champion Academy: your module progress, quiz results, practice sessions and certificate details, if you take Champion training.",
    "Messages you send us through our contact form: your name, email and message.",
    "The launch list: if you join it, your email, the first name and role you choose (and graduation year for students), and whether someone's share link brought you. We use it only to tell you about Story of Self's launch, and you can leave at any time.",
    "Voice input: if you choose to speak instead of type, your browser's own speech service turns your voice into text on your device or with your browser's provider. Story of Self receives only the text you send, never your audio.",
    "Basic technical information needed to keep the service running and secure, such as when you signed in.",
  ] },
  { h: "How we use it", list: [
    "To run the program: so your Champion can guide you and remember where you left off.",
    "To keep people safe: our safety rules respond when something in a conversation suggests you may not be okay.",
    "To reply when you contact us.",
    "To improve Story of Self, using patterns across the program rather than reading individual stories, unless you've asked us for help with yours.",
  ], after: ["We don't use your story for advertising, and we don't sell or rent your information to anyone."] },
  { h: "AI and the companies that help us", p: [
    "Your Story Champion is powered by an AI model provided by Anthropic. When you talk with your Champion, your messages and the relevant parts of your progress are sent to the model so it can respond. Our provider processes this information to deliver the service, under its commercial terms.",
    "We also use Supabase to store accounts and progress securely, and Vercel to host the website. Each provider receives only what it needs to do its job.",
  ] },
  { h: "Who can see your story", p: [
    "You. Your conversations and your Story of Self are private to your account and protected by access rules in our database.",
    "Parents and others don't see your writing unless you choose to share it. If you join the Journey + Champion tier, your human Champion will see what you choose to work on together.",
    "A small number of people on the Story team may access account data when it's needed to fix a problem you've asked us about, to keep someone safe, or because the law requires it.",
  ] },
  { h: "Safety", p: [
    "If something you write suggests you may be in danger, your Champion will pause the lesson and share crisis resources such as 988. It also sends a safety alert to a small number of people on the Story team, with your first name, your email, the lesson and the message that raised the concern, so a real person can check in with you.",
    "Conversations are not monitored by staff in real time, so if you need help now, please call or text 988, text HOME to 741741, or call 911 in an emergency.",
  ] },
  { h: "Age", p: [
    "During our preview, Story of Self accounts are for people 18 and older. Story of Self is never intended for children under 13. If you believe a child has created an account, contact us and we'll delete it.",
  ] },
  { h: "Cookies and browser storage", p: [
    "We use your browser's storage to keep you signed in and to remember simple progress, like where you are in the Champion Academy. We don't use advertising or tracking cookies.",
  ] },
  { h: "Keeping and deleting your information", p: [
    "We keep your account and your story for as long as your account is open, so you can come back to it. You can ask us to delete your account and all of your Story work at any time through our contact page, and we'll confirm when it's done. Contact form messages are kept only as long as we need them to help you.",
  ] },
  { h: "Your choices and rights", p: [
    "You can ask to see, correct, download or delete your information. Depending on where you live, you may have additional rights under laws such as the California Consumer Privacy Act. We'll honor these requests regardless of where you live.",
  ] },
  { h: "Changes to this policy", p: [
    "If we make meaningful changes, we'll update the date at the top of this page and, where appropriate, let you know when you sign in.",
  ] },
  { h: "Contact us", p: ["Questions about privacy? Reach us through our contact page at /story/contact. We read every message."] },
];

export default function Privacy() {
  return <Legal title="Privacy policy" intro="How Story of Self collects, uses and protects your information, written as plainly as we can." sections={SECTIONS} />;
}
