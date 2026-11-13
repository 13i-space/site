import { currentClub } from '../../../../lib/gm/store';
import { Head } from '../../_components/ui';
import Ratings from '../../_components/Ratings';
export default async function Roster() {
    const c = await currentClub();
    return (<>
      <Head title="Roster and tryouts" sub="Coaches enter Technical, Physical and Mental scores. The Team agent computes the overall and keeps the board."/>
      {c.players.length ? <div className="notice"><b>Sample.</b><span>Sample players. Real tryout forms replace these.</span></div> : null}
      <Ratings players={c.players} weights={c.settings.weights}/>
    </>);
}
