import { BinPick, EntityBin, PickAtom, PickPend, PickQuery, PickSpec } from "app/Biz";
import { BizPhraseType } from "uqs/UqDefault";
import { useCallback, useRef, useState } from "react";
import { pickFromAtom } from "./fromAtom";
// import { usePickFromSpec } from "./fromSpec";
// import { usePickFromPend } from "./fromPend";
import { pickFromQuery, pickFromQueryScalar } from "../../Query/fromQuery";
import { RearPickResultType, ReturnUseBinPicks, SheetStore } from "../store";
import { NamedResults, PickResult } from "../store";
import { pickFromPend } from "./fromPend";
import { pickFromSpec } from "./fromSpec";

/*
export function useBinPicks() {
    // const pickFromAtom = usePickFromAtom();
    // const pickFromSpec = usePickFromSpec();
    // const pickFromPend = usePickFromPend();
    // const [pickFromQueryScalar, pickFromQuery] = usePickFromQuery();
    const refNamedResults = useRef<NamedResults>(undefined);
    let { current: namedResults } = refNamedResults;
    const refPicked = useRef<ReturnUseBinPicks>(undefined);

    async function pickRear(sheetStore: SheetStore, bin: EntityBin, rearPickResultType: RearPickResultType) {
        if (sheetStore === undefined) debugger;
        if (bin === undefined) return;
        const { divStore } = sheetStore;
        const { rearPick } = bin;
        let pickResult: PickResult[] | PickResult;
        const { fromPhraseType } = rearPick;
        switch (fromPhraseType) {
            default: debugger; break;
            case BizPhraseType.atom:
                pickResult = await pickFromAtom(divStore, namedResults, rearPick as PickAtom);
                break;
            case BizPhraseType.fork:
                pickResult = await pickFromSpec(divStore, namedResults, rearPick as PickSpec);
                break;
            case BizPhraseType.query:
                pickResult = await pickFromQuery(divStore.modal, namedResults, rearPick as PickQuery, rearPickResultType);
                break;
            case BizPhraseType.pend:
                pickResult = await pickFromPend(divStore, namedResults, rearPick as PickPend);
        }
        return pickResult;
    }

    // if no detailSection add new, else edit
    return useCallback(async function (sheetStore: SheetStore, bin: EntityBin, rearPickResultType: RearPickResultType = RearPickResultType.array) {
        if (bin === undefined) return;
        const { binPicks, rearPick } = bin;
        if (binPicks === undefined) return;
        const { divStore } = sheetStore;
        // let { main } = sheetStore;
        namedResults = {
            '%user': sheetStore.userProxy,
            '%sheet': sheetStore.mainProxy,
        };
        let pickResult: PickResult;
        for (const binPick of binPicks) {
            const { name, fromPhraseType } = binPick;
            if (fromPhraseType === undefined) break;
            switch (fromPhraseType) {
                default: debugger; break;
                case BizPhraseType.atom:
                    pickResult = await pickFromAtom(divStore, namedResults, binPick as PickAtom);
                    break;
                case BizPhraseType.fork:
                    pickResult = await pickFromSpec(divStore, namedResults, binPick as PickSpec);
                    break;
                case BizPhraseType.query:
                    pickResult = await pickFromQueryScalar(divStore.modal, namedResults, binPick as PickQuery);
                    break;
            }
            if (pickResult === undefined) return undefined;
            namedResults[name] = pickResult;
        }

        let ret: ReturnUseBinPicks = {
            namedResults,
            rearBinPick: rearPick,           // endmost pick
            rearResult: undefined,
            rearPickResultType: rearPickResultType,
        };
        refPicked.current = ret;

        let rearPickResult = await pickRear(sheetStore, bin, rearPickResultType);
        if (rearPickResult === undefined) return undefined;

        let rearResult: PickResult[] = Array.isArray(rearPickResult) === false ?
            [rearPickResult as PickResult] : rearPickResult as PickResult[];

        ret.rearResult = rearResult;
        return ret;
    }, []);
}
*/

export async function runBinPicks(sheetStore: SheetStore, bin: EntityBin, rearPickResultType: RearPickResultType = RearPickResultType.array) {
    if (bin === undefined) return;
    // const refNamedResults = useRef<NamedResults>(undefined);
    // let { current: namedResults } = refNamedResults;
    const refPicked = useRef<ReturnUseBinPicks>(undefined);
    const { binPicks, rearPick } = bin;
    if (binPicks === undefined) return;
    const { divStore } = sheetStore;
    // let { main } = sheetStore;
    let namedResults: NamedResults = {
        '%user': sheetStore.userProxy,
        '%sheet': sheetStore.mainProxy,
    };
    let pickResult: PickResult;
    for (const binPick of binPicks) {
        const { name, fromPhraseType } = binPick;
        if (fromPhraseType === undefined) break;
        switch (fromPhraseType) {
            default: debugger; break;
            case BizPhraseType.atom:
                pickResult = await pickFromAtom(divStore, namedResults, binPick as PickAtom);
                break;
            case BizPhraseType.fork:
                pickResult = await pickFromSpec(divStore, namedResults, binPick as PickSpec);
                break;
            case BizPhraseType.query:
                pickResult = await pickFromQueryScalar(divStore.modal, namedResults, binPick as PickQuery);
                break;
        }
        if (pickResult === undefined) return undefined;
        namedResults[name] = pickResult;
    }

    let ret: ReturnUseBinPicks = {
        namedResults,
        rearBinPick: rearPick,           // endmost pick
        rearResult: undefined,
        rearPickResultType: rearPickResultType,
    };
    refPicked.current = ret;

    async function pickRear(/*sheetStore: SheetStore, bin: EntityBin, rearPickResultType: RearPickResultType*/) {
        if (sheetStore === undefined) debugger;
        if (bin === undefined) return;
        const { divStore } = sheetStore;
        const { rearPick } = bin;
        let pickResult: PickResult[] | PickResult;
        const { fromPhraseType } = rearPick;
        switch (fromPhraseType) {
            default: debugger; break;
            case BizPhraseType.atom:
                pickResult = await pickFromAtom(divStore, namedResults, rearPick as PickAtom);
                break;
            case BizPhraseType.fork:
                pickResult = await pickFromSpec(divStore, namedResults, rearPick as PickSpec);
                break;
            case BizPhraseType.query:
                pickResult = await pickFromQuery(divStore.modal, namedResults, rearPick as PickQuery, rearPickResultType);
                break;
            case BizPhraseType.pend:
                pickResult = await pickFromPend(divStore, namedResults, rearPick as PickPend);
        }
        return pickResult;
    }

    let rearPickResult = await pickRear(/*sheetStore, bin, rearPickResultType*/);
    if (rearPickResult === undefined) return undefined;

    let rearResult: PickResult[] = Array.isArray(rearPickResult) === false ?
        [rearPickResult as PickResult] : rearPickResult as PickResult[];

    ret.rearResult = rearResult;
    return ret;
}
