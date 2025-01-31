import { EntityBin } from "tonwa";
import { BinBudsEditing, doBinPick, FormBudsStore, RearPickResultType, ReturnUseBinPicks, SheetStore } from "../../../Store";
import { PickResult } from "app/hooks/Calc";
import { Modal } from "tonwa/UI";

export async function runBinPicks(
    modal: Modal
    , sheetStore: SheetStore
    , bin: EntityBin
    , rearPickResultType: RearPickResultType = RearPickResultType.array) {
    const { binPicks, rearPick } = bin;
    if (binPicks === undefined) return;
    let editing = new FormBudsStore(modal, new BinBudsEditing(sheetStore, bin, []));
    for (const binPick of binPicks) {
        await doBinPick(editing, binPick);
    }

    let ret: ReturnUseBinPicks = {
        editing,
        rearBinPick: rearPick,           // endmost pick
        rearResult: undefined,
        rearPickResultType,
    };

    const { binStore } = sheetStore;
    let rearPickResult = await editing.runBinPickRear(binStore, rearPick, rearPickResultType);
    if (rearPickResult === undefined) return undefined;

    let rearResult: PickResult[] = Array.isArray(rearPickResult) === false ?
        [rearPickResult as PickResult] : rearPickResult as PickResult[];

    ret.rearResult = rearResult;
    return ret;
}
