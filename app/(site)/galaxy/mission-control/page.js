import MissionControl from "../../../../components/MissionControl";
import { getLaunches, LAUNCH_REFRESH_SECONDS } from "../../../../lib/launchSchedule";

// Update 6.24: Mission Control - live YouTube space feeds, the station's
// position and the launch schedule. Reached from page 3 of the Galactic
// Gazette (/galaxy/news#page-3).
export const revalidate = LAUNCH_REFRESH_SECONDS;

export const metadata = {
  title: "Mission Control",
  description: "Live views of Earth from the space station and of the launch pads, with the station's position and the next launches.",
};

export default async function MissionControlPage() {
  const launches = await getLaunches();
  return <MissionControl launches={launches} />;
}
