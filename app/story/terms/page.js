import Legal from "../_site/Legal";

export const metadata = { title: "Terms of use" };

const SECTIONS = [
  { h: "Welcome", p: ["These terms are an agreement between you and Story of Self about using our website, the Story of Self program, your Story Champion and the Champion Academy. By creating an account or using the site, you agree to them. If you don't agree, please don't use Story of Self."] },
  { h: "Who can use Story of Self", p: ["During our preview, you must be 18 or older to create an account. You're responsible for keeping your login details private and for activity on your account."] },
  { h: "Not therapy, and not an emergency service", p: [
    "Story of Self is a guided reflection and personal-growth program. It is not therapy, counseling, medical care or a crisis service, and it doesn't create a therapist-client relationship. Your Story Champion and human Champions are guides, not licensed professionals.",
    "If you're struggling or not safe, please reach out to a real person right away: call or text 988 in the U.S., text HOME to 741741, or call 911 in an emergency.",
  ] },
  { h: "Your Story Champion is AI", p: [
    "Your Champion is an artificial intelligence trained on the Story of Self method. It can be thoughtful and helpful, and it can also make mistakes or misunderstand you. Use your own judgment, and don't rely on it for medical, legal, financial or safety decisions.",
  ] },
  { h: "Your story is yours", p: [
    "You own what you write. By using Story of Self, you give us permission to store, process and display your content only as needed to provide the program to you, including sending it to our AI provider so your Champion can respond. We won't publish or share your story without your permission.",
  ] },
  { h: "Using Story of Self respectfully", list: [
    "Don't use the service to harm, harass or threaten anyone, or to share someone else's private information.",
    "Don't try to break, overload, copy or reverse-engineer the site or the Champion.",
    "Don't misrepresent yourself, or create accounts for anyone other than yourself.",
    "Don't use Story of Self for anything illegal.",
  ], after: ["We may suspend accounts that put others at risk or break these terms."] },
  { h: "Champions and the Champion Academy", p: [
    "Champion Academy certificates recognize completion of Story of Self Champion training. They are not a professional license and don't qualify anyone to provide therapy or counseling. Certification doesn't guarantee paid work as a Champion. Champions who work with students must also meet our safety requirements, which may include a background check and a code of conduct.",
  ] },
  { h: "Payments", p: [
    "During our preview, the program is free. When paid plans launch, prices, what's included, and any refund policy will be shown clearly before you buy. Purchases are one-time unless stated otherwise.",
  ] },
  { h: "Our content", p: [
    "The Story of Self method, curriculum, Story Guide, Champion Toolkits, name and design are owned by Story of Self and Aaron Donaghy and protected by copyright. You may use them for your own journey, but please don't copy, sell or redistribute them without written permission.",
  ] },
  { h: "Disclaimers", p: [
    "We work hard to make Story of Self helpful and safe, but we provide it “as is,” without guarantees of any particular result. Personal growth is personal, and outcomes vary.",
  ] },
  { h: "Limits on liability", p: [
    "To the fullest extent the law allows, Story of Self isn't liable for indirect or consequential damages arising from your use of the service. If we are found liable, our total liability is limited to the amount you paid us in the previous twelve months.",
  ] },
  { h: "Ending your account", p: ["You can stop using Story of Self and ask us to delete your account at any time. We may end or suspend access if these terms are broken or if needed to keep people safe."] },
  { h: "Changes", p: ["We may update these terms as Story of Self grows. If changes are significant, we'll update the date at the top and let you know when you sign in. Continuing to use the service means you accept the updated terms."] },
  { h: "Contact", p: ["Questions about these terms? Reach us through our contact page at /story/contact."] },
];

export default function Terms() {
  return <Legal title="Terms of use" intro="The ground rules for using Story of Self, in plain language." sections={SECTIONS} />;
}
