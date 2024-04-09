import { BizBud } from "app/Biz";
import { BudValueColl, BudsColl, OwnedBuds, ViewShowBuds } from "app/hooks/tool";
import { ValRow } from "../tool";

// atom field owns buds
export function BinOwnedBuds({ bizBud, budValueColl, noLabel }: { bizBud: BizBud; budValueColl: BudValueColl; noLabel?: boolean; }) {
    // let { owned } = valRow;
    // if (owned === undefined) return null;
    // if (bizBud === undefined) return null;
    // let values = owned[bizBud.id];
    // return <OwnedBuds values={values} noLabel={noLabel} />;
    return <ViewShowBuds bud={bizBud} budValueColl={budValueColl} noLabel={noLabel} />;
}
