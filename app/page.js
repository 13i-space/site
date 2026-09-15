import { redirect } from "next/navigation";

// Temporary: while login/testing is underway, send everyone straight to
// the real site instead of gating behind the countdown. The countdown
// page itself is untouched and still live at /countdown - flip this
// back to render that page (or redirect("/countdown")) whenever the
// gate should go back up.
export default function Home() {
  redirect("/launch");
}
