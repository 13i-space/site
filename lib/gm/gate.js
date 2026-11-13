// Optional passcode for the demo. If GM_PASSCODE is set in Vercel, visitors must
// enter it once. If it is not set the demo is open (but unlinked and not indexed).
import { cookies } from "next/headers";
import crypto from "crypto";

const token = () => crypto.createHash("sha256").update("gm:" + (process.env.GM_PASSCODE || "")).digest("hex");
export const gateOn = () => !!process.env.GM_PASSCODE;
export async function unlocked() {
  if (!gateOn()) return true;
  return (await cookies()).get("gm_pass")?.value === token();
}
export const tokenFor = (code) => (gateOn() && code === process.env.GM_PASSCODE ? token() : null);
