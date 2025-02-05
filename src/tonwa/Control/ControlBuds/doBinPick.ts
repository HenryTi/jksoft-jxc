import { BinPick, PickAtom, PickOptions, PickPend, PickQuery, PickSpec } from "../../Biz";
import { BizPhraseType } from "uqs/UqDefault";
//import { pickFromAtom } from "../hooks/Sheet/binPick/pickFromAtom";
//import { pickFromSpec } from "../hooks/Sheet/binPick/pickFromSpec";
//import { pickFromQuery, pickFromQueryScalar } from "app/hooks/Query";
//import { pickFromOptions } from "../hooks/Sheet/binPick/pickFromOptions";
import { BinStore, RearPickResultType, PickResult } from "../../Store";
//import { pickFromPend } from "../hooks/Sheet/binPick/pickFromPend";
import { FormBudsStore } from "./BinEditing";

export async function doBinPick(editing: FormBudsStore, binPick: BinPick) {
    const { name, fromPhraseType } = binPick;
    if (fromPhraseType === undefined) return; // break;
    let pickResult: PickResult = await switchPhraseType(editing, binPick);
    if (pickResult === undefined) return;
    editing.setNamedValues(name, pickResult);
    return pickResult;
}

export async function doBinPickRear(binStore: BinStore, editing: FormBudsStore, rearPick: BinPick, rearPickResultType: RearPickResultType) {
    const { name, fromPhraseType } = rearPick;
    switch (fromPhraseType) {
        default: break;
        case BizPhraseType.query:
            if (rearPickResultType === RearPickResultType.array) {
                // return await pickFromQuery(editing, rearPick as PickQuery, rearPickResultType);
                return;
            }
            break;
        case BizPhraseType.pend:
            // return await pickFromPend(binStore, editing, rearPick as PickPend);
            return;
    }
    let pickResult = await switchPhraseType(editing, rearPick);
    if (pickResult === undefined) return;
    editing.setNamedValues(name, pickResult);
    return pickResult;
}

async function switchPhraseType(editing: FormBudsStore, pick: BinPick) {
    let pickResult: PickResult;
    switch (pick.fromPhraseType) {
        default: break;
        case BizPhraseType.atom:
            // pickResult = await pickFromAtom(editing, pick as PickAtom);
            break;
        case BizPhraseType.fork:
            // pickResult = await pickFromSpec(editing, pick as PickSpec);
            break;
        case BizPhraseType.query:
            // pickResult = await pickFromQueryScalar(editing, pick as PickQuery);
            break;
        case BizPhraseType.options:
            // pickResult = await pickFromOptions(editing.modal, pick as PickOptions);
            break;
    }
    return pickResult;
}
