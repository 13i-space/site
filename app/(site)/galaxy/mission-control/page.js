import MissionControl from "../../../../components/MissionControl";
import { getLaunches, LAUNCH_REFRESH_SECONDS } from "../../../../lib/launchSchedule";
import { getDeepSpace } from "../../../../lib/deepSpace";

// Update 6.24: Mission Control - live YouTube space feeds, the station's
// position and the launch schedule. Reached from page 3 of the Galactic
// Gazette (/galaxy/news#page-3).
export const revalidate = LAUNCH_REFRESH_SECONDS;

export const metadata = {
  title: "Mission Control",
  description: "Live views of Earth from the space station and of the launch pads, with the station's position, the next launches and where the deep-space missions are.",
};

export default async function MissionControlPage() {
  // Update 6.26: plus where the deep-space missions are, from JPL Horizons
  const [launches, deep] = await Promise.all([getLaunches(), getDeepSpace()]);
  return <MissionControl launches={launches} deep={deep} />;
}
