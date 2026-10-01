// The launch list: who's waiting for Story of Self, and how they heard.
export const WAITLIST_ROLES = [
  { id: "student", label: "I'm graduating or just graduated", short: "Student" },
  { id: "parent", label: "I'm a parent", short: "Parent" },
  { id: "champion", label: "I'd like to be a Champion", short: "Champion" },
  { id: "educator", label: "I'm a counselor or educator", short: "Educator" },
  { id: "other", label: "Something else", short: "Other" },
];
export const ROLE_IDS = WAITLIST_ROLES.map((r) => r.id);
export const roleShort = (id) => WAITLIST_ROLES.find((r) => r.id === id)?.short || "Other";

const thisYear = new Date().getFullYear();
export const GRAD_YEARS = [thisYear - 1, thisYear, thisYear + 1, thisYear + 2];
