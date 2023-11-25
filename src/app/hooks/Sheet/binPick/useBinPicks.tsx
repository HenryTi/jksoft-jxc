import { BinPick, EntityBin } from "app/Biz";
import { BizPhraseType } from "uqs/UqDefault";
import { useCallback } from "react";
import { usePickFromAtom } from "./fromAtom";
import { usePickFromSpec } from "./fromSpec";
import { usePickFromPend } from "./fromPend";
import { usePickFromQuery } from "./fromQuery";
import { BinRow } from "../SheetStore";

export type PickResult = { [prop: string]: any };
export interface NamedResults {
    [name: string]: PickResult;
}

export interface ReturnUseBinPicks {
    results: NamedResults;
    lastBinPick: BinPick;           // last pick
    lastResult: PickResult[];
    lastPickResultType: LastPickResultType;
};

export enum LastPickResultType {
    scalar,
    array,
}

export function useBinPicks(bin: EntityBin, sheetBinRow?: BinRow) {
    const { binPicks, lastPick } = bin;
    const pickFromAtom = usePickFromAtom();
    const pickFromSpec = usePickFromSpec();
    const pickFromPend = usePickFromPend();
    const [pickFromQueryScalar, pickFromQuery] = usePickFromQuery();

    // if no detailSection add new, else edit
    return useCallback(async function pick(lastPickResultType: LastPickResultType = LastPickResultType.array) {
        if (binPicks === undefined) return;
        let namedResults: NamedResults = {
            '%sheet': sheetBinRow ?? {},
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
        let lastPickResult: PickResult[] | PickResult;
        const { pick } = lastPick;
        switch (pick.bizPhraseType) {
            default: debugger; break;
            case BizPhraseType.atom:
                lastPickResult = await pickFromAtom(namedResults, lastPick);
                break;
            case BizPhraseType.spec:
                lastPickResult = await pickFromSpec(namedResults, lastPick);
                break;
            case BizPhraseType.query:
                lastPickResult = await pickFromQuery(namedResults, lastPick, lastPickResultType);
                break;
            case BizPhraseType.pend:
                lastPickResult = await pickFromPend(namedResults, lastPick);
        }

        if (lastPickResult === undefined) return undefined;

        let lastResult: PickResult[] = Array.isArray(lastPickResult) === false ?
            [lastPickResult as PickResult] : lastPickResult as PickResult[];

        return {
            results: namedResults,
            lastBinPick: lastPick,           // last pick
            lastResult,
            lastPickResultType,
        }
    }, []);
}
