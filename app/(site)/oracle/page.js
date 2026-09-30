import OracleChamber from "../../../components/OracleChamber";

export const metadata = {
  title: "The Oracle",
  description: "Speak with 13i itself.",
};

// The Oracle is 13i itself, so the page is all chamber: no title card, just
// the threshold (components/OracleChamber.js).
export default function OraclePage() {
  return <OracleChamber />;
}
