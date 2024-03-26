import { BizBud } from "app/Biz";
import { OwnedBuds } from "app/hooks/tool";
import { ValRow } from "../tool";

// atom field owns buds
export function BinOwnedBuds({ bizBud, valRow, noLabel }: { bizBud: BizBud, valRow: ValRow; noLabel?: boolean; }) {
    let { owned } = valRow;
    if (owned === undefined) return null;
    if (bizBud === undefined) return null;
    let values = owned[bizBud.id];
    return <OwnedBuds values={values} noLabel={noLabel} />;
}
