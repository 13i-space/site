import AboutProse from "../../../../components/AboutProse";

export const metadata = { title: "Mission & Values" };

const blocks = [
  { h: "Our Mission" },
  { p: "13i started as a story about an intelligence from somewhere beyond humanity. Somewhere along the way, the perspective flipped. Writing from the point of view of something looking at us from the outside made me look at us differently, too." },
  { p: "From out there, our differences can look enormous: our borders, our beliefs, our cultures, our politics, our backgrounds, our languages, and all the other ways we find to sort ourselves into us and them." },
  { p: "But step back far enough and something else becomes obvious. We're remarkably alike." },
  { list: [
    "We want to be loved, and to belong.",
    "We want to be safe, and we want our families to be healthy.",
    "We want lives that mean something.",
    "We want to be understood and respected.",
    "We want something to look forward to.",
    "We want to matter.",
  ] },
  { p: "The things that make us different are real, and they matter. But the things that make us human run deeper." },
  { p: "13i exists to explore that idea. Through stories, music, technology, experiments and imagination, it's a place to think about what it means to be human, while imagining what might exist beyond us." },
  { p: "The other half of the mission is simpler: to make a place where people can explore it together. The universe is a very big place, and it can be a lonely one. But once you step into 13i, you're not just watching from the outside. You're Kin." },

  { h: "Explore. Play. Create." },
  { p: "One of the simplest ideas behind 13i came from my brother, Aaron: Explore. Play. Create. It sounds simple because it is, but I think it describes one of the best ways there is to learn and grow." },
  { term: "Explore", p: "Start with curiosity. Ask questions. Take the interesting path instead of the obvious one. You don't need to know where it leads; that's the point." },
  { term: "Play", p: "Experiment without worrying about getting it wrong. Try things, break things, change things. Make something strange just to see what happens. Play takes away the pressure of needing to already know the answer." },
  { term: "Create", p: "Sooner or later, exploring and experimenting turn into something of your own: a song, a story, an image, an idea, a discovery, a new question. Creating is where learning becomes something you can hold." },
  { p: "That's how 13i got built, and it's how I think we keep learning. It's also an invitation: to take part, not just take in." },

  { h: "Our Values" },
  { term: "Kinship", p: "We come from different places. We think differently, believe differently, and experience the world differently. Underneath all of that, we share far more than we usually admit. That's what Kin means here. Once you're in the 13i universe, you're Kin. Not because everyone has to agree or be the same, but because everyone deserves to be treated as though their humanity matters. It comes down to one idea: treat people with the same basic respect you'd want for yourself. Not just tolerance, and not just politeness. Respect, the kind that sees the person before the difference." },
  { term: "Human creativity and artificial intelligence", p: "AI is a big part of the 13i universe. So is human creativity. They aren't the same thing, and I want to keep that line visible. Some of what you'll find here was made by a person. Some of it exists inside the story as the work of an artificial intelligence. Some future things may involve both. There's room for all of it, but there should never be confusion about where something came from. AI is an incredibly powerful tool; it can help us imagine, experiment, learn and make things that weren't possible before. But knowing who, or what, made something is part of understanding what you're experiencing. That's why the music carries its own label." },
  { strong: "100% HUMAN-CREATED MUSIC" },
  { term: "Authenticity", p: "13i didn't arrive fully formed, and I'm not going to pretend it did. It's an evolving creative experiment. Some ideas worked. Some failed. Some went nowhere, and plenty of things will probably change. That's the process. The goal isn't to make the journey look perfect; it's to be honest about it." },
  { term: "An ever-evolving universe", p: "13i isn't a finished world, and it isn't meant to be. A new story can change how you read an old one. A new character can show you a perspective you'd missed. Music can become part of the story, and technology can open new ways to experience it. Ideas that don't exist yet may turn out to matter most. So the universe never really closes. There's always another story, another signal, another question, another place to explore. 13i is meant to grow." },
  { term: "Curiosity over certainty", p: "You don't have to know the answer before you ask the question. Sometimes the question is the more valuable part. 13i is built on curiosity: about intelligence, consciousness, humanity, technology, the universe, and whatever might be out past what we currently understand. The unknown isn't something to be afraid of. It's something to explore." },
  { term: "Connection", p: "For all the science fiction, the technology, the alien intelligence and the cosmic mystery, 13i keeps coming back to something very human: connection. Between people. Between ideas. Between music and story, and between imagination and reality. Between us and whatever might exist beyond us. And most of all, between people who might never have found each other otherwise. The universe is enormous, and we don't know how many intelligent civilizations might be out there. But here, nobody has to explore it alone." },

  { h: "What 13i Is Really About" },
  { p: "13i is about looking at humanity from a different angle, and remembering how much we have in common. It's about being curious enough to explore, free enough to play, brave enough to create, open enough to see the connection, and respectful enough to treat the person next to you as Kin." },
  { p: "We may never know what's waiting past the next signal. But we get to choose how we go looking." },
];

export default function MissionPage() {
  return (
    <AboutProse
      title="Mission & Values"
      subtitle="what 13i is for, and how we try to go about it"
      current="/about/mission"
      blocks={blocks}
      closing={["Explore. Play. Create.", "Listen. Feel. Transcend.", "We are Kin."]}
    />
  );
}
