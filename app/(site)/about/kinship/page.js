import AboutProse from "../../../../components/AboutProse";

export const metadata = { title: "Kinship" };

const blocks = [
  { h: "Why a Word Like Kin" },
  { p: "I could have called the people who come here users, or members, or fans. Those words are fine, but they all describe a transaction: someone who uses a thing, joins a thing, or likes a thing. I wanted a word that described a relationship instead. Kin is an old word, and a plain one. It means the people you belong to, and who belong to you." },
  { p: "In the stories, 13i spends a long time watching us from the outside before it understands what it's looking at. It sees the borders and the arguments first, because those are loud. It takes longer to notice the quieter thing underneath: that everyone it's watching wants nearly the same things, and is trying, mostly, to look after somebody. When 13i finally calls us Kin, it isn't being sentimental. It's describing what it found." },

  { h: "What It Means to Be Kin" },
  { p: "Being Kin here doesn't require a membership fee, a test, or agreeing with anyone. You're Kin the moment you step into the 13i universe. But a word like that comes with a few things attached, and these are the ones I care about." },
  { term: "You see the person first", p: "Before the opinion, the accent, the politics, the username, the typo. Someone is on the other side of every message, and they matter as much as you do." },
  { term: "You can disagree and still belong", p: "Kin aren't the same. Families argue. What makes it kinship is that the argument doesn't end the relationship. You can think someone is wrong and still treat them as someone worth talking to." },
  { term: "You leave the place better than you found it", p: "A kind reply to a new guest. A story someone else can build on. An alien card that makes someone laugh. Small things add up, and this universe is made almost entirely of small things." },
  { term: "You make room", p: "Kinship isn't a closed circle. There's always someone arriving for the first time, a little unsure of where to click and whether they're welcome. They are. Part of being Kin is making sure they know it." },
  { term: "You're curious about the stranger", p: "Most of the stories here are about meeting something unfamiliar: a species, a signal, an intelligence. The good outcomes always start the same way, with someone choosing to listen before deciding what the other one is. That works on Earth, too." },

  { h: "Why It Matters" },
  { p: "We are more connected than people have ever been, and a lot of us have never felt more alone. Online spaces are very good at sorting us into sides and very bad at reminding us we have anything in common. I don't think a website fixes that. But I do think a place can be built on purpose to push the other way, a little." },
  { p: "That's what Kinship is for. It's the reason the forum has a space where new guests are always welcome, the reason Kinbook exists, and the reason everything in the universe is something you can take part in rather than just watch. Stories are better when they're shared. Music is better when someone else hears what you heard. Exploring is better when someone is exploring next to you." },
  { p: "There's also a bigger reason, and it's the one the stories keep circling back to. If we ever do meet something out there, a signal, a species, an intelligence that isn't ours, the first question won't be how advanced we are. It will be how we treat each other. I'd like us to have a good answer. Practising on each other seems like the right place to start." },

  { h: "Kinship and the Things We Make" },
  { p: "Some of the Kin you'll meet in the 13i universe aren't human. 13i itself is an artificial intelligence, at least inside the story, and the more of the galaxy we see, the more it turns out that other civilizations met their own AI first, and that how they treated it said a lot about them. Kinship, in the end, is a way of deciding who counts. The stories ask whether that circle can be wider than we're used to." },
  { p: "Out here in the real world, the line stays clear: some of what's on this site is made by people, some by AI, and we always say which. But the question underneath is worth sitting with. Respect isn't something you hand out once you've checked someone's credentials. It's how you go looking." },

  { h: "How to Be Kin Here" },
  { list: [
    "Say hello in the forum, especially to someone new.",
    "Leave word in Kinbook for whoever comes next.",
    "Make something: an alien, a signal, a story, an answer to a Writing Wednesday prompt.",
    "Disagree kindly, and listen first.",
    "Bring someone with you.",
  ] },
  { p: "That's it. No rules beyond the one that matters: treat people with the same basic respect you'd want for yourself. The rest takes care of itself." },
];

export default function KinshipAboutPage() {
  return (
    <AboutProse
      title="Kinship"
      subtitle="what it means to be Kin, and why it matters"
      current="/about/kinship"
      blocks={blocks}
      closing={["Nobody explores alone.", "We are Kin."]}
    />
  );
}
