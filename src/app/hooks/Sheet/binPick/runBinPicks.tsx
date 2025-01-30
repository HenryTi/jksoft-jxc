import { EntityBin } from "tonwa";
import { BinBudsEditing, doBinPick, RearPickResultType, ReturnUseBinPicks, SheetStore } from "../store";
import { PickResult } from "app/hooks/Calc";

export async function runBinPicks(
    sheetStore: SheetStore
    , bin: EntityBin
    , rearPickResultType: RearPickResultType = RearPickResultType.array) {
    const { binPicks, rearPick } = bin;
    if (binPicks === undefined) return;
    let editing = new BinBudsEditing(sheetStore, bin, []);
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
