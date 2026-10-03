import Before from "../../components/Before";

// /before always plays when opened directly - to replay it, or to hand it
// to someone on a browser that has already been through it. First-time
// visitors to /launch are sent here (lib/beforeVisit.js).
export default function BeforePage() {
  return <Before />;
}
