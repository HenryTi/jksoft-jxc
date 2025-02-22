import { PickQuery } from "../../Biz";
import { PickResult, RearPickResultType } from "../../Store";
import { QueryStore } from "./QueryStore";
import { FormBudsStore } from "../../Control/ControlBuds/BinEditing";
import { QueryRow } from "../../tools";
import { PageFromQuery } from "./PageFromQuery";

async function pickFromQueryBase(
    editing: FormBudsStore // BudsEditing
    , binPick: PickQuery
    , pickResultType: RearPickResultType)
    : Promise<PickResult | PickResult[]> {
    let { query } = binPick as PickQuery;
    const { modal } = editing;
    let queryStore = new QueryStore(modal, query);
    let ret = await modal.open(<PageFromQuery
        queryStore={queryStore}
        query={query} editing={editing}
        binPick={binPick} pickResultType={pickResultType} />);
    if (ret === undefined) return;
    function toRet(queryRow: QueryRow) {
        let { ids, cols } = queryRow;
        let ret: any = { id: ids[ids.length - 1] };
        if (cols !== undefined) {
            for (let [bud, value] of cols) {
                ret[bud.name] = value;
            }
        }
        return ret;
    }
    if (pickResultType === RearPickResultType.scalar) {
        return toRet(ret);
    }
    else {
        return (ret as QueryRow[]).map(v => toRet(v));
    }
}

export async function pickFromQueryScalar(
    // modal: Modal
    // , namedResults: NamedResults
    editing: FormBudsStore // BudsEditing
    , binPick: PickQuery)
    : Promise<PickResult> {
    return await pickFromQueryBase(editing, binPick, RearPickResultType.scalar) as PickResult;
};

export async function pickFromQuery(
    editing: FormBudsStore // BudsEditing
    , binPick: PickQuery
    , lastPickResultType: RearPickResultType)
    : Promise<PickResult[]> {
    return await pickFromQueryBase(editing, binPick, lastPickResultType) as PickResult[];
};
