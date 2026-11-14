import { currentClub } from '../../../../lib/gm/store';
import Leads from '../../_components/Leads';

export default async function Vendors() {
    const c = await currentClub();
    return <Leads club={c} pipe="vendor" agentId="partners" title="Partners & vendors" noun="vendors"/>;
}
