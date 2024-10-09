import { BinPick, PickAtom, PickOptions, PickPend, PickQuery, PickSpec } from "app/Biz";
import { PickResult } from "app/hooks/Calc";
import { BizPhraseType } from "uqs/UqDefault";
import { pickFromAtom } from "../binPick/pickFromAtom";
import { pickFromSpec } from "../binPick/pickFromSpec";
import { pickFromQuery, pickFromQueryScalar } from "app/hooks/Query";
import { pickFromOptions } from "../binPick/pickFromOptions";
import { BinBudsEditing } from "./BinEditing";
import { RearPickResultType } from "./PickResult";
import { BinStore } from "./BinStore";
import { pickFromPend } from "../binPick/pickFromPend";

export async function doBinPick(editing: BinBudsEditing, binPick: BinPick) {
    const { name, fromPhraseType } = binPick;
    if (fromPhraseType === undefined) return; // break;
    let pickResult: PickResult = await switchPhraseType(editing, binPick);
    if (pickResult === undefined) return;
    editing.setNamedValues(name, pickResult);
    return pickResult;
}

async function switchPhraseType(editing: BinBudsEditing, pick: BinPick) {
    let pickResult: PickResult;
    switch (pick.fromPhraseType) {
        default: break;
        /*
        case BizPhraseType.any:
            // pickResult = this.getBudComposingValue(pick);
/            debugger;
            pickResult = { [pick.name]: 'a' };
            break;
        */
        case BizPhraseType.atom:
            pickResult = await pickFromAtom(editing, pick as PickAtom);
            break;
        case BizPhraseType.fork:
            pickResult = await pickFromSpec(editing, pick as PickSpec);
            break;
        case BizPhraseType.query:
            pickResult = await pickFromQueryScalar(editing, pick as PickQuery);
            break;
        case BizPhraseType.options:
            pickResult = await pickFromOptions(editing.modal, pick as PickOptions);
            break;
    }
    return pickResult;
}

export async function doBinPickRear(binStore: BinStore, editing: BinBudsEditing, rearPick: BinPick, rearPickResultType: RearPickResultType) {
    const { name, fromPhraseType } = rearPick;
    switch (fromPhraseType) {
        default: break;
        case BizPhraseType.query:
            if (rearPickResultType === RearPickResultType.array) {
                return await pickFromQuery(editing, rearPick as PickQuery, rearPickResultType);
            }
            break;
        case BizPhraseType.pend:
            return await pickFromPend(binStore, editing, rearPick as PickPend);
    }
    let pickResult = await switchPhraseType(editing, rearPick);
    // if (pickResult !== undefined) return pickResult;
    if (pickResult === undefined) return;
    editing.setNamedValues(name, pickResult);
    return pickResult;
}
