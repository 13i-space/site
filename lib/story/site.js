// Story of Self: site-wide navigation and contact details.
export const NAV = [
  { href: "/story#how", label: "How it works" },
  { href: "/story#parents", label: "For parents" },
  { href: "/story/community", label: "Community" },
  { href: "/story/academy", label: "Champions" },
  { href: "/story/about", label: "Our story" },
];

export const FOOTER = [
  {
    h: "Story of Self",
    links: [
      { href: "/story/begin", label: "Begin your story" },
      { href: "/story/my-story", label: "My story" },
      { href: "/story#how", label: "How it works" },
      { href: "/story/community", label: "Community" },
      { href: "/story#pricing", label: "Pricing" },
    ],
  },
  {
    h: "Champions",
    links: [
      { href: "/story/academy", label: "Champion Academy" },
      { href: "/story/academy/welcome", label: "Start free training" },
    ],
  },
  {
    h: "About",
    links: [
      { href: "/story/about", label: "Our story" },
      { href: "/story/contact", label: "Contact us" },
      { href: "/story/privacy", label: "Privacy policy" },
      { href: "/story/terms", label: "Terms of use" },
    ],
  },
];

// Set NEXT_PUBLIC_STORY_CONTACT_EMAIL in Vercel to show a public email address.
export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_STORY_CONTACT_EMAIL || "";
export const LAST_UPDATED = "October 1, 2026";
