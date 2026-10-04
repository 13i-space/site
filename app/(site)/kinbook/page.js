import Guestbook from "../../../components/Guestbook";
import KinRoom from "../../../components/KinRoom";

export const metadata = { title: "Kinbook", description: "An ongoing message list from the Kin, outside the forum." };

export default function KinbookPage() {
  return (
    <KinRoom room="kinbook" title="Kinbook" line="A wall of notes from the Kin, for whoever comes next. Leave one of your own.">
      <Guestbook />
    </KinRoom>
  );
}
