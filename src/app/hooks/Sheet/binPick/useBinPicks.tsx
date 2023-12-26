import { BinPick, EntityBin } from "app/Biz";
import { BizPhraseType } from "uqs/UqDefault";
import { useCallback, useRef } from "react";
import { usePickFromAtom } from "./fromAtom";
import { usePickFromSpec } from "./fromSpec";
import { usePickFromPend } from "./fromPend";
import { usePickFromQuery } from "./fromQuery";
import { SheetStore } from "../store";
import { NamedResults, PickResult } from "../NamedResults";

export interface ReturnUseBinPicks {
    // results: NamedResults;
    rearBinPick: BinPick;           // rear pick = the endmost pick
    rearResult: PickResult[];
    rearPickResultType: RearPickResultType;
};

export enum RearPickResultType {
    scalar,
    array,
}

export type PickFunc = (sheetStore: SheetStore, rearPickResultType: RearPickResultType) => Promise<ReturnUseBinPicks>;

export function useBinPicks(bin: EntityBin) {
    const pickFromAtom = usePickFromAtom();
    const pickFromSpec = usePickFromSpec();
    const pickFromPend = usePickFromPend();
    const [pickFromQueryScalar, pickFromQuery] = usePickFromQuery();
    const refPicked = useRef<ReturnUseBinPicks>(undefined);

    async function pickRear(sheetStore: SheetStore, /*namedResults: NamedResults, */rearPickResultType: RearPickResultType) {
        if (sheetStore === undefined) debugger;
        const { divStore } = sheetStore;
        const { rearPick } = bin;
        let pickResult: PickResult[] | PickResult;
        const { pick } = rearPick;
        switch (pick.bizPhraseType) {
            default: debugger; break;
            case BizPhraseType.atom:
                pickResult = await pickFromAtom(divStore/*namedResults*/, rearPick);
                break;
            case BizPhraseType.spec:
                pickResult = await pickFromSpec(divStore/*namedResults*/, rearPick);
                break;
            case BizPhraseType.query:
                pickResult = await pickFromQuery(divStore/*namedResults*/, rearPick, rearPickResultType);
                break;
            case BizPhraseType.pend:
                pickResult = await pickFromPend(divStore, /*namedResults, */rearPick);
        }
        return pickResult;
    }

    // if no detailSection add new, else edit
    return useCallback(async function (sheetStore: SheetStore, rearPickResultType: RearPickResultType = RearPickResultType.array) {
        if (bin === undefined) return;
        const { binPicks, rearPick } = bin;
        if (binPicks === undefined) return;
        const { divStore } = sheetStore;
        // divStore.initNamedResults();
        let { namedResults } = divStore;
        if (namedResults/*refPicked.current*/ === undefined) {
            // namedResults = refPicked.current.results;
            //}
            //else {
            namedResults = divStore.namedResults = {
                '%sheet': sheetStore.main.binRow, // sheetBinRow ?? {},
            };
            // divStore.initNamedResults();
            // divStore.setNamedResults('%sheet', sheetStore.main.binRow);
            let pickResult: PickResult;
            for (const binPick of binPicks) {
                const { name, pick } = binPick;
                const { bizPhraseType } = pick;
                if (bizPhraseType === undefined) break;
                switch (bizPhraseType) {
                    default: debugger; break;
                    case BizPhraseType.atom:
                        pickResult = await pickFromAtom(divStore, binPick);
                        break;
                    case BizPhraseType.spec:
                        pickResult = await pickFromSpec(divStore, binPick);
                        break;
                    case BizPhraseType.query:
                        pickResult = await pickFromQueryScalar(divStore, binPick);
                        break;
                }
                if (pickResult === undefined) return undefined;
                namedResults[name] = pickResult;
                // divStore.setNamedResults(name, pickResult);
            }
        }

        let ret: ReturnUseBinPicks = {
            // results: namedResults,
            rearBinPick: rearPick,           // endmost pick
            rearResult: undefined,
            rearPickResultType: rearPickResultType,
        };
        refPicked.current = ret;

        let rearPickResult = await pickRear(sheetStore, rearPickResultType);
        if (rearPickResult === undefined) return undefined;

        let rearResult: PickResult[] = Array.isArray(rearPickResult) === false ?
            [rearPickResult as PickResult] : rearPickResult as PickResult[];

        ret.rearResult = rearResult;
        return ret;
    }, []);
}
