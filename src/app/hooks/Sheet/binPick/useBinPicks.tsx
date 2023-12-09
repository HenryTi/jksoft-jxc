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
    results: NamedResults;
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

    async function pickRear(sheetStore: SheetStore, namedResults: NamedResults, rearPickResultType: RearPickResultType) {
        const { rearPick } = bin;
        let pickResult: PickResult[] | PickResult;
        const { pick } = rearPick;
        switch (pick.bizPhraseType) {
            default: debugger; break;
            case BizPhraseType.atom:
                pickResult = await pickFromAtom(namedResults, rearPick);
                break;
            case BizPhraseType.spec:
                pickResult = await pickFromSpec(namedResults, rearPick);
                break;
            case BizPhraseType.query:
                pickResult = await pickFromQuery(namedResults, rearPick, rearPickResultType);
                break;
            case BizPhraseType.pend:
                pickResult = await pickFromPend(sheetStore.binStore, namedResults, rearPick);
        }
        return pickResult;
    }

    // if no detailSection add new, else edit
    return useCallback(async function (sheetStore: SheetStore, rearPickResultType: RearPickResultType = RearPickResultType.array) {
        if (bin === undefined) return;
        const { binPicks, rearPick } = bin;
        if (binPicks === undefined) return;
        let namedResults: NamedResults;
        if (refPicked.current !== undefined) {
            namedResults = refPicked.current.results;
        }
        else {
            namedResults = {
                '%sheet': sheetStore.main.binRow, // sheetBinRow ?? {},
            };
            let pickResult: PickResult;
            for (const binPick of binPicks) {
                const { name, pick } = binPick;
                const { bizPhraseType } = pick;
                if (bizPhraseType === undefined) break;
                switch (bizPhraseType) {
                    default: debugger; break;
                    case BizPhraseType.atom:
                        pickResult = await pickFromAtom(namedResults, binPick);
                        break;
                    case BizPhraseType.spec:
                        pickResult = await pickFromSpec(namedResults, binPick);
                        break;
                    case BizPhraseType.query:
                        pickResult = await pickFromQueryScalar(namedResults, binPick);
                        break;
                }
                if (pickResult === undefined) return undefined;
                namedResults[name] = pickResult;
            }
        }

        let ret: ReturnUseBinPicks = {
            results: namedResults,
            rearBinPick: rearPick,           // endmost pick
            rearResult: undefined,
            rearPickResultType: rearPickResultType,
        };
        refPicked.current = ret;

        let rearPickResult = await pickRear(sheetStore, namedResults, rearPickResultType);
        if (rearPickResult === undefined) return undefined;

        let rearResult: PickResult[] = Array.isArray(rearPickResult) === false ?
            [rearPickResult as PickResult] : rearPickResult as PickResult[];

        ret.rearResult = rearResult;
        return ret;
    }, []);
}
